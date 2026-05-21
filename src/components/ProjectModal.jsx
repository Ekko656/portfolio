import { useCallback, useEffect, useState } from 'react';
import styles from './ProjectModal.module.css';

export default function ProjectModal({ project, onClose }) {
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(onClose, reduced ? 0 : 280);
  }, [onClose]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [handleClose]);

  if (!project) return null;

  return (
    <div
      className={`${styles.backdrop} ${visible ? styles.visible : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={handleClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h3 className={styles.name}>{project.name}</h3>
        <p className={styles.desc}>{project.description}</p>

        <div className={styles.chips}>
          {project.stack.map((tech) => (
            <span key={tech} className={styles.chip}>
              {tech}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <a
            className="pill"
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.link.label}
          </a>
        </div>
      </div>
    </div>
  );
}
