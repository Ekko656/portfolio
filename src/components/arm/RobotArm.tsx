import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const { clamp, lerp } = THREE.MathUtils

// Segment lengths (world units).
const UPPER = 1.35
const FORE = 1.15

// Relaxed pose the arm gravitates toward between gestures.
const REST = { yaw: 0.2, shoulder: -0.72, elbow: 1.42, wrist: -0.3, grip: 0.2 }

// Joint limits — generous enough for the reach, bounded so it stays in frame.
// The shoulder is kept leaning (never near-vertical) so the elbow bend always
// stays broadside to the camera instead of foreshortening into a pole.
const LIM = {
  yaw: [-0.7, 0.7] as const,
  shoulder: [-1.15, -0.32] as const,
  elbow: [0.75, 1.8] as const,
  wrist: [-1.0, 0.8] as const,
  grip: [0.1, 0.3] as const,
}

// Where the arm sits on screen, in normalized [0,1] coords — used to decide
// when the cursor is "close" enough to reach for.
const ARM_CX = 0.74
const ARM_CY = 0.46

type Pose = { yaw: number; shoulder: number; elbow: number; wrist: number; grip: number }
const rand = (a: number, b: number) => a + Math.random() * (b - a)

/**
 * Two-link planar inverse kinematics. Given an end-effector target (up, fwd)
 * relative to the shoulder, returns the shoulder + elbow angles (measured from
 * the +Y/up axis, matching the mesh's local frame) that place the gripper there.
 */
function solveIK(up: number, fwd: number) {
  let d = Math.hypot(up, fwd)
  d = clamp(d, Math.abs(UPPER - FORE) + 0.06, UPPER + FORE - 0.06)
  const cosE = (d * d - UPPER * UPPER - FORE * FORE) / (2 * UPPER * FORE)
  const elbow = Math.acos(clamp(cosE, -1, 1))
  const phi = Math.atan2(fwd, up)
  const psi = Math.atan2(FORE * Math.sin(elbow), UPPER + FORE * Math.cos(elbow))
  return { shoulder: phi - psi, elbow }
}

type Props = { staticMode?: boolean }

/**
 * Articulated arm from primitives. When the cursor comes near, the arm reaches
 * for it with real 2-link IK — the gripper tracks toward the pointer and the
 * whole chain articulates like a manipulator. Otherwise it runs an autonomous
 * idle: layered incommensurate sines plus occasional natural gestures, so it
 * never reads as looped or static.
 */
export default function RobotArm({ staticMode = false }: Props) {
  const base = useRef<THREE.Group>(null)
  const shoulder = useRef<THREE.Group>(null)
  const elbow = useRef<THREE.Group>(null)
  const wrist = useRef<THREE.Group>(null)
  const fingerL = useRef<THREE.Mesh>(null)
  const fingerR = useRef<THREE.Mesh>(null)

  // Cursor in normalized [-1,1] over the window + last-move time.
  const pointer = useRef({ x: 0, y: 0, t: -10 })
  const idle = useRef<Pose>({ ...REST })
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
    const p = pointer.current
    const moved = performance.now() / 1000 - p.t < 1.6

    // How close is the cursor to the arm? (normalized screen distance)
    const nx = (p.x + 1) / 2
    const ny = (p.y + 1) / 2
    const dist = Math.hypot(nx - ARM_CX, ny - ARM_CY)
    const engage = moved ? clamp(1 - dist / 0.5, 0, 1) : 0

    // --- autonomous idle target (random gestures held for a while) ---
    if (engage < 0.15 && t > nextGesture.current) {
      idle.current = {
        yaw: clamp(REST.yaw + rand(-0.25, 0.25), ...LIM.yaw),
        shoulder: clamp(REST.shoulder + rand(-0.16, 0.16), ...LIM.shoulder),
        elbow: clamp(REST.elbow + rand(-0.3, 0.1), ...LIM.elbow),
        wrist: clamp(rand(-0.5, 0.4), ...LIM.wrist),
        grip: rand(...LIM.grip),
      }
      nextGesture.current = t + rand(3.2, 7.5)
    }
    if (engage >= 0.15) nextGesture.current = t + 1.0

    // --- IK reach target (only worth computing when engaged) ---
    let goal = idle.current
    if (engage > 0.001) {
      // Base turns toward the cursor's horizontal offset — the arm swings to
      // face it (this is the visible left/right tracking).
      const yaw = clamp((nx - ARM_CX) * 2.6, ...LIM.yaw)
      // Cursor height → in-plane reach direction (up when high, lower when low).
      const alpha = lerp(0.55, 1.4, clamp(ny + (0.5 - ARM_CY), 0, 1))
      const reach = 1.55
      const sol = solveIK(reach * Math.cos(alpha), reach * Math.sin(alpha))
      const sh = clamp(sol.shoulder, ...LIM.shoulder)
      const el = clamp(sol.elbow, ...LIM.elbow)
      // Gripper points along the reach direction.
      const wr = clamp(alpha - (sh + el), ...LIM.wrist)
      const ikPose: Pose = { yaw, shoulder: sh, elbow: el, wrist: wr, grip: 0.27 }
      // Blend idle → IK by how engaged we are.
      goal = {
        yaw: lerp(idle.current.yaw, ikPose.yaw, engage),
        shoulder: lerp(idle.current.shoulder, ikPose.shoulder, engage),
        elbow: lerp(idle.current.elbow, ikPose.elbow, engage),
        wrist: lerp(idle.current.wrist, ikPose.wrist, engage),
        grip: lerp(idle.current.grip, ikPose.grip, engage),
      }
    }

    // Organic micro-motion (irrational frequency mix), softened while reaching.
    const m = 1 - engage * 0.7
    const nYaw = (Math.sin(t * 0.37 + s) * 0.05 + Math.sin(t * 0.913 + s) * 0.025) * m
    const nSh = Math.sin(t * 0.29 + s * 1.3) * 0.035 * m
    const nEl = (Math.sin(t * 0.43 + s * 0.7) * 0.04 + Math.sin(t * 1.1) * 0.02) * m
    const nWr = Math.sin(t * 0.61 + s) * 0.06 * m
    const nGr = (Math.sin(t * 0.8 + s) * 0.5 + 0.5) * 0.02

    // Reach a touch quicker than it relaxes — responsive but never snappy.
    const k = 1 - Math.exp(-(2.4 + engage * 4) * delta)
    const kf = 1 - Math.exp(-3.4 * delta)

    if (base.current)
      base.current.rotation.y = lerp(base.current.rotation.y, goal.yaw + nYaw, k)
    if (shoulder.current)
      shoulder.current.rotation.x = lerp(shoulder.current.rotation.x, goal.shoulder + nSh, k)
    if (elbow.current)
      elbow.current.rotation.x = lerp(elbow.current.rotation.x, goal.elbow + nEl, k)
    if (wrist.current)
      wrist.current.rotation.x = lerp(wrist.current.rotation.x, goal.wrist + nWr, k)
    if (fingerL.current)
      fingerL.current.position.x = lerp(fingerL.current.position.x, -(goal.grip + nGr), kf)
    if (fingerR.current)
      fingerR.current.position.x = lerp(fingerR.current.position.x, goal.grip + nGr, kf)
  })

  return (
    <group position={[0, -1.3, 0]}>
      {/* Base + column */}
      <group ref={base}>
        <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.5, 0.66, 0.32, 48]} />
          <Shell light />
        </mesh>
        <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.44, 48]} />
          <meshStandardMaterial color="#7e9fda" metalness={0.4} roughness={0.45} side={THREE.DoubleSide} />
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
              <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#7e9fda" emissive="#7e9fda" emissiveIntensity={0.8} toneMapped={false} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

/* ---- shared materials / parts ---- */

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
  return <meshStandardMaterial color="#5573b8" metalness={0.4} roughness={0.4} />
}

function Joint({ r }: { r: number }) {
  return (
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r, r, 0.34, 28]} />
      <meshStandardMaterial color="#9aa6bd" metalness={0.55} roughness={0.38} />
    </mesh>
  )
}
