import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import So101Arm from '../components/arm/So101Arm'
import MegaLab from './lab/MegaLab'
import Motes from './Motes'

/** Tiered dais the arm stands on. */
function Dais() {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.0, 2.2, 0.1, 64]} />
        <meshStandardMaterial color="#2a3140" metalness={0.9} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.16, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.7, 0.14, 64]} />
        <meshStandardMaterial color="#323a4b" metalness={0.95} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.95, 2.0, 80]} />
        <meshStandardMaterial color="#0c1424" emissive="#4f8bff" emissiveIntensity={1.6} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function World() {
  return (
    <>
      <MegaLab />
      <Dais />
      {/* the hero — dead centre on the dais */}
      <group position={[0, 0.32, 0]}>
        <So101Arm />
      </group>
      <Motes count={450} />
    </>
  )
}

/** Cinematic lighting: white key, cool rim, and the room's own pooled lights. */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[5, 9, 6]}
        intensity={2.6}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 32]} />
      </directionalLight>
      <spotLight position={[-7, 6, -6]} angle={0.65} penumbra={1} intensity={110} color="#4f7bd6" distance={32} />
      <pointLight position={[6, 2, -4]} intensity={7} color="#ffd2b0" distance={14} />

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.6} position={[0, 7, 3]} scale={[12, 8, 1]} color="#dfe8ff" />
        <Lightformer form="rect" intensity={2} position={[-7, 3, 2]} scale={[5, 8, 1]} color="#6f93e6" />
        <Lightformer form="rect" intensity={1.3} position={[7, 2, -3]} scale={[5, 5, 1]} color="#ffffff" />
      </Environment>
    </>
  )
}

export default function LandingScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ position: [0, 2.7, 9.8], fov: 42 }}
    >
      <color attach="background" args={['#0b0f17']} />
      <fog attach="fog" args={['#0b0f17', 13, 34]} />

      <Suspense fallback={null}>
        <Lighting />
        <World />

        <EffectComposer>
          <Bloom intensity={0.85} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
          <Vignette eskil={false} offset={0.3} darkness={0.72} />
        </EffectComposer>
      </Suspense>

      {/* straight-on composed view; drag explores within limits so the
          composition can't be lost */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={5.5}
        maxDistance={12}
        minPolarAngle={1.0}
        maxPolarAngle={1.5}
        minAzimuthAngle={-0.8}
        maxAzimuthAngle={0.8}
        target={[0, 1.7, 0]}
      />
    </Canvas>
  )
}
