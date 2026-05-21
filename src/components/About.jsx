import { Link } from 'react-router-dom';
import styles from './About.module.css';
import { useInView } from '../hooks/useInView.js';
import Sparkles from './Sparkles.jsx';

function sizeClamp(size, font) {
  const vw = (size / 12).toFixed(2);
  if (font === 'hand')
    return `clamp(${Math.round(size * 0.46)}px, ${vw}vw, ${size}px)`;
  if (font === 'accent')
    return `clamp(${Math.round(size * 0.66)}px, ${vw}vw, ${size}px)`;
  return `clamp(${Math.round(size * 0.78)}px, ${(size / 14).toFixed(2)}vw, ${size}px)`;
}
function fontFamily(font) {
  if (font === 'hand') return 'var(--font-hand)';
  if (font === 'accent') return 'var(--font-accent)';
  return 'var(--font-body)';
}
function lineHeight(font) {
  if (font === 'hand') return 1.3;
  if (font === 'accent') return 1.2;
  return 1.5;
}

function Moment({ align = 'center', stagger = 150, sparkle = false, lines }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const dir =
    align === 'left' ? styles.dirLeft : align === 'right' ? styles.dirRight : styles.dirCenter;

  return (
    <div ref={ref} className={`${styles.moment} ${styles[align]}`}>
      {sparkle && <Sparkles count={6} />}
      <div className={styles.inner}>
        {lines.map((ln, i) => {
          if (ln.kind === 'underline') {
            return (
              <svg
                key={i}
                viewBox="0 0 220 18"
                className={`${styles.deco} ${inView ? styles.decoIn : ''}`}
                style={{ color: ln.color || 'var(--accent)', ...(ln.style || {}) }}
                aria-hidden="true"
              >
                <path d="M4 11 C 44 4, 74 15, 112 9 S 182 4, 216 11" stroke="currentColor" />
              </svg>
            );
          }
          return (
            <span
              key={i}
              className={`${styles.line} ${dir} ${ln.blur ? styles.blurLine : ''} ${
                inView ? styles.lineIn : ''
              } ${ln.className || ''}`}
              style={{
                fontFamily: fontFamily(ln.font),
                fontWeight: ln.weight || 400,
                fontSize: sizeClamp(ln.size, ln.font),
                lineHeight: lineHeight(ln.font),
                color: ln.soft ? 'var(--text-soft)' : 'var(--text)',
                transitionDelay: inView ? `${i * stagger}ms` : '0ms',
                transitionDuration: ln.dur ? `${ln.dur}ms` : undefined,
                ...(ln.style || {}),
              }}
            >
              {ln.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const TRAIL_SIZES = [6, 8, 11, 8, 6];

function Connector() {
  const [ref, inView] = useInView({ threshold: 0.5 });
  return (
    <div
      ref={ref}
      className={`${styles.connector} ${inView ? styles.connIn : ''}`}
      aria-hidden="true"
    >
      <div className={styles.trail}>
        {TRAIL_SIZES.map((s, i) => (
          <span
            key={i}
            className={styles.trailOrb}
            style={{
              width: `${s}px`,
              height: `${s}px`,
              transitionDelay: inView ? `${i * 90}ms` : '0ms',
            }}
          />
        ))}
      </div>
    </div>
  );
}

const INTERESTS = ['Volleyball', 'NBA', 'League of Legends', 'Drake', 'Boxing'];

function Aside() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <div ref={ref} className={`${styles.aside} ${inView ? styles.asideIn : ''}`}>
      <span className={styles.asideLabel}>off the clock</span>
      <h3 className={styles.asideTitle}>When I'm not building</h3>
      <div className={styles.asideChips}>
        {INTERESTS.map((item) => (
          <span key={item} className={styles.asideChip}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <main className="page">
      <div className={styles.about}>
        <Moment
          align="center"
          sparkle
          lines={[
            { font: 'hand', size: 96, blur: true, style: { color: 'var(--plum)' }, text: 'Who is engineering for?' },
            { kind: 'underline', color: 'var(--accent)' },
          ]}
        />

        <Connector />

        <Moment
          align="left"
          lines={[{ font: 'body', size: 30, dur: 1000, text: "It's a question I keep coming back to." }]}
        />

        <Connector />

        <Moment
          align="right"
          lines={[
            { font: 'body', size: 32, text: 'Most of what gets built today' },
            {
              font: 'body',
              size: 32,
              text: (
                <>
                  is built for <span className="bold">the people who need it least.</span>
                </>
              ),
            },
          ]}
        />

        <Connector />

        <Moment
          align="left"
          stagger={200}
          lines={[
            { font: 'body', size: 26, className: 'muted', text: 'Faster trading algorithms.' },
            { font: 'body', size: 26, className: 'muted', text: 'Sharper ad targeting.' },
            { font: 'body', size: 26, className: 'muted', text: 'Another delivery app.' },
            {
              font: 'body',
              size: 22,
              soft: true,
              style: { marginTop: '0.5em', fontStyle: 'italic' },
              text: 'Sharp minds, pointed at the easiest problems with the loudest payouts.',
            },
          ]}
        />

        <Connector />

        <Moment
          align="center"
          sparkle
          lines={[
            { font: 'hand', size: 80, blur: true, text: 'I want to spend my life' },
            {
              font: 'hand',
              size: 80,
              blur: true,
              text: (
                <>
                  pointed <span className="em-plum">somewhere else.</span>
                </>
              ),
            },
            { kind: 'underline', color: 'var(--plum)' },
          ]}
        />

        <Connector />

        <Moment
          align="left"
          stagger={250}
          lines={[
            {
              font: 'body',
              size: 28,
              text: (
                <>
                  At the <span className="em-violet">older person</span> who can't reach the top shelf anymore.
                </>
              ),
            },
            {
              font: 'body',
              size: 28,
              text: (
                <>
                  At the <span className="em-violet">hospital</span> running short on night staff.
                </>
              ),
            },
            {
              font: 'body',
              size: 28,
              text: (
                <>
                  At the <span className="em-violet">parent</span> who needs an extra set of hands.
                </>
              ),
            },
          ]}
        />

        <Connector />

        <Moment
          align="right"
          lines={[
            {
              font: 'body',
              size: 30,
              text: (
                <>
                  This is why I'm in <span className="caveat">Biomedical Engineering</span> at{' '}
                  <span className="caveat">UBC</span>.
                </>
              ),
            },
            {
              font: 'body',
              size: 30,
              text: (
                <>
                  This is why I'm aiming at <span className="em-violet">humanoid robotics.</span>
                </>
              ),
            },
            {
              font: 'accent',
              size: 42,
              style: { marginTop: '0.2em' },
              text: (
                <>
                  <span style={{ color: 'var(--plum)' }}>Tesla Optimus</span>, specifically.
                </>
              ),
            },
          ]}
        />

        <Connector />

        <Moment
          align="center"
          sparkle
          lines={[
            { font: 'body', size: 32, className: 'muted', text: 'Not for the technology.' },
            {
              font: 'hand',
              size: 72,
              blur: true,
              style: { marginTop: '0.12em' },
              text: (
                <>
                  For who the technology is <span className="em-plum">able to serve.</span>
                </>
              ),
            },
          ]}
        />

        <Connector />

        <Moment
          align="center"
          sparkle
          lines={[
            { font: 'body', size: 28, text: 'Everything I build comes back to that.' },
            {
              font: 'hand',
              size: 104,
              blur: true,
              style: { marginTop: '0.16em', color: 'var(--plum)' },
              text: 'Engineering with purpose.',
            },
            { kind: 'underline', color: 'var(--plum)', style: { width: 'clamp(220px, 40vw, 420px)' } },
          ]}
        />

        <Connector />

        <Moment
          align="center"
          lines={[
            {
              font: 'body',
              size: 22,
              text: (
                <>
                  If you read this far, <span className="caveat">thank you.</span>
                </>
              ),
            },
          ]}
        />

        <Aside />

        <div className={styles.cta}>
          <Link to="/contact" className="pill" style={{ textTransform: 'none' }}>
            Let's talk →
          </Link>
        </div>
      </div>
    </main>
  );
}
