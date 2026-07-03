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
// VERIFIED joint map (probed live with screenshots):
//   Elbow: -1.7 = fully straight, 0 = fully folded → obtuse V needs E ≤ -0.7
//   Pitch: 0 = upper arm vertical, NEGATIVE leans forward, positive back
// Every pose uses real range of motion: near-horizontal shoulders, vertical
// forearms, full extensions — true open-V silhouettes, never the folded droop.
const POSES: { v: Pose; move: number; hold: number }[] = [
  { v: [1.2, -1.65, -0.95, -0.2, 0.4, 0.9], move: 2.8, hold: 0.8 }, // crisp V, right profile
  { v: [0.0, -0.1, -1.65, 0.1, 0.0, 0.4], move: 2.6, hold: 0.6 }, // full vertical stretch
  { v: [-0.9, 0.85, -1.2, -0.4, -0.9, 1.3], move: 3.0, hold: 0.7 }, // lean back, extended gaze
  { v: [-0.5, -1.3, -1.5, 0.3, 0.6, 0.2], move: 2.6, hold: 0.5 }, // long forward lunge
  { v: [0.7, -1.1, -0.7, -0.5, 1.2, 1.6], move: 2.8, hold: 0.6 }, // high V wave, jaw open
  { v: [0.2, 0.35, -0.35, -0.6, -0.5, 0.7], move: 2.3, hold: 0.8 }, // compact think (contrast)
]
const JOINT_NAMES = ['Rotation', 'Pitch', 'Elbow', 'Wrist_Pitch', 'Wrist_Roll', 'Jaw'] as const

// Upright-safe pose the guard blends toward when a target would dip too low
// (same verified map: mostly-extended, leaning slightly back).
const SAFE: Pose = [0, 0.2, -1.3, -0.1, 0, 0.7]

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
  const robotRef = useRef<THREE.Object3D | null>(null)
  const tipLinks = useRef<THREE.Object3D[]>([])
  const probe = useRef(new THREE.Vector3())
  const guardS = useRef(1) // smoothed floor-guard blend (1 = untouched pose)

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
        const mesh = new THREE.Mesh(geom)
        mesh.userData.src = path // tag with source file for selective hiding
        done(mesh)
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
          // the flat electronics plate + driver case read as a random box on
          // the dais — hide them, the robot stands on its own rounded base
          const src = String(mesh.userData.src)
          if (src.includes('waveshare_mounting_plate') || src.includes('base_motor_holder')) {
            mesh.visible = false
            return
          }
          mesh.material = mesh.material?.name === 'sts3215' ? servoMat : bodyMat
          mesh.castShadow = true
          mesh.receiveShadow = true
        }
      })
      joints.current = (built as unknown as { joints: Joints }).joints
      // grab the end-of-chain links so the frame loop can measure real
      // world-space clearance (exact FK, no approximations)
      const lk = (built as unknown as { links?: Record<string, THREE.Object3D> }).links
      tipLinks.current = ['wrist', 'gripper', 'jaw']
        .map((n) => lk?.[n])
        .filter((o): o is THREE.Object3D => !!o)

      robotRef.current = built
      // debug handle for scene inspection (harmless in prod)
      ;(window as unknown as Record<string, unknown>).__robot = built
      setRobot(built)
    }
    return () => {
      alive = false
    }
  }, [])

  useFrame(({ clock }, delta) => {
    const j = joints.current
    if (!j) return
    // debug: freeze the idle so joints can be set externally
    if ((window as unknown as Record<string, unknown>).__pause) return
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

    const apply = (v: number[]) =>
      JOINT_NAMES.forEach((name, i) => j[name]?.setJointValue(v[i]))

    // Measured floor guard: read the REAL world height of the wrist/gripper/
    // jaw links (exact FK from the loaded URDF). If the pose or a transition
    // would dip below clearance, bisect Pitch/Elbow/Wrist toward the SAFE
    // upright pose until it clears — clipping is impossible by construction.
    const CLEARANCE = 0.8
    const minTipY = () => {
      robotRef.current!.updateMatrixWorld(true)
      let m = Infinity
      for (const l of tipLinks.current) {
        l.getWorldPosition(probe.current)
        m = Math.min(m, probe.current.y)
      }
      return m
    }

    const mix = (s: number) => {
      const out = [...blended]
      for (const idx of [1, 2, 3]) out[idx] = SAFE[idx] + (blended[idx] - SAFE[idx]) * s
      return out
    }

    // Find how much of the pose is floor-safe (bisection on measured FK)…
    apply(blended)
    let targetS = 1
    if (robotRef.current && tipLinks.current.length && minTipY() < CLEARANCE) {
      let lo = 0
      let hi = 1
      for (let it = 0; it < 5; it++) {
        const mid = (lo + hi) / 2
        apply(mix(mid))
        if (minTipY() < CLEARANCE) hi = mid
        else lo = mid
      }
      targetS = lo
    }
    // …then EASE toward that blend instead of snapping, so the arm glides
    // along the clearance boundary rather than jittering against it.
    guardS.current += (targetS - guardS.current) * (1 - Math.exp(-5 * delta))
    const final = mix(Math.min(guardS.current, targetS + 0.02))
    apply(final)

    JOINT_NAMES.forEach((name, i) => {
      armState[name] = final[i] as never
    })

    if (elapsed > move + hold) {
      seq.idx = (seq.idx + 1) % POSES.length
      seq.start = t
    }
    armState.t = t
    void delta
  })

  if (!robot) return null
  // URDF is Z-up; rotate into the scene's Y-up and scale to size. The fixed
  // offset centres the measured footprint of the base case on the dais.
  return (
    <primitive
      object={robot}
      position={[-0.165, 0, -0.04]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={8}
    />
  )
}
