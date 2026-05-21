import { useState } from 'react';
import styles from './Projects.module.css';
import { projects } from '../data/projects.js';
import Reveal from './Reveal.jsx';
import ProjectModal from './ProjectModal.jsx';

export default function Projects() {
  const [active, setActive] = useState(null);

  return (
    <main className="page">
      <section className={styles.projects}>
        <Reveal>
          <h2 className={styles.title}>Projects</h2>
          <p className={styles.subtitle}>A few things I've built.</p>
        </Reveal>

        <div className={styles.grid}>
        {projects.map((project, i) => (
          <Reveal key={project.name} delay={i * 80}>
            <button
              className={styles.card}
              onClick={() => setActive(project)}
              aria-label={`Open ${project.name} details`}
            >
              <span className={styles.name}>{project.name}</span>
              <span className={styles.cardTag}>{project.tag}</span>
            </button>
          </Reveal>
        ))}
      </div>

        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </section>
    </main>
  );
}
