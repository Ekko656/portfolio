import { RoundedBox, Float } from '@react-three/drei'
import * as THREE from 'three'

/** A tall lab light column — dark pillar with a glowing vertical strip. */
function LightColumn({
  position,
  height = 6,
}: {
  position: [number, number, number]
  height?: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[0.32, height, 0.32]} />
        <meshStandardMaterial color="#1a212d" metalness={0.85} roughness={0.4} />
      </mesh>
      <mesh position={[0, height / 2, 0.17]}>
        <boxGeometry args={[0.08, height * 0.82, 0.02]} />
        <meshStandardMaterial color="#0c1424" emissive="#5b8bff" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** A floating structural panel with an emissive edge — abstract architecture. */
function Panel({
  position,
  rotation = [0, 0, 0],
  size = [3, 2, 0.12],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  size?: [number, number, number]
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={size} radius={0.05} smoothness={3} castShadow>
          <meshStandardMaterial color="#161d29" metalness={0.8} roughness={0.45} />
        </RoundedBox>
        <mesh position={[0, 0, size[2] / 2 + 0.001]}>
          <planeGeometry args={[size[0] * 0.86, 0.03]} />
          <meshStandardMaterial color="#0c1424" emissive="#4f8bff" emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

/**
 * The environment that grounds the arm: a ring of lab light-columns plus a few
 * floating structural panels at depth, all fading into the fog — a tasteful
 * blend of sleek lab and structured-abstract space (not a literal room).
 */
export default function Surroundings() {
  const cols: [number, number, number][] = [
    [-9, 0, -7],
    [-12, 0, 0],
    [-9, 0, 7],
    [9, 0, -7],
    [12, 0, 1],
    [9, 0, 8],
    [0, 0, -12],
    [-5, 0, -11],
    [5, 0, -11],
  ]
  return (
    <group>
      {cols.map((p, i) => (
        <LightColumn key={i} position={p} height={5 + (i % 3)} />
      ))}

      <Panel position={[-8.5, 4.5, -8]} rotation={[0, 0.5, 0]} size={[3.4, 2.2, 0.12]} />
      <Panel position={[9, 5.5, -7]} rotation={[0, -0.6, 0.04]} size={[3, 2, 0.12]} />
      <Panel position={[8, 3, 3]} rotation={[0, -0.9, -0.03]} size={[2.4, 1.6, 0.1]} />
      <Panel position={[-8.5, 6, 1]} rotation={[0, 0.7, 0.05]} size={[2.6, 1.7, 0.1]} />

      {/* overhead soft key panel — high + large so it's a glow, not a billboard */}
      <mesh position={[0, 13, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 9]} />
        <meshStandardMaterial color="#0c1424" emissive="#aac4ff" emissiveIntensity={0.9} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
