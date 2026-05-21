import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

const HOVER_SELECTOR = 'a, button, .pill, [data-hover]';

export default function Cursor() {
  const rootRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return; // touch device → keep native cursor

    setEnabled(true);
    document.documentElement.classList.add('cursor-active');

    const move = (e) => {
      const el = rootRef.current;
      if (el) el.style.transform = `translate(${e.clientX - 7}px, ${e.clientY - 7}px)`;
    };
    const over = (e) => {
      if (e.target.closest && e.target.closest(HOVER_SELECTOR)) setHover(true);
    };
    const out = (e) => {
      if (
        e.target.closest &&
        e.target.closest(HOVER_SELECTOR) &&
        !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(HOVER_SELECTOR))
      ) {
        setHover(false);
      }
    };
    const leaveWindow = () => {
      const el = rootRef.current;
      if (el) el.style.opacity = '0';
    };
    const enterWindow = () => {
      const el = rootRef.current;
      if (el) el.style.opacity = '1';
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    document.addEventListener('mouseleave', leaveWindow);
    document.addEventListener('mouseenter', enterWindow);

    return () => {
      document.documentElement.classList.remove('cursor-active');
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      document.removeEventListener('mouseleave', leaveWindow);
      document.removeEventListener('mouseenter', enterWindow);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className={`${styles.cursor} ${hover ? styles.isHover : ''}`}
      aria-hidden="true"
    >
      <div className={styles.scale}>
        <div className={styles.spin}>
          <svg viewBox="0 0 24 24">
            <path
              className={styles.path}
              d="M12 0c.9 6.5 4.6 10.2 11.1 11.1C16.6 12 12.9 15.7 12 22.2 11.1 15.7 7.4 12 .9 11.1 7.4 10.2 11.1 6.5 12 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
