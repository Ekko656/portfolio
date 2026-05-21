import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

const HOVER_SELECTOR = 'a, button, .pill, [data-hover]';
const RECOLOR_HALF = 23; // half of .recolor size

export default function Cursor() {
  const rootRef = useRef(null);
  const recolorRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return; // touch device → keep native cursor

    setEnabled(true);
    document.documentElement.classList.add('cursor-active');

    const move = (e) => {
      const root = rootRef.current;
      const recolor = recolorRef.current;
      if (root) {
        root.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        const overHover = e.target.closest && e.target.closest(HOVER_SELECTOR);
        root.classList.toggle(styles.isHover, !!overHover);
      }
      if (recolor) {
        recolor.style.transform = `translate(${e.clientX - RECOLOR_HALF}px, ${
          e.clientY - RECOLOR_HALF
        }px)`;
      }
    };
    const hide = () => {
      if (rootRef.current) rootRef.current.style.opacity = '0';
      if (recolorRef.current) recolorRef.current.style.opacity = '0';
    };
    const show = () => {
      if (rootRef.current) rootRef.current.style.opacity = '1';
      if (recolorRef.current) recolorRef.current.style.opacity = '1';
    };

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
      <div ref={recolorRef} className={styles.recolor} aria-hidden="true" />
      <div ref={rootRef} className={styles.cursor} aria-hidden="true">
        <span className={styles.glow} />
        <span className={styles.core} />
      </div>
    </>
  );
}
