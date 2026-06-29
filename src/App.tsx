import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import { Suspense } from 'react'
import Scene from './scene/Scene'
import Overlay from './scene/Overlay'
import { PAGES } from './scene/stations'

export default function App() {
  return (
    <div className="fixed inset-0 bg-base">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [4.2, 2.4, 7.5], fov: 42 }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={PAGES} damping={0.3}>
            <Scene />
            <Scroll html>
              <Overlay />
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>

      {/* Fixed brand mark + scroll hint (DOM, above the canvas) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-8 py-6 md:px-16">
        <a
          href="#"
          className="pointer-events-auto font-medium tracking-tight text-ink"
        >
          <span className="text-accent">ekam</span>
          <span className="text-muted">.kooner</span>
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto rounded-md border border-hair px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ink backdrop-blur-sm transition-colors hover:border-accent/50 hover:text-accent"
        >
          Résumé
        </a>
      </div>
    </div>
  )
}
