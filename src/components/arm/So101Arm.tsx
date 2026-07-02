import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import URDFLoader from 'urdf-loader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { armState } from '../../landing/armState'

type Joints = Record<string, { setJointValue: (v: number) => void }>

/**
 * Choreographed idle: the arm eases between hand-tuned poses, holding briefly
 * at each — every joint participates and no pose can dip the gripper into the
 * floor. Values: [Rotation, Pitch, Elbow, Wrist_Pitch, Wrist_Roll, Jaw].
 */
type Pose = [number, number, number, number, number, number]
// Geometry note: Pitch=0 → upper arm vertical; Elbow≈0.72 → forearm aligned
// with the upper arm. E < 0.72 swings the forearm UP, E > 0.72 folds it down.
// Poses are chosen so BOTH segments travel — leans back, forearm skyward,
// wide sweeps — never the dead "first up, second hanging" default.
const POSES: { v: Pose; move: number; hold: number }[] = [
  { v: [0.1, 0.35, 0.55, 0.1, 0.2, 1.2], move: 2.4, hold: 0.7 }, // poised
  { v: [0.7, 0.9, 0.1, -0.55, 0.9, 1.5], move: 2.8, hold: 0.6 }, // lean fwd, forearm up
  { v: [-0.45, -0.55, 0.3, -0.35, -1.1, 0.4], move: 2.9, hold: 0.8 }, // lean back, gaze up
  { v: [0.45, 0.75, 1.0, 0.3, 0.5, 0.15], move: 2.3, hold: 0.6 }, // forward inspect
  { v: [-0.85, 0.5, 0.35, -0.25, 1.3, 1.6], move: 3.0, hold: 0.6 }, // sweep left, rising
  { v: [0.05, 0.15, 0.3, -0.45, -0.6, 1.0], move: 2.5, hold: 0.9 }, // tall, open
]
const JOINT_NAMES = ['Rotation', 'Pitch', 'Elbow', 'Wrist_Pitch', 'Wrist_Roll', 'Jaw'] as const

const smootherstep = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1)
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/**
 * Floor-safety guard applied every frame (covers pose transitions too):
 * keeps the forearm's absolute angle from vertical under control so the
 * gripper can never pass through the dais.
 */
function guard(v: number[]): number[] {
  const [R, P, E0, WP0, WR, J] = v
  const E = Math.min(E0, 2.0 - P) // forearm angle P+(E-0.72) ≤ ~1.28
  const theta2 = P + (E - 0.72)
  const WP = Math.min(WP0, 1.5 - theta2) // wrist can't push the tip lower
  return [R, P, E, WP, WR, J]
}

/**
 * The real open-source SO-ARM101 (TheRobotStudio / MuammerBay ROS2 URDF),
 * loaded from URDF + per-link STL meshes via urdf-loader and re-shaded in PBR
 * metal. Articulated by its named revolute joints (Rotation, Pitch, Elbow,
 * Wrist_Pitch, Wrist_Roll, Jaw).
 */
export default function So101Arm() {
  const [robot, setRobot] = useState<THREE.Object3D | null>(null)
  const joints = useRef<Joints | null>(null)
  const seqRef = useRef({ idx: 0, start: 0 })

  useEffect(() => {
    const manager = new THREE.LoadingManager()
    const loader = new URDFLoader(manager)
    ;(loader as unknown as { packages: Record<string, string> }).packages = {
      so_arm_description: '/so101',
    }

    // Re-skin the URDF's baked colours into the theme: light brushed steel for
    // the printed body, dark charcoal metal for the servos.
    const bodyMat = new THREE.MeshStandardMaterial({
      color: '#dbe2ee',
      metalness: 0.5,
      roughness: 0.5,
      envMapIntensity: 1.0,
    })
    const servoMat = new THREE.MeshStandardMaterial({
      color: '#262b34',
      metalness: 0.7,
      roughness: 0.42,
      envMapIntensity: 0.9,
    })

    ;(loader as unknown as {
      loadMeshCb: (
        path: string,
        m: THREE.LoadingManager,
        done: (o: THREE.Object3D) => void,
      ) => void
    }).loadMeshCb = (path, m, done) => {
      new STLLoader(m).load(path, (geom) => {
        geom.computeVertexNormals()
        done(new THREE.Mesh(geom))
      })
    }

    let alive = true
    let built: THREE.Object3D | null = null
    loader.load('/so101/so101.urdf', (r: THREE.Object3D) => {
      built = r
    })
    // wait until every STL mesh has finished, then re-skin + mount
    manager.onLoad = () => {
      if (!alive || !built) return
      built.traverse((o) => {
        const mesh = o as THREE.Mesh & { material?: THREE.Material & { name?: string } }
        if (mesh.isMesh) {
          mesh.material = mesh.material?.name === 'sts3215' ? servoMat : bodyMat
          mesh.castShadow = true
          mesh.receiveShadow = true
        }
      })
      joints.current = (built as unknown as { joints: Joints }).joints
      setRobot(built)
    }
    return () => {
      alive = false
    }
  }, [])

  useFrame(({ clock }, delta) => {
    const j = joints.current
    if (!j) return
    const t = clock.elapsedTime
    // pose-sequencer idle: ease between safe keyframed poses, all joints live.
    // Values are also published to armState for the holographic telemetry.
    const seq = seqRef.current
    const cur = POSES[seq.idx].v
    const nxt = POSES[(seq.idx + 1) % POSES.length].v
    const { move, hold } = POSES[(seq.idx + 1) % POSES.length]
    const elapsed = t - seq.start
    const k = smootherstep(elapsed / move)

    const blended = JOINT_NAMES.map((_, i) => {
      // tiny breathing dither on top so holds never look frozen
      const dither = Math.sin(t * (0.9 + i * 0.17) + i * 1.7) * 0.025
      return cur[i] + (nxt[i] - cur[i]) * k + dither
    })
    const safe = guard(blended)
    JOINT_NAMES.forEach((name, i) => {
      j[name]?.setJointValue(safe[i])
      armState[name] = safe[i] as never
    })

    if (elapsed > move + hold) {
      seq.idx = (seq.idx + 1) % POSES.length
      seq.start = t
    }
    armState.t = t
    void delta
  })

  if (!robot) return null
  // URDF is Z-up; rotate into the scene's Y-up and scale to size
  return <primitive object={robot} rotation={[-Math.PI / 2, 0, 0]} scale={8} />
}
