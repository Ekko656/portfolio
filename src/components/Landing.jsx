import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import Sparkles from './Sparkles.jsx';

const WORDS = ['Hey,', "I'm", 'Ekam'];
const NAV = ['about', 'projects', 'resume', 'contact'];

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
          {NAV.map((item) => (
            <Link key={item} to={`/${item}`} className="pill">
              {item}
            </Link>
          ))}
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
