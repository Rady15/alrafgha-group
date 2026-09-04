import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const {
    threshold = 0.12,
    rootMargin = '0px 0px -60px',
    once = true,
  } = options;

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const nodes = root.querySelectorAll('[data-reveal]');
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold, rootMargin }
    );
    nodes.forEach((n) => observer.observe(n));
    // Safety: if observer never fires (e.g. already in viewport, JS delay), force visible after 600ms
    const fallback = setTimeout(() => {
      nodes.forEach((n) => n.classList.add('is-visible'));
    }, 700);
    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return ref;
}

export default useScrollReveal;
