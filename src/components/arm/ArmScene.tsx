import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'
import RobotArm from './RobotArm'
import Stage from './Stage'
import { prefersReducedMotion, isMobile } from '../../lib/motion'

/**
 * Canvas wrapper for the hero arm + its stage. DPR capped at 2; the render loop
 * pauses when the hero scrolls out of view. Mobile / reduced-motion render a
 * single static pose (frameloop "demand" renders once on mount).
 *
 * Camera is pulled back with margin so the arm never clips, even mid-gesture.
 */
export default function ArmScene() {
  const wrap = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const staticMode = prefersReducedMotion() || isMobile()

  useEffect(() => {
    if (staticMode || !wrap.current) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    )
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [staticMode])

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        className="!pointer-events-none"
        dpr={[1, 2]}
        shadows="soft"
        frameloop={staticMode ? 'demand' : inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [2.2, 1.2, 7.6], fov: 31 }}
      >
        <ambientLight intensity={0.9} />
        <hemisphereLight args={['#ffffff', '#c9d3e6', 0.7]} />
        <directionalLight
          position={[4, 7, 4]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />
        <directionalLight position={[-5, 3, 2]} intensity={0.6} color="#9fb4dd" />

        {/* Bright studio softboxes for clean reflections on the white shells. */}
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={3} position={[0, 5, 2]} scale={[10, 6, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.6} position={[-5, 2, 3]} scale={[4, 5, 1]} color="#dfe7f5" />
          <Lightformer form="rect" intensity={1.2} position={[5, 1, 2]} scale={[3, 4, 1]} color="#ffffff" />
        </Environment>

        {/* Scaled down slightly + lifted so the arm keeps headroom even at the
            top of a reaching gesture and never clips the canvas. */}
        <group scale={0.88} position={[0, 0.05, 0]}>
          <Stage animated={!staticMode} />
          <RobotArm staticMode={staticMode} />
        </group>

        <ContactShadows
          position={[0, -1.42, 0]}
          opacity={0.32}
          scale={11}
          blur={3}
          far={4.5}
          color="#0c1019"
          frames={staticMode ? 1 : undefined}
        />
      </Canvas>
    </div>
  )
}
