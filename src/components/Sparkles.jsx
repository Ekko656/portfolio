import { useMemo } from 'react';
import styles from './Sparkles.module.css';

const COLORS = ['#cbb3ec', '#e3c9e9', '#b8a4d4', '#d9c2ef', '#d6a8c6'];
const rand = (min, max) => min + Math.random() * (max - min);

// Idle floating orbs (soft bokeh). Positions fixed for the session.
export default function FloatingOrbs({ count = 12 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        top: rand(0, 100),
        left: rand(0, 100),
        size: rand(28, 96),
        dx: `${rand(-6, 6).toFixed(1)}vw`,
        dy: `${rand(-6, 6).toFixed(1)}vh`,
        ds: rand(1.05, 1.3).toFixed(2),
        dur: rand(8, 16).toFixed(1),
        delay: rand(-10, 0).toFixed(1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        o1: rand(0.1, 0.22).toFixed(2),
        o2: rand(0.24, 0.4).toFixed(2),
      })),
    [count]
  );

  return (
    <div className={styles.layer} aria-hidden="true">
      {items.map((o, i) => (
        <span
          key={i}
          className={styles.orb}
          style={{
            top: `${o.top}%`,
            left: `${o.left}%`,
            width: `${o.size}px`,
            height: `${o.size}px`,
            background: o.color,
            animationDuration: `${o.dur}s`,
            animationDelay: `${o.delay}s`,
            '--dx': o.dx,
            '--dy': o.dy,
            '--ds': o.ds,
            '--o1': o.o1,
            '--o2': o.o2,
          }}
        />
      ))}
    </div>
  );
}
