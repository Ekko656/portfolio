import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A proper quadcopter that flies like one: four motor pods with fast
 * horizontal rotors, the body pitching forward into travel and banking into
 * turns (computed from the path derivative), aviation nav lights (red left /
 * green right / white strobe), and a downward camera gimbal.
 */

const PODS: [number, number][] = [
  [-0.3, -0.3],
  [0.3, -0.3],
  [-0.3, 0.3],
  [0.3, 0.3],
]

function Rotor({ dir }: { dir: 1 | -1 }) {
  const blades = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (blades.current) blades.current.rotation.y = clock.elapsedTime * 46 * dir
  })
  return (
    <group>
      {/* motor */}
      <mesh castShadow>
        <cylinderGeometry args={[0.045, 0.055, 0.07, 12]} />
        <meshStandardMaterial color="#232a36" metalness={0.85} roughness={0.35} />
      </mesh>
      {/* spinning blades — thin, horizontal, blurred by speed */}
      <group ref={blades} position={[0, 0.05, 0]}>
        {[0, Math.PI / 2].map((r, i) => (
          <mesh key={i} rotation={[0, r, 0]}>
            <boxGeometry args={[0.34, 0.006, 0.028]} />
            <meshStandardMaterial color="#9aa6bd" metalness={0.6} roughness={0.4} transparent opacity={0.55} />
          </mesh>
        ))}
        {/* prop disc suggestion */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.17, 24]} />
          <meshBasicMaterial color="#aeb9cc" transparent opacity={0.07} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* prop guard ring */}
      <mesh position={[0, 0.045, 0]}>
        <torusGeometry args={[0.19, 0.012, 8, 28]} />
        <meshStandardMaterial color="#39435a" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  )
}

export default function Drone() {
  const root = useRef<THREE.Group>(null)
  const strobe = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (!root.current) return

    // figure-8-ish patrol (lissajous) — always inside the room, mid-air
    const a = t * 0.12
    const px = Math.sin(a) * 7.2
    const pz = Math.sin(a * 2) * 3.2 - 4.5
    const py = 4.6 + Math.sin(t * 0.5) * 0.35

    // analytic velocity → heading, forward pitch, bank
    const vx = Math.cos(a) * 7.2 * 0.12
    const vz = Math.cos(a * 2) * 6.4 * 0.12
    // acceleration (for bank direction)
    const ax = -Math.sin(a) * 7.2 * 0.0144
    const az = -Math.sin(a * 2) * 12.8 * 0.0144
    const speed = Math.hypot(vx, vz)
    const heading = Math.atan2(vx, vz)
    // lateral acceleration (cross of velocity/accel) → bank into the turn
    const lat = (vx * az - vz * ax) / Math.max(speed, 0.001)

    root.current.position.set(px, py, pz)
    root.current.rotation.order = 'YXZ'
    root.current.rotation.y = heading
    root.current.rotation.x = THREE.MathUtils.clamp(speed * 0.28, 0, 0.32) // nose into travel
    root.current.rotation.z = THREE.MathUtils.clamp(lat * 0.9, -0.35, 0.35) // bank

    if (strobe.current)
      strobe.current.emissiveIntensity = (t * 1.4) % 1 < 0.08 ? 5 : 0.1
  })

  return (
    <group ref={root} scale={0.95}>
      {/* body: top plate, core, belly */}
      <mesh castShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.46]} />
        <meshStandardMaterial color="#cdd5e2" metalness={0.65} roughness={0.35} envMapIntensity={1.1} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.24, 0.09, 0.34]} />
        <meshStandardMaterial color="#232a36" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* nose gimbal + lens */}
      <group position={[0, -0.07, 0.24]}>
        <mesh>
          <sphereGeometry args={[0.07, 14, 14]} />
          <meshStandardMaterial color="#1a212d" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.02, 0.055]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 10]} />
          <meshStandardMaterial color="#04141c" emissive="#39c6ff" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      </group>

      {/* diagonal arms + rotor pods */}
      {PODS.map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x * 0.55, 0.01, z * 0.55]} rotation={[0, Math.atan2(x, z), Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.022, 0.34, 8]} />
            <meshStandardMaterial color="#39435a" metalness={0.8} roughness={0.4} />
          </mesh>
          <group position={[x, 0.03, z]}>
            <Rotor dir={i % 2 ? 1 : -1} />
          </group>
        </group>
      ))}

      {/* landing skids */}
      {[-0.12, 0.12].map((x, i) => (
        <mesh key={i} position={[x, -0.12, 0]}>
          <boxGeometry args={[0.02, 0.05, 0.3]} />
          <meshStandardMaterial color="#39435a" metalness={0.7} roughness={0.5} />
        </mesh>
      ))}

      {/* nav lights: red left, green right, white strobe tail */}
      <mesh position={[-0.3, 0.02, -0.3]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color="#140404" emissive="#ff3b30" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>
      <mesh position={[0.3, 0.02, -0.3]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color="#04140a" emissive="#34d158" emissiveIntensity={2.6} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.05, -0.24]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial ref={strobe} color="#101418" emissive="#ffffff" emissiveIntensity={0.1} toneMapped={false} />
      </mesh>

      {/* soft under-light */}
      <pointLight position={[0, -0.2, 0]} intensity={3} distance={6} color="#7fc4ff" />
    </group>
  )
}
