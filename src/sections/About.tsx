import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'

export default function About() {
  return (
    <section id="about" className="shell scroll-mt-20 py-28 md:py-36">
      <Reveal stagger>
        <SectionHeader index="01 / 03" title="About" meta="// who" />
        <div className="grid gap-12 md:grid-cols-[1fr_280px]">
          <p className="max-w-2xl font-display text-2xl leading-snug text-ink/90 md:text-3xl">
            Placeholder thesis — set large. The work points at who the
            technology is able to serve.
          </p>
          <aside className="space-y-4 font-mono text-xs text-muted">
            <div className="hair-rule pt-3">focus // humanoid robotics</div>
            <div className="hair-rule pt-3">now // UBC Bionics, embedded</div>
            <div className="hair-rule pt-3">based // Vancouver, BC</div>
          </aside>
        </div>
      </Reveal>
    </section>
  )
}
