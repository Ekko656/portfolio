import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

const HOVER_SELECTOR = 'a, button, .pill, [data-hover]';
const NEON_HALF = 29; // half of .neon

export default function Cursor() {
  const rootRef = useRef(null);
  const neonRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return; // touch device → keep native cursor

    setEnabled(true);
    document.documentElement.classList.add('cursor-active');

    const move = (e) => {
      const { clientX: x, clientY: y } = e;
      if (rootRef.current) {
        rootRef.current.style.transform = `translate(${x}px, ${y}px)`;
        const overHover = e.target.closest && e.target.closest(HOVER_SELECTOR);
        rootRef.current.classList.toggle(styles.isHover, !!overHover);
      }
      if (neonRef.current)
        neonRef.current.style.transform = `translate(${x - NEON_HALF}px, ${y - NEON_HALF}px)`;
    };
    const setVis = (v) => {
      [rootRef, neonRef].forEach((r) => {
        if (r.current) r.current.style.opacity = v;
      });
    };
    const hide = () => setVis('0');
    const show = () => setVis('1');

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);

    return () => {
      document.documentElement.classList.remove('cursor-active');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={neonRef} className={styles.neon} aria-hidden="true" />
      <div ref={rootRef} className={styles.cursor} aria-hidden="true">
        <span className={styles.glow} />
        <span className={styles.core} />
      </div>
    </>
  );
}
