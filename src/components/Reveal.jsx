import { useInView } from '../hooks/useInView.js';

// Generic scroll-entrance wrapper using the global .reveal class.
export default function Reveal({ children, className = '', delay = 0, threshold = 0.2, as: Tag = 'div' }) {
  const [ref, inView] = useInView({ threshold });
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
}
