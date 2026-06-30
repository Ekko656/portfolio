import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const { clamp, lerp } = THREE.MathUtils

// Segment lengths (world units).
const UPPER = 1.35
const FORE = 1.15
const SHOULDER_Y = 0.95 // height of the shoulder pivot above the base origin

// Joint limits — generous; IK normally stays well inside these.
const LIM = {
  yaw: [-1.3, 1.3] as const,
  shoulder: [-1.4, 1.0] as const,
  elbow: [0.05, 2.3] as const,
  wrist: [-1.1, 1.1] as const,
}

type Props = { staticMode?: boolean }

/**
 * Solve the shoulder + elbow for a planar target (up, fwd) measured from the
 * shoulder, with the chain resting along +Y. Returns angles that place the
 * gripper at the target — a real 2-link IK, so the bend is always natural.
 */
function solveIK(up: number, fwd: number) {
  let d = Math.hypot(up, fwd)
  d = clamp(d, Math.abs(UPPER - FORE) + 0.05, UPPER + FORE - 0.04)
  const cosE = (d * d - UPPER * UPPER - FORE * FORE) / (2 * UPPER * FORE)
  const elbow = Math.acos(clamp(cosE, -1, 1))
  const phi = Math.atan2(fwd, up)
  const psi = Math.atan2(FORE * Math.sin(elbow), UPPER + FORE * Math.cos(elbow))
  return { shoulder: phi - psi, elbow }
}

/**
 * Articulated arm that genuinely tracks the cursor in 3D: the pointer is
 * unprojected to a world point at the arm's depth, the base yaws to face it,
 * and 2-link IK reaches the gripper toward it. When the cursor is idle the arm
 * eases to a slow drifting target so motion is always smooth and natural.
 */
export default function RobotArm({ staticMode = false }: Props) {
  const base = useRef<THREE.Group>(null)
  const shoulder = useRef<THREE.Group>(null)
  const elbow = useRef<THREE.Group>(null)
  const wrist = useRef<THREE.Group>(null)
  const jawL = useRef<THREE.Group>(null)
  const jawR = useRef<THREE.Group>(null)

  const { camera } = useThree()
  const ptr = useRef({ x: 0, y: 0, t: -10 })
  const goal = useRef(new THREE.Vector3(1.4, 1.8, 1.4)) // smoothed world target
  const raycaster = useRef(new THREE.Raycaster())
  const tmp = useRef(new THREE.Vector3())
  const baseWorld = useRef(new THREE.Vector3())

  useEffect(() => {
    if (staticMode) return
    const onMove = (e: PointerEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1
      ptr.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
      ptr.current.t = performance.now() / 1000
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [staticMode])

  useFrame((state, delta) => {
    if (!base.current || !shoulder.current || !elbow.current || !wrist.current)
      return
    const t = state.clock.elapsedTime
    const engaged = performance.now() / 1000 - ptr.current.t < 1.6

    base.current.getWorldPosition(baseWorld.current)
    const armCenter = tmp.current.copy(baseWorld.current).setY(SHOULDER_Y + 0.4)

    // --- choose a world target -------------------------------------------
    const desired = new THREE.Vector3()
    if (engaged && !staticMode) {
      // unproject the cursor to the arm's depth along its ray
      raycaster.current.setFromCamera(
        new THREE.Vector2(ptr.current.x, ptr.current.y),
        camera,
      )
      const dist = camera.position.distanceTo(armCenter)
      raycaster.current.ray.at(dist, desired)
    } else {
      // slow idle drift in front of the arm
      desired.set(
        baseWorld.current.x + Math.sin(t * 0.32) * 1.5,
        SHOULDER_Y + 0.9 + Math.sin(t * 0.5) * 0.5,
        baseWorld.current.z + 1.9 + Math.cos(t * 0.26) * 0.7,
      )
    }

    // ease the target; reach quicker than it relaxes
    const kt = 1 - Math.exp(-(engaged ? 7 : 2.2) * delta)
    goal.current.lerp(desired, kt)

    // --- inverse kinematics in the base-local cylindrical frame -----------
    const lx = goal.current.x - baseWorld.current.x
    const lz = goal.current.z - baseWorld.current.z
    const ly = goal.current.y - baseWorld.current.y
    const yaw = clamp(Math.atan2(lx, lz), ...LIM.yaw)
    const h = clamp(Math.hypot(lx, lz), 0.5, UPPER + FORE - 0.05)
    const v = clamp(ly - SHOULDER_Y, -1.3, 2.1)
    const { shoulder: sh, elbow: el } = solveIK(v, h)
    const shA = clamp(sh, ...LIM.shoulder)
    const elA = clamp(el, ...LIM.elbow)
    // keep the gripper pointing along the reach line toward the target
    const phi = Math.atan2(h, v)
    const wrA = clamp(phi - (shA + elA), ...LIM.wrist)
    // jaws: open while searching, close a little when locked onto the cursor
    const open = engaged ? 0.16 + Math.sin(t * 2) * 0.04 : 0.42

    // --- apply with smoothing --------------------------------------------
    const k = 1 - Math.exp(-9 * delta)
    base.current.rotation.y = lerp(base.current.rotation.y, yaw, k)
    shoulder.current.rotation.x = lerp(shoulder.current.rotation.x, shA, k)
    elbow.current.rotation.x = lerp(elbow.current.rotation.x, elA, k)
    wrist.current.rotation.x = lerp(wrist.current.rotation.x, wrA, k)
    if (jawL.current) jawL.current.rotation.z = lerp(jawL.current.rotation.z, open, k)
    if (jawR.current) jawR.current.rotation.z = lerp(jawR.current.rotation.z, -open, k)
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
        <group ref={shoulder} position={[0, SHOULDER_Y, 0]}>
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

            {/* Wrist + real two-finger gripper */}
            <group ref={wrist} position={[0, FORE, 0]}>
              <Joint r={0.15} />
              <Gripper jawL={jawL} jawR={jawR} />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

/* ---- the gripper: a palm housing + two pivoting jaws with inner pads ---- */

function Gripper({
  jawL,
  jawR,
}: {
  jawL: React.RefObject<THREE.Group>
  jawR: React.RefObject<THREE.Group>
}) {
  return (
    <group position={[0, 0.04, 0]}>
      {/* wrist plate */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.1, 24]} />
        <Shell />
      </mesh>
      {/* palm housing */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[0.34, 0.2, 0.26]} />
        <Shell light />
      </mesh>
      {/* knuckle bar */}
      <mesh castShadow position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.34, 16]} />
        <Joint r={0.05} bare />
      </mesh>

      <group ref={jawL} position={[-0.13, 0.28, 0]}>
        <Jaw />
      </group>
      <group ref={jawR} position={[0.13, 0.28, 0]}>
        <Jaw mirror />
      </group>
    </group>
  )
}

/** One jaw: a proximal link + an inward-angled fingertip with a grip pad. */
function Jaw({ mirror = false }: { mirror?: boolean }) {
  const s = mirror ? -1 : 1
  return (
    <group>
      {/* proximal link */}
      <mesh castShadow position={[s * -0.02, 0.16, 0]}>
        <boxGeometry args={[0.07, 0.34, 0.18]} />
        <Shell light />
      </mesh>
      {/* angled fingertip */}
      <group position={[s * -0.03, 0.33, 0]} rotation={[0, 0, s * 0.7]}>
        <mesh castShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[0.06, 0.2, 0.16]} />
          <Shell />
        </mesh>
        {/* inner grip pad */}
        <mesh position={[s * 0.035, 0.06, 0]}>
          <boxGeometry args={[0.015, 0.16, 0.13]} />
          <meshStandardMaterial color="#2a3242" metalness={0.2} roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

/* ---- shared materials / parts ---- */

function Shell({ light = false }: { light?: boolean }) {
  return (
    <meshStandardMaterial
      color={light ? '#f5f7fb' : '#c3ccdb'}
      metalness={0.25}
      roughness={light ? 0.35 : 0.5}
      envMapIntensity={0.85}
    />
  )
}

function Accent() {
  return <meshStandardMaterial color="#5573b8" metalness={0.4} roughness={0.4} />
}

function Joint({ r, bare = false }: { r: number; bare?: boolean }) {
  if (bare) {
    return <meshStandardMaterial color="#9aa6bd" metalness={0.6} roughness={0.35} />
  }
  return (
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r, r, 0.34, 28]} />
      <meshStandardMaterial color="#9aa6bd" metalness={0.55} roughness={0.38} />
    </mesh>
  )
}
