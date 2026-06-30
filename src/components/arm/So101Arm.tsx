import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import URDFLoader from 'urdf-loader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

type Joints = Record<string, { setJointValue: (v: number) => void }>

/**
 * The real open-source SO-ARM101 (TheRobotStudio / MuammerBay ROS2 URDF),
 * loaded from URDF + per-link STL meshes via urdf-loader and re-shaded in PBR
 * metal. Articulated by its named revolute joints (Rotation, Pitch, Elbow,
 * Wrist_Pitch, Wrist_Roll, Jaw).
 */
export default function So101Arm() {
  const [robot, setRobot] = useState<THREE.Object3D | null>(null)
  const joints = useRef<Joints | null>(null)

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
    // smooth, contained idle so the arm stays poised + framed (placeholder)
    const set = (name: string, v: number) => j[name]?.setJointValue(v)
    set('Rotation', Math.sin(t * 0.22) * 0.45 + Math.sin(t * 0.55) * 0.08)
    set('Pitch', 0.32 + Math.sin(t * 0.4) * 0.2)
    set('Elbow', 0.7 + Math.sin(t * 0.33 + 1) * 0.25)
    set('Wrist_Pitch', -0.2 + Math.sin(t * 0.5) * 0.3)
    set('Wrist_Roll', Math.sin(t * 0.28) * 0.6)
    set('Jaw', 0.9 + Math.sin(t * 0.8) * 0.6)
    void delta
  })

  if (!robot) return null
  // URDF is Z-up; rotate into the scene's Y-up and scale to size
  return <primitive object={robot} rotation={[-Math.PI / 2, 0, 0]} scale={8} />
}
