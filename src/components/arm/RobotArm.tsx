import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getMatcaps } from '../../landing/matcaps'

const { clamp, lerp } = THREE.MathUtils

const UPPER = 1.35
const FORE = 1.15
const SHOULDER_Y = 0.95

const LIM = {
  yaw: [-Math.PI, Math.PI] as const,
  shoulder: [-1.5, 1.1] as const,
  elbow: [0.05, 2.4] as const,
  wrist: [-1.2, 1.2] as const,
}

function solveIK(up: number, fwd: number) {
  let d = Math.hypot(up, fwd)
  d = clamp(d, Math.abs(UPPER - FORE) + 0.05, UPPER + FORE - 0.04)
  const cosE = (d * d - UPPER * UPPER - FORE * FORE) / (2 * UPPER * FORE)
  const elbow = Math.acos(clamp(cosE, -1, 1))
  const phi = Math.atan2(fwd, up)
  const psi = Math.atan2(FORE * Math.sin(elbow), UPPER + FORE * Math.cos(elbow))
  return { shoulder: phi - psi, elbow }
}

type Props = {
  /** World-space target the gripper reaches toward (choreographed). */
  target?: RefObject<THREE.Vector3>
  /** Gripper openness 0 (closed) .. 1 (open). */
  grip?: RefObject<number>
  /** Empty placed at the gripper tip so choreography can read its world pos. */
  tipRef?: RefObject<THREE.Object3D>
}

/**
 * Articulated arm driven by an external, choreographed end-effector target via
 * 2-link IK (no cursor control). Matcap-shaded for a premium baked look.
 */
export default function RobotArm({ target, grip, tipRef }: Props) {
  const base = useRef<THREE.Group>(null)
  const shoulder = useRef<THREE.Group>(null)
  const elbow = useRef<THREE.Group>(null)
  const wrist = useRef<THREE.Group>(null)
  const jawL = useRef<THREE.Group>(null)
  const jawR = useRef<THREE.Group>(null)

  const mc = useMemo(() => getMatcaps(), [])
  const baseWorld = useRef(new THREE.Vector3())
  const idle = useRef(new THREE.Vector3(1.3, 1.7, 1.3))

  useFrame((state, delta) => {
    if (!base.current || !shoulder.current || !elbow.current || !wrist.current)
      return
    const t = state.clock.elapsedTime
    base.current.getWorldPosition(baseWorld.current)

    // target: choreographed if provided, else a slow graceful drift
    let goal: THREE.Vector3
    if (target?.current) {
      goal = target.current
    } else {
      idle.current.set(
        baseWorld.current.x + Math.sin(t * 0.3) * 1.4,
        SHOULDER_Y + 0.9 + Math.sin(t * 0.47) * 0.5,
        baseWorld.current.z + 1.9 + Math.cos(t * 0.24) * 0.7,
      )
      goal = idle.current
    }

    const lx = goal.x - baseWorld.current.x
    const lz = goal.z - baseWorld.current.z
    const ly = goal.y - baseWorld.current.y
    const yaw = clamp(Math.atan2(lx, lz), ...LIM.yaw)
    const h = clamp(Math.hypot(lx, lz), 0.4, UPPER + FORE - 0.05)
    const v = clamp(ly - SHOULDER_Y, -1.4, 2.2)
    const { shoulder: sh, elbow: el } = solveIK(v, h)
    const shA = clamp(sh, ...LIM.shoulder)
    const elA = clamp(el, ...LIM.elbow)
    const wrA = clamp(Math.atan2(h, v) - (shA + elA), ...LIM.wrist)
    const open = grip?.current != null ? grip.current : 0.5
    const jaw = lerp(0.08, 0.5, clamp(open, 0, 1))

    const k = 1 - Math.exp(-9 * delta)
    base.current.rotation.y = lerp(base.current.rotation.y, yaw, k)
    shoulder.current.rotation.x = lerp(shoulder.current.rotation.x, shA, k)
    elbow.current.rotation.x = lerp(elbow.current.rotation.x, elA, k)
    wrist.current.rotation.x = lerp(wrist.current.rotation.x, wrA, k)
    if (jawL.current) jawL.current.rotation.z = lerp(jawL.current.rotation.z, jaw, k)
    if (jawR.current) jawR.current.rotation.z = lerp(jawR.current.rotation.z, -jaw, k)
  })

  return (
    <group position={[0, -1.3, 0]}>
      <group ref={base}>
        <mesh castShadow position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.5, 0.66, 0.32, 48]} />
          <meshMatcapMaterial matcap={mc.shellLight} />
        </mesh>
        <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.44, 48]} />
          <meshBasicMaterial color="#7e9fda" toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.3, 0.34, 0.62, 32]} />
          <meshMatcapMaterial matcap={mc.shellDark} />
        </mesh>

        <group ref={shoulder} position={[0, SHOULDER_Y, 0]}>
          <Joint mc={mc.joint} r={0.26} />
          <mesh position={[0, UPPER / 2, 0]}>
            <boxGeometry args={[0.3, UPPER, 0.24]} />
            <meshMatcapMaterial matcap={mc.shellLight} />
          </mesh>
          <mesh position={[0.155, UPPER / 2, 0]}>
            <boxGeometry args={[0.02, UPPER * 0.7, 0.13]} />
            <meshMatcapMaterial matcap={mc.accent} />
          </mesh>

          <group ref={elbow} position={[0, UPPER, 0]}>
            <Joint mc={mc.joint} r={0.22} />
            <mesh position={[0, FORE / 2, 0]}>
              <boxGeometry args={[0.24, FORE, 0.2]} />
              <meshMatcapMaterial matcap={mc.shellLight} />
            </mesh>

            <group ref={wrist} position={[0, FORE, 0]}>
              <Joint mc={mc.joint} r={0.15} />
              <Gripper mc={mc} jawL={jawL} jawR={jawR} tipRef={tipRef} />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

function Gripper({
  mc,
  jawL,
  jawR,
  tipRef,
}: {
  mc: ReturnType<typeof getMatcaps>
  jawL: RefObject<THREE.Group>
  jawR: RefObject<THREE.Group>
  tipRef?: RefObject<THREE.Object3D>
}) {
  return (
    <group position={[0, 0.04, 0]}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.1, 24]} />
        <meshMatcapMaterial matcap={mc.shellDark} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.34, 0.2, 0.26]} />
        <meshMatcapMaterial matcap={mc.shellLight} />
      </mesh>
      <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.34, 16]} />
        <meshMatcapMaterial matcap={mc.joint} />
      </mesh>

      {/* point where the arm "holds" things */}
      <object3D ref={tipRef} position={[0, 0.62, 0]} />

      <group ref={jawL} position={[-0.13, 0.28, 0]}>
        <Jaw mc={mc} />
      </group>
      <group ref={jawR} position={[0.13, 0.28, 0]}>
        <Jaw mc={mc} mirror />
      </group>
    </group>
  )
}

function Jaw({
  mc,
  mirror = false,
}: {
  mc: ReturnType<typeof getMatcaps>
  mirror?: boolean
}) {
  const s = mirror ? -1 : 1
  return (
    <group>
      <mesh position={[s * -0.02, 0.16, 0]}>
        <boxGeometry args={[0.07, 0.34, 0.18]} />
        <meshMatcapMaterial matcap={mc.shellLight} />
      </mesh>
      <group position={[s * -0.03, 0.33, 0]} rotation={[0, 0, s * 0.7]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.06, 0.2, 0.16]} />
          <meshMatcapMaterial matcap={mc.shellDark} />
        </mesh>
        <mesh position={[s * 0.035, 0.06, 0]}>
          <boxGeometry args={[0.015, 0.16, 0.13]} />
          <meshMatcapMaterial matcap={mc.accent} />
        </mesh>
      </group>
    </group>
  )
}

function Joint({ mc, r }: { mc: THREE.Texture; r: number }) {
  return (
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r, r, 0.34, 28]} />
      <meshMatcapMaterial matcap={mc} />
    </mesh>
  )
}
