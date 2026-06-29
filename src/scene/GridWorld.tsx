import { Grid } from '@react-three/drei'

/**
 * The space the arm lives in: an infinite reactive grid floor that fades into
 * fog, plus the key/fill/rim lighting. Fog + a dark base give real depth.
 */
export default function GridWorld() {
  return (
    <>
      <color attach="background" args={['#0f141c']} />
      <fog attach="fog" args={['#0f141c', 9, 30]} />

      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#cdd9f2', '#10141c', 0.5]} />
      {/* key */}
      <directionalLight
        position={[6, 10, 4]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 40]} />
      </directionalLight>
      {/* steel rim + fill */}
      <pointLight position={[-6, 3, -4]} intensity={40} color="#7e9fda" distance={22} />
      <pointLight position={[4, 1.5, 6]} intensity={18} color="#ffffff" distance={18} />

      <Grid
        position={[0, 0, 0]}
        args={[60, 60]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#2a3a55"
        sectionSize={3}
        sectionThickness={1.1}
        sectionColor="#7e9fda"
        fadeDistance={32}
        fadeStrength={1.4}
        followCamera
        infiniteGrid
      />
    </>
  )
}
