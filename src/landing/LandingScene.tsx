import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import RobotArm from '../components/arm/RobotArm'
import { getMatcaps } from './matcaps'

function Stage() {
  const mc = getMatcaps()
  return (
    <group>
      {/* plinth */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.25, 1.45, 0.16, 64]} />
        <meshMatcapMaterial matcap={mc.shellDark} />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.3, 64]} />
        <meshBasicMaterial color="#7e9fda" toneMapped={false} />
      </mesh>
      {/* reactive grid floor into fog */}
      <Grid
        position={[0, 0, 0]}
        args={[40, 40]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#2a3a55"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#456"
        fadeDistance={26}
        fadeStrength={1.5}
        infiniteGrid
      />
    </group>
  )
}

/** The wordless landing: matcap arm on a stage you can orbit around. */
export default function LandingScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [3.8, 2.1, 6], fov: 42 }}
    >
      <color attach="background" args={['#1a222f']} />
      <fog attach="fog" args={['#1a222f', 10, 30]} />
      <ambientLight intensity={0.8} />

      <Suspense fallback={null}>
        <Stage />
        <group position={[0, 1.3, 0]}>
          <RobotArm />
        </group>

        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={11}
        minPolarAngle={0.5}
        maxPolarAngle={1.5}
        target={[0, 1.1, 0]}
      />
    </Canvas>
  )
}
