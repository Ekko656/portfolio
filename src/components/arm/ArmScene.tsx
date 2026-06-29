import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'
import RobotArm from './RobotArm'
import { prefersReducedMotion, isMobile } from '../../lib/motion'

/**
 * Canvas wrapper for the hero arm. DPR capped at 2; the render loop pauses when
 * the hero scrolls out of view. Mobile / reduced-motion render a single static
 * pose (frameloop "demand" renders once on mount, then idles).
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
        shadows
        frameloop={staticMode ? 'demand' : inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [1.8, 1.0, 5.3], fov: 40 }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[4, 6, 3]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0002}
        />
        <pointLight position={[-3, 1.5, 2]} intensity={22} color="#f2a65a" distance={14} />
        <pointLight position={[2, 0.5, 3]} intensity={8} color="#9a7fd6" distance={12} />

        {/* Procedural environment (no HDRI fetch) so the metal has something
            to reflect. */}
        <Environment resolution={128}>
          <Lightformer
            form="rect"
            intensity={2}
            position={[0, 4, -3]}
            scale={[8, 6, 1]}
            color="#fff4e6"
          />
          <Lightformer
            form="rect"
            intensity={1.6}
            position={[-5, 1, 2]}
            scale={[3, 4, 1]}
            color="#f2a65a"
          />
          <Lightformer
            form="rect"
            intensity={1}
            position={[5, 0, 3]}
            scale={[3, 3, 1]}
            color="#9a7fd6"
          />
        </Environment>

        <RobotArm staticMode={staticMode} />

        <ContactShadows
          position={[0, -1.12, 0]}
          opacity={0.55}
          scale={9}
          blur={2.8}
          far={4}
          color="#000000"
          frames={staticMode ? 1 : undefined}
        />
      </Canvas>
    </div>
  )
}
