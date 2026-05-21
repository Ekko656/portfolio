import { useMemo } from 'react';
import styles from './Sparkles.module.css';

const COLORS = ['#b8a4d4', '#a68bc9', '#cbb3ec', '#d6a8c6', '#9f86c9'];
const rand = (min, max) => min + Math.random() * (max - min);

// Idle floating orbs (defined soft dots). Positions fixed for the session.
export default function FloatingOrbs({ count = 12 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        top: rand(0, 100),
        left: rand(0, 100),
        size: rand(10, 30),
        dx: `${rand(-6, 6).toFixed(1)}vw`,
        dy: `${rand(-6, 6).toFixed(1)}vh`,
        ds: rand(1.05, 1.25).toFixed(2),
        dur: rand(7, 14).toFixed(1),
        delay: rand(-10, 0).toFixed(1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        o1: rand(0.25, 0.4).toFixed(2),
        o2: rand(0.45, 0.7).toFixed(2),
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
            background: `radial-gradient(circle at 35% 30%, ${o.color} 0%, ${o.color} 35%, transparent 72%)`,
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
