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
    const TAU = Math.PI * 2;
    return Array.from({ length: count }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      // each orb drifts around a small closed loop (no reversal, no stops):
      // 4 waypoints evenly spaced around a circle of random radius/phase/direction
      const phase = rand(0, TAU);
      const dir = Math.random() < 0.5 ? 1 : -1;
      const r = rand(2.2, 4); // drift radius
      const wp = (k) => {
        const a = phase + dir * k * (TAU / 5);
        return [
          ((Math.cos(a) - Math.cos(phase)) * r).toFixed(2),
          ((Math.sin(a) - Math.sin(phase)) * r).toFixed(2),
        ];
      };
      const [x1, y1] = wp(1);
      const [x2, y2] = wp(2);
      const [x3, y3] = wp(3);
      const [x4, y4] = wp(4);
      return {
        left: ((col + 0.5 + rand(-0.34, 0.34)) / cols) * 100,
        top: ((row + 0.5 + rand(-0.34, 0.34)) / rows) * 100,
        size: rand(10, 28),
        x1: `${x1}vw`, y1: `${y1}vh`,
        x2: `${x2}vw`, y2: `${y2}vh`,
        x3: `${x3}vw`, y3: `${y3}vh`,
        x4: `${x4}vw`, y4: `${y4}vh`,
        dur: rand(24, 40).toFixed(1),
        delay: (-rand(0, 36)).toFixed(1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        o1: rand(0.24, 0.4).toFixed(2),
        o2: rand(0.46, 0.7).toFixed(2),
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
            '--x4': o.x4,
            '--y4': o.y4,
            '--o1': o.o1,
            '--o2': o.o2,
          }}
        />
      ))}
    </div>
  );
}
