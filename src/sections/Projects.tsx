import SectionHeader from '../components/SectionHeader'

export default function Projects() {
  return (
    <section id="projects" className="shell scroll-mt-20 py-28 md:py-36">
      <SectionHeader index="02 / 03" title="Projects" meta="// build log" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="panel-interactive flex h-48 flex-col justify-between p-5"
          >
            <span className="label">
              {String(i + 1).padStart(2, '0')} / 06
            </span>
            <span className="font-mono text-sm text-muted">project slot</span>
          </div>
        ))}
      </div>
    </section>
  )
}
