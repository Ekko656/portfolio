import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const FLOOR_Y = -1.25

/**
 * The arm's environment: a pedestal it stands on, a faint blueprint floor with
 * concentric rings, and a slow-rotating "scanner" ring for ambient life. Gives
 * the arm a place to be instead of floating in space.
 */
export default function Stage({ animated = true }: { animated?: boolean }) {
  const scanner = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (animated && scanner.current) scanner.current.rotation.y += delta * 0.35
  })

  return (
    <group position={[0, FLOOR_Y, 0]}>
      {/* Pedestal the base sits on (white, to match the robot shells) */}
      <mesh position={[0, -0.09, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.05, 1.2, 0.18, 64]} />
        <meshStandardMaterial color="#e4e9f2" metalness={0.1} roughness={0.65} />
      </mesh>
      <mesh position={[0, -0.182, 0]}>
        <cylinderGeometry args={[1.2, 1.24, 0.02, 64]} />
        <meshStandardMaterial color="#7e9fda" metalness={0.4} roughness={0.45} />
      </mesh>

      {/* Faint platform disc, just lifted off the slate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]} receiveShadow>
        <circleGeometry args={[3.4, 64]} />
        <meshStandardMaterial
          color="#3a4554"
          metalness={0}
          roughness={1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Concentric guide rings */}
      {[1.5, 2.2, 2.9].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.168, 0]}>
          <ringGeometry args={[r, r + 0.012, 96]} />
          <meshBasicMaterial color="#7e9fda" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Slow scanner sweep */}
      <group ref={scanner} position={[0, -0.165, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.64, 64, 1, 0, Math.PI * 0.5]} />
          <meshBasicMaterial color="#a9c0ef" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}
