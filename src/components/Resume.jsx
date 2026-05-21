import styles from './Resume.module.css';
import Reveal from './Reveal.jsx';
import Sparkles from './Sparkles.jsx';

export default function Resume() {
  return (
    <main className="page">
      <Sparkles count={14} cols={3} parallax />
      <section className={styles.resume}>
        <Reveal>
          <div className={styles.head}>
            <h2 className={styles.title}>Résumé</h2>
            <p className={styles.line}>The short version, on paper.</p>
            <div className={styles.actions}>
              <a
                className="pill"
                style={{ textTransform: 'none' }}
                href="/resume.pdf"
                download="Ekam-Kooner-Resume.pdf"
              >
                Download PDF ↓
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className={styles.viewer}>
            <object data="/resume.pdf#view=FitH&toolbar=0" type="application/pdf">
              <iframe src="/resume.pdf#view=FitH&toolbar=0" title="Ekam Kooner résumé">
                <p className={styles.fallback}>
                  Your browser can't display the PDF here. Use the download button above.
                </p>
              </iframe>
            </object>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
