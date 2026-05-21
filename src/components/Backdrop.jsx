import { useEffect, useRef } from 'react';
import styles from './Backdrop.module.css';

const BLOBS = ['b1', 'b2', 'b3', 'b4'];
const FACTORS = [0.12, -0.08, 0.06, -0.14];

// Global animated depth: slow-drifting blurred fields with gentle scroll parallax.
export default function Backdrop() {
  const wraps = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        wraps.current.forEach((w, i) => {
          if (w) w.style.transform = `translateY(${(y * FACTORS[i]).toFixed(1)}px)`;
        });
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.fx} aria-hidden="true">
      {BLOBS.map((b, i) => (
        <div key={b} className={styles.par} ref={(el) => (wraps.current[i] = el)}>
          <div className={`${styles.blob} ${styles[b]}`} />
        </div>
      ))}
    </div>
  );
}
