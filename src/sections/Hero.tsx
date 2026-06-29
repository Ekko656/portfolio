import { lazy, Suspense } from 'react'

// Keep Three.js out of the initial bundle — the arm streams in after paint.
const ArmScene = lazy(() => import('../components/arm/ArmScene'))

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      <div className="shell grid w-full items-center gap-10 md:grid-cols-2">
        {/* Left: headline */}
        <div className="relative z-10">
          <div className="label mb-6 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            // status: building
          </div>

          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tightest text-ink sm:text-6xl md:text-7xl">
            Ekam
            <br />
            <span className="text-sheen">Kooner</span>
          </h1>

          <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-muted">
            Biomedical Engineering (Robotics) @ UBC. Building toward humanoid
            robotics — embedded systems, control, and machine learning.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="rounded-md bg-accent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-base transition-opacity hover:opacity-90"
            >
              view work
            </a>
            <a
              href="#contact"
              className="rounded-md border border-hair px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:border-accent/40 hover:text-accent"
            >
              get in touch
            </a>
          </div>
        </div>

        {/* Right: interactive robot arm. Pointer-events none so it never
            blocks selecting the headline text beside/behind it. */}
        <div className="pointer-events-none relative hidden h-[520px] md:block">
          {/* Warm key glow the arm sits inside. */}
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[90px]" />
          <Suspense fallback={null}>
            <ArmScene />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
