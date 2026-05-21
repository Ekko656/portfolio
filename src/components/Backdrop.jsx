import styles from './Backdrop.module.css';

// Global animated depth: slow-drifting blurred lavender/violet/blush fields.
export default function Backdrop() {
  return (
    <div className={styles.fx} aria-hidden="true">
      <div className={`${styles.blob} ${styles.b1}`} />
      <div className={`${styles.blob} ${styles.b2}`} />
      <div className={`${styles.blob} ${styles.b3}`} />
      <div className={`${styles.blob} ${styles.b4}`} />
    </div>
  );
}
