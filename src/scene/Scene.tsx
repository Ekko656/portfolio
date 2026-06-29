import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import CameraRig from './CameraRig'
import GridWorld from './GridWorld'
import RobotArm from '../components/arm/RobotArm'

function Plinth() {
  return (
    <group>
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.25, 1.45, 0.16, 64]} />
        <meshStandardMaterial color="#1a2230" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.3, 64]} />
        <meshBasicMaterial color="#7e9fda" toneMapped={false} />
      </mesh>
    </group>
  )
}

/** The full 3D world (everything that lives inside the Canvas). */
export default function Scene() {
  return (
    <>
      <CameraRig />
      <GridWorld />

      <Plinth />
      {/* lift the arm so its base sits on the grid (it is internally offset) */}
      <group position={[0, 1.3, 0]}>
        <RobotArm />
      </group>

      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.7} />
      </EffectComposer>
    </>
  )
}
