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

        {/* Right: arm canvas mounts here (Phase 3) */}
        <div className="relative hidden h-[440px] md:block">
          {/* Warm key glow that the arm will sit inside. */}
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[90px]" />
          <div className="panel absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(242,166,90,0.06),transparent_60%)]" />
            <span className="label">arm // r3f canvas</span>
          </div>
        </div>
      </div>
    </section>
  )
}
