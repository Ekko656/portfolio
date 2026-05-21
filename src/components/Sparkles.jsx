import { useEffect, useMemo, useRef } from 'react';
import styles from './Sparkles.module.css';

const COLORS = ['#b8a4d4', '#a68bc9', '#cbb3ec', '#d6a8c6', '#9f86c9'];
const rand = (min, max) => min + Math.random() * (max - min);

// Idle floating orbs, spread evenly via a jittered grid. Optional scroll parallax.
export default function FloatingOrbs({ count = 12, parallax = false, cols: colsProp }) {
  const layerRef = useRef(null);

  const items = useMemo(() => {
    const cols = colsProp || Math.max(1, Math.round(Math.sqrt(count)));
    const rows = Math.ceil(count / cols);
    const off = () => rand(-4.2, 4.2).toFixed(1); // small per-waypoint offset
    return Array.from({ length: count }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        left: ((col + 0.5 + rand(-0.34, 0.34)) / cols) * 100,
        top: ((row + 0.5 + rand(-0.34, 0.34)) / rows) * 100,
        size: rand(10, 28),
        // three small random waypoints → a natural meander, not a straight back-and-forth
        x1: `${off()}vw`, y1: `${off()}vh`,
        x2: `${off()}vw`, y2: `${off()}vh`,
        x3: `${off()}vw`, y3: `${off()}vh`,
        s1: rand(0.94, 1.12).toFixed(2),
        s2: rand(0.9, 1.08).toFixed(2),
        s3: rand(0.95, 1.14).toFixed(2),
        dur: rand(11, 20).toFixed(1),
        delay: (-rand(0, 16)).toFixed(1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        o1: rand(0.22, 0.4).toFixed(2),
        o2: rand(0.48, 0.72).toFixed(2),
      };
    });
  }, [count, colsProp]);

  useEffect(() => {
    if (!parallax) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (layerRef.current) {
          layerRef.current.style.transform = `translateY(${window.scrollY * 0.08}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [parallax]);

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
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
            '--x1': o.x1,
            '--y1': o.y1,
            '--x2': o.x2,
            '--y2': o.y2,
            '--x3': o.x3,
            '--y3': o.y3,
            '--s1': o.s1,
            '--s2': o.s2,
            '--s3': o.s3,
            '--o1': o.o1,
            '--o2': o.o2,
          }}
        />
      ))}
    </div>
  );
}
