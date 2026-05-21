import styles from './Contact.module.css';
import Reveal from './Reveal.jsx';

const LINKS = [
  { label: 'ekooner656@gmail.com', href: 'mailto:ekooner656@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ekam-kooner/' },
  { label: 'GitHub', href: 'https://github.com/Ekko656' },
];

export default function Contact() {
  return (
    <main className="page">
      <section className={styles.contact}>
        <Reveal>
          <div className={styles.card}>
            <h2 className={styles.title}>Let's talk.</h2>
            <div className={styles.links}>
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  className={styles.link}
                  href={l.href}
                  target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={l.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
        <p className={styles.copyright}>© 2025 Ekam Kooner</p>
      </section>
    </main>
  );
}
