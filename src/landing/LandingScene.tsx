import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import So101Arm from '../components/arm/So101Arm'
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
      {/* emissive trim rings */}
      <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.95, 2.0, 80]} />
        <meshStandardMaterial color="#0c1424" emissive="#4f8bff" emissiveIntensity={1.6} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.5, 80]} />
        <meshStandardMaterial color="#0c1424" emissive="#4f8bff" emissiveIntensity={1.4} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function World() {
  return (
    <>
      {/* reflective lab floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          resolution={1024}
          mixBlur={1}
          mixStrength={2.2}
          blur={[400, 100]}
          mirror={0.5}
          color="#0c1018"
          metalness={0.85}
          roughness={0.5}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
        />
      </mesh>

      <Dais />
      <group position={[0, 0.23, 0]}>
        <So101Arm />
      </group>
      <Motes />
    </>
  )
}

/** Cinematic lighting + environment for reflective metal. */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      {/* key */}
      <directionalLight
        position={[5, 9, 4]}
        intensity={3.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      >
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 30]} />
      </directionalLight>
      {/* cool rim from behind */}
      <spotLight position={[-6, 5, -5]} angle={0.6} penumbra={1} intensity={120} color="#4f7bd6" distance={30} />
      {/* subtle warm kicker (kept low so the metal stays steel, not gold) */}
      <pointLight position={[5, 1.5, -3]} intensity={9} color="#ffd2b0" distance={16} />

      {/* studio reflections (no HDRI fetch) */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 2]} scale={[12, 8, 1]} color="#dfe8ff" />
        <Lightformer form="rect" intensity={2.2} position={[-6, 3, 3]} scale={[5, 8, 1]} color="#6f93e6" />
        <Lightformer form="rect" intensity={1.4} position={[6, 2, -2]} scale={[5, 5, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={2} position={[2, 1, 4]} scale={3} color="#39c6ff" />
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
      camera={{ position: [4.4, 2.4, 6.2], fov: 40 }}
    >
      <color attach="background" args={['#0b0f17']} />
      <fog attach="fog" args={['#0b0f17', 9, 32]} />

      <Suspense fallback={null}>
        <Lighting />
        <World />

        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
          <Vignette eskil={false} offset={0.3} darkness={0.75} />
        </EffectComposer>
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={12}
        minPolarAngle={0.4}
        maxPolarAngle={1.52}
        target={[0, 1.2, 0]}
      />
    </Canvas>
  )
}
