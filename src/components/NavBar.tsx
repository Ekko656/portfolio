const LINKS = [
  { label: 'about', href: '#about' },
  { label: 'projects', href: '#projects' },
  { label: 'contact', href: '#contact' },
]

export default function NavBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-hair bg-base/60 backdrop-blur-md">
        <nav className="shell flex h-16 items-center justify-between">
          <a
            href="#top"
            className="font-mono text-sm font-medium tracking-tight text-ink"
          >
            <span className="text-accent">ekam</span>
            <span className="text-muted">.kooner</span>
          </a>

          <ul className="flex items-center gap-1 md:gap-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-md px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="ml-1 rounded-md border border-hair px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:border-accent/40 hover:text-accent"
              >
                resume
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
