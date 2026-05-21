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

        {project.video ? (
          <div className={styles.video}>
            <iframe
              src={`https://www.youtube.com/embed/${project.video}`}
              title={`${project.name} demo`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : project.image ? (
          <div className={styles.shot}>
            <img src={project.image} alt={`${project.name} preview`} loading="lazy" />
          </div>
        ) : null}

        <div className={styles.chips}>
          {project.stack.map((tech) => (
            <span key={tech} className={styles.chip}>
              {tech}
            </span>
          ))}
        </div>

        {project.awards && (
          <div className={styles.awards}>
            <span className={styles.awardsHead}>Awards</span>
            <ul>
              {project.awards.map((a) => (
                <li key={a}>
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path
                      d="M12 2c.9 6.5 4.6 10.2 11.1 11.1C16.6 12 12.9 15.7 12 22.2 11.1 15.7 7.4 12 .9 11.1 7.4 10.2 11.1 6.5 12 2z"
                      fill="var(--accent-deep)"
                    />
                  </svg>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          {project.links.map((l) => (
            <a
              key={l.label}
              className="pill"
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
