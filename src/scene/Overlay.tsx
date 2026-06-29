import TypeRoles from '../components/TypeRoles'

/**
 * HTML content layered over the 3D world via drei's <Scroll html>. Each block
 * is one viewport tall so it stays in sync with the camera stations. The layer
 * is pointer-events-none; only the interactive bits opt back in.
 */
export default function Overlay() {
  return (
    <div className="pointer-events-none w-screen text-ink">
      {/* 0 — Hero */}
      <section className="flex h-screen flex-col justify-center px-8 md:px-16">
        <div className="pointer-events-auto max-w-lg">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-hair bg-surface/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for Summer 2026
          </div>
          <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tightest md:text-8xl">
            Ekam
            <br />
            <span className="text-sheen">Kooner</span>
          </h1>
          <p className="mt-6 text-lg text-muted">
            Focused on <TypeRoles />
          </p>
        </div>
      </section>

      {/* 1 — About */}
      <section className="flex h-screen items-center px-8 md:px-16">
        <div className="pointer-events-auto max-w-xl">
          <span className="eyebrow mb-5">Profile</span>
          <p className="font-display text-3xl leading-snug md:text-4xl">
            Most of what gets built today is built for the people who need it
            least. I want to point my work{' '}
            <span className="text-sheen">somewhere else</span> — at humanoid
            robotics that actually serves people.
          </p>
        </div>
      </section>

      {/* 2 — Projects */}
      <section className="flex h-screen items-center justify-end px-8 md:px-16">
        <div className="pointer-events-auto max-w-md text-right">
          <span className="eyebrow mb-5 justify-end">Work</span>
          <p className="font-display text-3xl leading-snug md:text-4xl">
            Simulated arms, prosthetics, honeypots, autonomous robots.
          </p>
          <p className="mt-4 text-muted">A build log — scroll on to explore.</p>
        </div>
      </section>

      {/* 3 — Contact */}
      <section className="flex h-screen flex-col items-center justify-center px-8 text-center">
        <div className="pointer-events-auto">
          <span className="eyebrow mb-5 justify-center">Contact</span>
          <h2 className="font-display text-5xl font-bold tracking-tightest md:text-7xl">
            Let's build.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:ekooner656@gmail.com"
              className="rounded-md bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-base transition-opacity hover:opacity-90"
            >
              Say hello
            </a>
            <a
              href="https://github.com/Ekko656"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-hair px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:border-accent/50 hover:text-accent"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
