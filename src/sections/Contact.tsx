import SectionHeader from '../components/SectionHeader'

export default function Contact() {
  return (
    <section id="contact" className="shell scroll-mt-20 py-28 md:py-36">
      <SectionHeader index="03 / 03" title="Contact" meta="// reach out" />
      <div className="panel p-8 md:p-12">
        <p className="max-w-xl font-display text-2xl leading-snug text-ink md:text-3xl">
          Open to internships, Summer 2026.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.18em]">
          <a href="mailto:ekooner656@gmail.com" className="text-accent hover:underline">
            email
          </a>
          <a href="https://github.com/Ekko656" className="text-muted hover:text-ink">
            github
          </a>
          <a href="https://www.linkedin.com/in/ekam-kooner/" className="text-muted hover:text-ink">
            linkedin
          </a>
        </div>
      </div>
      <footer className="mt-16 flex items-center justify-between font-mono text-xs text-muted">
        <span>© 2026 Ekam Kooner</span>
        <span>Calgary → Vancouver</span>
      </footer>
    </section>
  )
}
