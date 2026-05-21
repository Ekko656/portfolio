import styles from './Resume.module.css';
import Reveal from './Reveal.jsx';

export default function Resume() {
  return (
    <main className="page">
      <section className={styles.resume}>
        <Reveal>
          <div className={styles.card}>
            <h2 className={styles.title}>Résumé</h2>
            <p className={styles.line}>The short version, on paper.</p>
            <a
              className="pill"
              style={{ textTransform: 'none' }}
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF ↓
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
