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
const POSES: { v: Pose; move: number; hold: number }[] = [
  { v: [0.15, 0.3, 0.45, 0.15, 0.3, 1.3], move: 2.4, hold: 0.8 }, // poised centre
  { v: [0.85, 0.68, 0.32, -0.3, 1.2, 0.35], move: 2.8, hold: 0.6 }, // reach out right
  { v: [0.5, 0.12, 1.02, 0.42, -0.9, 1.6], move: 2.2, hold: 0.9 }, // curl up + inspect
  { v: [-0.6, 0.55, 0.55, 0.05, 0.6, 0.2], move: 3.0, hold: 0.5 }, // sweep front-left
  { v: [-0.95, 0.85, 0.22, -0.45, -1.3, 1.0], move: 2.6, hold: 0.7 }, // far left survey
  { v: [0.0, 0.06, 0.7, 0.3, 0.0, 1.7], move: 2.4, hold: 1.0 }, // tall neutral
]
const JOINT_NAMES = ['Rotation', 'Pitch', 'Elbow', 'Wrist_Pitch', 'Wrist_Roll', 'Jaw'] as const

const smootherstep = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1)
  return t * t * t * (t * (t * 6 - 15) + 10)
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

    JOINT_NAMES.forEach((name, i) => {
      // tiny breathing dither on top so holds never look frozen
      const dither = Math.sin(t * (0.9 + i * 0.17) + i * 1.7) * 0.025
      const v = cur[i] + (nxt[i] - cur[i]) * k + dither
      j[name]?.setJointValue(v)
      armState[name] = v as never
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
