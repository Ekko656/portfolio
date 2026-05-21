import { useEffect, useRef, useState } from 'react';

// Reveal-on-scroll via IntersectionObserver. Fires once, stays revealed.
export function useInView({ threshold = 0.4, rootMargin = '0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}
