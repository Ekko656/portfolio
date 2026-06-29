import { lazy, Suspense, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import SignalField from '../components/SignalField'
import TypeRoles from '../components/TypeRoles'

// Keep Three.js out of the initial bundle — the arm streams in after paint.
const ArmScene = lazy(() => import('../components/arm/ArmScene'))

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  // Load-in: mask-reveal the headline lines, then settle the supporting copy.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('[data-hero-line]', {
        yPercent: 115,
        duration: 0.9,
        stagger: 0.12,
      })
        .from('[data-hero-fade]', { opacity: 0, y: 16, stagger: 0.1 }, '-=0.4')
        .from('[data-hero-chip]', { opacity: 0, duration: 0.6 }, '-=0.7')
    },
    { scope: root },
  )

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      {/* Ambient signal field, behind everything in the hero */}
      <SignalField />

      <div className="shell grid w-full items-center gap-10 md:grid-cols-2">
        {/* Left: headline */}
        <div className="relative z-10">
          <div data-hero-chip className="label mb-6 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-glow" />
            // status: building
          </div>

          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tightest text-ink sm:text-6xl md:text-7xl">
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                Ekam
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-hero-line className="block text-sheen">
                Kooner
              </span>
            </span>
          </h1>

          <p
            data-hero-fade
            className="mt-5 font-mono text-sm text-muted"
          >
            <span className="text-ink/70">{'> '}</span>
            <TypeRoles />
          </p>

          <p
            data-hero-fade
            className="mt-5 max-w-md font-mono text-sm leading-relaxed text-muted"
          >
            Biomedical Engineering (Robotics) @ UBC. Building toward humanoid
            robotics — embedded systems, control, and machine learning.
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="rounded-md bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-base transition-opacity hover:opacity-90"
            >
              view work
            </a>
            <a
              href="#contact"
              className="rounded-md border border-hair px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:border-accent/50 hover:text-accent"
            >
              get in touch
            </a>
          </div>
        </div>

        {/* Right: interactive robot arm. Pointer-events none so it never
            blocks selecting the headline text beside/behind it. */}
        <div className="pointer-events-none relative hidden h-[560px] md:block">
          {/* Soft key glow the arm sits inside. */}
          <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-steel/20 blur-[90px]" />
          <Suspense fallback={null}>
            <ArmScene />
          </Suspense>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        data-hero-fade
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted transition-colors hover:text-ink md:flex"
      >
        scroll
        <span className="h-8 w-px bg-gradient-to-b from-accent to-transparent" />
      </a>
    </section>
  )
}
