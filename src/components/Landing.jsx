import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import Sparkles from './Sparkles.jsx';

const WORDS = ['Hey,', "I'm", 'Ekam'];
const NAV = ['about', 'projects', 'resume', 'contact'];

// a distinct animated underline per button
const UNDERLINES = [
  { cls: 'uWave', d: 'M3 6 C 22 1, 38 9, 52 5 S 80 1, 97 6' }, // about — hand wave, draws L→R
  { cls: 'uZig', d: 'M3 6 L 19 3 L 33 8 L 49 3 L 65 8 L 81 3 L 97 6' }, // projects — zigzag
  { cls: 'uGrow', d: 'M3 6 H 97' }, // resume — straight, grows from center
  { cls: 'uDouble', d: 'M3 4 C 30 1, 70 1, 97 4', d2: 'M6 8 C 32 6, 68 6, 94 8' }, // contact — double swoosh
];

export default function Landing() {
  const tilts = useMemo(
    () => WORDS.map(() => (Math.random() * 6 - 3).toFixed(2)),
    []
  );

  return (
    <section className={styles.hero}>
      <Sparkles count={16} />

      <div className={styles.inner}>
        <div className={styles.photo}>
          <img
            src="/headshot.jpg"
            alt="Ekam Kooner"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <h1 className={styles.greeting}>
          {WORDS.map((word, i) => (
            <span
              key={word}
              className={styles.word}
              style={{ '--tilt': `${tilts[i]}deg` }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p className={styles.bio}>
          Biomedical Engineering (Robotics) student at UBC.
        </p>

        <nav className={styles.pills} aria-label="Sections">
          {NAV.map((item, i) => {
            const u = UNDERLINES[i];
            return (
              <Link key={item} to={`/${item}`} className={styles.navBtn}>
                <span className={styles.navLabel}>
                  {item}
                  <svg
                    className={`${styles.navUnderline} ${styles[u.cls]}`}
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d={u.d} />
                    {u.d2 && <path d={u.d2} />}
                  </svg>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Link to="/about" className={styles.chevron} aria-label="Go to about">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </section>
  );
}
