import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

const HOVER_SELECTOR = 'a, button, .pill, [data-hover]';
const TEXT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, span, li, strong, em, label';

export default function Cursor() {
  const rootRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return; // touch device → keep native cursor

    setEnabled(true);
    document.documentElement.classList.add('cursor-active');

    const move = (e) => {
      const el = rootRef.current;
      if (!el) return;
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

      const t = e.target;
      const overHover = t.closest && t.closest(HOVER_SELECTOR);
      const overText = overHover || (t.closest && t.closest(TEXT_SELECTOR));
      el.classList.toggle(styles.isHover, !!overHover);
      el.classList.toggle(styles.isText, !!overText);
    };
    const hide = () => {
      if (rootRef.current) rootRef.current.style.opacity = '0';
    };
    const show = () => {
      if (rootRef.current) rootRef.current.style.opacity = '1';
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
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      <span className={styles.glow} />
      <span className={styles.core} />
    </div>
  );
}
