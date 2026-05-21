import styles from './Contact.module.css';
import Reveal from './Reveal.jsx';
import Sparkles from './Sparkles.jsx';
import { Icon } from './Icons.jsx';

const LINKS = [
  { label: 'ekooner656@gmail.com', href: 'mailto:ekooner656@gmail.com', icon: 'mail' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ekam-kooner/', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/Ekko656', icon: 'github' },
];

export default function Contact() {
  return (
    <main className="page">
      <Sparkles count={12} cols={3} />
      <section className={styles.contact}>
        <Reveal>
          <div className={styles.card}>
            <h2 className={styles.title}>Let's talk.</h2>
            <svg
              className={styles.underline}
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M4 7 C 48 2, 90 11, 130 6 S 188 3, 196 8" />
            </svg>

            <p className={styles.intro}>
              Reach out about robotics, embedded systems, internships, or whatever you're building.
            </p>

            <span className={styles.availability}>
              <span className={styles.dot} aria-hidden="true" />
              Open to internships, Summer 2026
            </span>

            <div className={styles.links}>
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  className={styles.link}
                  href={l.href}
                  target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={l.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                >
                  <Icon name={l.icon} size={19} />
                  <span className={styles.linkLabel}>{l.label}</span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <p className={styles.copyright}>© 2025 Ekam Kooner · Calgary → Vancouver</p>
      </section>
    </main>
  );
}
