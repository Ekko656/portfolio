import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const { clamp, lerp } = THREE.MathUtils

// Segment lengths (world units).
const UPPER = 1.35
const FORE = 1.15

// Relaxed pose the arm gravitates toward between gestures.
const REST = {
  yaw: 0.2,
  shoulder: -0.72,
  elbow: 1.42,
  wrist: -0.3,
  grip: 0.2,
}

// Joint limits — keep the silhouette readable and inside the frame.
// Upper bounds kept conservative so the arm always stays elbow-bent and
// inside the frame — never straightens into a tall clipping pose.
const LIM = {
  yaw: [-0.95, 1.05] as const,
  shoulder: [-1.15, -0.55] as const,
  elbow: [1.12, 1.68] as const,
  wrist: [-0.75, 0.6] as const,
  grip: [0.1, 0.3] as const,
}

type Pose = { yaw: number; shoulder: number; elbow: number; wrist: number; grip: number }

const rand = (a: number, b: number) => a + Math.random() * (b - a)

type Props = { staticMode?: boolean }

/**
 * Articulated arm from primitives — base yaw → shoulder → elbow → wrist →
 * two-finger gripper. Motion is built to feel alive, not looped:
 *  - layered incommensurate sines give a non-repeating organic sway,
 *  - a lightweight behaviour timer fires occasional natural gestures
 *    (scan, reach, ponder, settle) toward randomized targets,
 *  - the cursor takes over when it moves — the arm "looks" at the pointer —
 *    then eases back to autonomous idle when the pointer goes still.
 */
export default function RobotArm({ staticMode = false }: Props) {
  const base = useRef<THREE.Group>(null)
  const shoulder = useRef<THREE.Group>(null)
  const elbow = useRef<THREE.Group>(null)
  const wrist = useRef<THREE.Group>(null)
  const fingerL = useRef<THREE.Mesh>(null)
  const fingerR = useRef<THREE.Mesh>(null)

  const pointer = useRef({ x: 0, y: 0, t: -10 })
  const target = useRef<Pose>({ ...REST })
  const nextGesture = useRef(0)
  const seed = useRef(Math.random() * 1000)

  useEffect(() => {
    if (staticMode) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      pointer.current.t = performance.now() / 1000
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [staticMode])

  // Apply the rest pose immediately so static mode is correct on first render.
  useEffect(() => {
    base.current?.rotation.set(0, REST.yaw, 0)
    shoulder.current?.rotation.set(REST.shoulder, 0, 0)
    elbow.current?.rotation.set(REST.elbow, 0, 0)
    wrist.current?.rotation.set(REST.wrist, 0, 0)
    if (fingerL.current) fingerL.current.position.x = -REST.grip
    if (fingerR.current) fingerR.current.position.x = REST.grip
  }, [])

  useFrame(({ clock }, delta) => {
    if (staticMode) return
    const t = clock.elapsedTime
    const s = seed.current
    const active = performance.now() / 1000 - pointer.current.t < 1.6

    if (active) {
      // Track the cursor — aim the whole arm toward the pointer.
      const p = pointer.current
      target.current = {
        yaw: clamp(p.x * 0.95, ...LIM.yaw),
        shoulder: clamp(REST.shoulder + -p.y * 0.5, ...LIM.shoulder),
        elbow: clamp(REST.elbow + p.y * 0.4, ...LIM.elbow),
        wrist: clamp(-p.y * 0.45, ...LIM.wrist),
        grip: 0.27,
      }
      // Re-engage idle gestures shortly after the cursor leaves.
      nextGesture.current = t + 1.2
    } else if (t > nextGesture.current) {
      // Pick a fresh autonomous gesture and a randomized time to hold it.
      target.current = {
        yaw: clamp(REST.yaw + rand(-0.7, 0.8), ...LIM.yaw),
        shoulder: clamp(REST.shoulder + rand(-0.18, 0.22), ...LIM.shoulder),
        elbow: clamp(REST.elbow + rand(-0.45, 0.18), ...LIM.elbow),
        wrist: clamp(rand(-0.6, 0.45), ...LIM.wrist),
        grip: rand(...LIM.grip),
      }
      nextGesture.current = t + rand(3.2, 7.5)
    }

    // Non-repeating organic micro-motion (irrational frequency mix).
    const nYaw = Math.sin(t * 0.37 + s) * 0.05 + Math.sin(t * 0.913 + s) * 0.025
    const nSh = Math.sin(t * 0.29 + s * 1.3) * 0.035
    const nEl = Math.sin(t * 0.43 + s * 0.7) * 0.04 + Math.sin(t * 1.1) * 0.02
    const nWr = Math.sin(t * 0.61 + s) * 0.06
    const nGr = (Math.sin(t * 0.8 + s) * 0.5 + 0.5) * 0.02

    const tg = target.current
    // Frame-rate independent smoothing; slower = more graceful follow-through.
    const k = 1 - Math.exp(-2.4 * delta)
    const kf = 1 - Math.exp(-3.2 * delta)

    if (base.current)
      base.current.rotation.y = lerp(base.current.rotation.y, tg.yaw + nYaw, k)
    if (shoulder.current)
      shoulder.current.rotation.x = lerp(
        shoulder.current.rotation.x,
        tg.shoulder + nSh,
        k,
      )
    if (elbow.current)
      elbow.current.rotation.x = lerp(elbow.current.rotation.x, tg.elbow + nEl, k)
    if (wrist.current)
      wrist.current.rotation.x = lerp(wrist.current.rotation.x, tg.wrist + nWr, k)
    if (fingerL.current)
      fingerL.current.position.x = lerp(fingerL.current.position.x, -(tg.grip + nGr), kf)
    if (fingerR.current)
      fingerR.current.position.x = lerp(fingerR.current.position.x, tg.grip + nGr, kf)
  })

  return (
    <group position={[0, -1.25, 0]}>
      {/* Base + column */}
      <group ref={base}>
        <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.5, 0.66, 0.32, 48]} />
          <Shell light />
        </mesh>
        {/* Accent collar on the base */}
        <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.44, 48]} />
          <meshStandardMaterial color="#2f4f93" metalness={0.3} roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh castShadow position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.3, 0.34, 0.62, 32]} />
          <Shell />
        </mesh>

        {/* Shoulder */}
        <group ref={shoulder} position={[0, 0.95, 0]}>
          <Joint r={0.26} />
          <mesh castShadow receiveShadow position={[0, UPPER / 2, 0]}>
            <boxGeometry args={[0.3, UPPER, 0.24]} />
            <Shell light />
          </mesh>
          {/* navy accent stripe */}
          <mesh position={[0.155, UPPER / 2, 0]}>
            <boxGeometry args={[0.02, UPPER * 0.7, 0.13]} />
            <Accent />
          </mesh>

          {/* Elbow */}
          <group ref={elbow} position={[0, UPPER, 0]}>
            <Joint r={0.22} />
            <mesh castShadow receiveShadow position={[0, FORE / 2, 0]}>
              <boxGeometry args={[0.24, FORE, 0.2]} />
              <Shell light />
            </mesh>

            {/* Wrist + gripper */}
            <group ref={wrist} position={[0, FORE, 0]}>
              <Joint r={0.16} />
              <mesh castShadow position={[0, 0.12, 0]}>
                <boxGeometry args={[0.28, 0.18, 0.22]} />
                <Shell />
              </mesh>
              <mesh ref={fingerL} castShadow position={[-0.2, 0.4, 0]}>
                <boxGeometry args={[0.08, 0.42, 0.17]} />
                <Shell light />
              </mesh>
              <mesh ref={fingerR} castShadow position={[0.2, 0.4, 0]}>
                <boxGeometry args={[0.08, 0.42, 0.17]} />
                <Shell light />
              </mesh>
              {/* status pip between the jaws */}
              <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial
                  color="#2f4f93"
                  emissive="#2f4f93"
                  emissiveIntensity={0.8}
                  toneMapped={false}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

/* ---- shared materials / parts ---- */

// White/light robot shells with grey for the recessed structural parts.
function Shell({ light = false }: { light?: boolean }) {
  return (
    <meshStandardMaterial
      color={light ? '#f5f7fb' : '#c3ccdb'}
      metalness={0.2}
      roughness={light ? 0.35 : 0.5}
      envMapIntensity={0.85}
    />
  )
}

function Accent() {
  return <meshStandardMaterial color="#2f4f93" metalness={0.4} roughness={0.4} />
}

function Joint({ r }: { r: number }) {
  return (
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r, r, 0.34, 28]} />
      <meshStandardMaterial color="#9aa6bd" metalness={0.55} roughness={0.38} />
    </mesh>
  )
}
