import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const { clamp, lerp } = THREE.MathUtils

// Segment lengths (world units).
const UPPER = 1.35
const FORE = 1.15

// Resting pose the arm breathes around / returns to. Tuned to read as an arm
// reaching up-and-out: a leaned shoulder, a clear elbow bend, a cocked wrist.
const REST = {
  yaw: 0.25,
  shoulder: -0.78,
  elbow: 1.5,
  wrist: -0.35,
  grip: 0.2,
}

type Props = { staticMode?: boolean }

/**
 * An articulated arm built entirely from primitives — no model file.
 * Nested groups give a real kinematic chain: base yaw → shoulder pitch →
 * elbow pitch → wrist → two-finger gripper.
 *
 * Live mode: a slow sine "breathing" idle, plus the upper arm + gripper
 * easing toward the cursor and returning to idle when the pointer goes still.
 * Static mode (mobile / reduced motion): a single fixed pose.
 */
export default function RobotArm({ staticMode = false }: Props) {
  const base = useRef<THREE.Group>(null)
  const shoulder = useRef<THREE.Group>(null)
  const elbow = useRef<THREE.Group>(null)
  const wrist = useRef<THREE.Group>(null)
  const fingerL = useRef<THREE.Mesh>(null)
  const fingerR = useRef<THREE.Mesh>(null)

  // Normalized cursor (-1..1) + last-move timestamp for idle return.
  const pointer = useRef({ x: 0, y: 0, t: -10 })

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

  // Apply the rest pose immediately so static mode looks right on first render.
  useEffect(() => {
    base.current?.rotation.set(0, REST.yaw, 0)
    shoulder.current?.rotation.set(REST.shoulder, 0, 0)
    elbow.current?.rotation.set(REST.elbow, 0, 0)
    wrist.current?.rotation.set(REST.wrist, 0, 0)
    if (fingerL.current) fingerL.current.position.x = -REST.grip
    if (fingerR.current) fingerR.current.position.x = REST.grip
  }, [])

  useFrame(({ clock }) => {
    if (staticMode) return
    const t = clock.elapsedTime
    const p = pointer.current
    const active = performance.now() / 1000 - p.t < 2

    // Idle breathing targets.
    let yaw = REST.yaw + Math.sin(t * 0.32) * 0.22
    let sh = REST.shoulder + Math.sin(t * 0.5) * 0.1
    let el = REST.elbow + Math.sin(t * 0.4 + 1) * 0.13
    let wr = REST.wrist + Math.sin(t * 0.6) * 0.12
    const grip = REST.grip + Math.sin(t * 0.9) * 0.05

    // Blend toward the cursor when it's moving.
    if (active) {
      yaw = lerp(yaw, clamp(p.x * 0.9, -1.0, 1.0), 0.7)
      sh = lerp(sh, clamp(REST.shoulder + -p.y * 0.45, -1.3, 0.1), 0.7)
      el = lerp(el, clamp(REST.elbow + p.y * 0.3, 0.4, 1.6), 0.5)
      wr = lerp(wr, clamp(-p.y * 0.35, -0.7, 0.7), 0.5)
    }

    // Ease the joints toward their targets (smooth, never snappy).
    const k = 0.06
    if (base.current) base.current.rotation.y = lerp(base.current.rotation.y, yaw, k)
    if (shoulder.current)
      shoulder.current.rotation.x = lerp(shoulder.current.rotation.x, sh, k)
    if (elbow.current)
      elbow.current.rotation.x = lerp(elbow.current.rotation.x, el, k)
    if (wrist.current)
      wrist.current.rotation.x = lerp(wrist.current.rotation.x, wr, k)
    if (fingerL.current)
      fingerL.current.position.x = lerp(fingerL.current.position.x, -grip, k)
    if (fingerR.current)
      fingerR.current.position.x = lerp(fingerR.current.position.x, grip, k)
  })

  return (
    <group position={[0, -1.3, 0]}>
      {/* Base + column */}
      <group ref={base}>
        <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.52, 0.66, 0.32, 48]} />
          <Metal />
        </mesh>
        {/* Emissive amber ring on the base rim */}
        <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.42, 48]} />
          <meshStandardMaterial
            color="#f2a65a"
            emissive="#f2a65a"
            emissiveIntensity={0.9}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh castShadow position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.3, 0.34, 0.62, 32]} />
          <Metal light />
        </mesh>

        {/* Shoulder */}
        <group ref={shoulder} position={[0, 0.95, 0]}>
          <Joint r={0.26} />
          <mesh castShadow receiveShadow position={[0, UPPER / 2, 0]}>
            <boxGeometry args={[0.3, UPPER, 0.24]} />
            <Metal />
          </mesh>
          {/* amber accent stripe on the upper arm */}
          <mesh position={[0.16, UPPER / 2, 0]}>
            <boxGeometry args={[0.015, UPPER * 0.7, 0.12]} />
            <Emissive />
          </mesh>

          {/* Elbow */}
          <group ref={elbow} position={[0, UPPER, 0]}>
            <Joint r={0.22} />
            <mesh castShadow receiveShadow position={[0, FORE / 2, 0]}>
              <boxGeometry args={[0.24, FORE, 0.2]} />
              <Metal />
            </mesh>

            {/* Wrist + gripper */}
            <group ref={wrist} position={[0, FORE, 0]}>
              <Joint r={0.16} />
              <mesh castShadow position={[0, 0.12, 0]}>
                <boxGeometry args={[0.28, 0.18, 0.22]} />
                <Metal light />
              </mesh>
              <mesh ref={fingerL} castShadow position={[-0.2, 0.4, 0]}>
                <boxGeometry args={[0.08, 0.42, 0.17]} />
                <Metal />
              </mesh>
              <mesh ref={fingerR} castShadow position={[0.2, 0.4, 0]}>
                <boxGeometry args={[0.08, 0.42, 0.17]} />
                <Metal />
              </mesh>
              {/* amber pads on the inner gripper faces */}
              <mesh position={[0, 0.58, 0]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <Emissive />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

/* ---- shared materials / parts ---- */

function Metal({ light = false }: { light?: boolean }) {
  return (
    <meshStandardMaterial
      color={light ? '#3a3543' : '#252029'}
      metalness={0.92}
      roughness={light ? 0.42 : 0.34}
      envMapIntensity={1}
    />
  )
}

function Emissive() {
  return (
    <meshStandardMaterial
      color="#f2a65a"
      emissive="#f2a65a"
      emissiveIntensity={1.4}
      toneMapped={false}
    />
  )
}

function Joint({ r }: { r: number }) {
  return (
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r, r, 0.34, 28]} />
      <Metal light />
    </mesh>
  )
}
