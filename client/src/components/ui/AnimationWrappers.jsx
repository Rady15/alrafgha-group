import React, { useRef, useState, useEffect } from 'react';

/**
 * Reveal - Scroll-triggered entrance animations
 * Use for sections, cards, text elements
 */
export const Reveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  once = true,
  threshold = 0.1,
  rootMargin = '0px 0px -10%',
  className = '',
  style,
  ...props
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const dirMap = {
    up: isVisible ? 'translateY(0)' : 'translateY(32px)',
    down: isVisible ? 'translateY(0)' : 'translateY(-32px)',
    left: isVisible ? 'translateX(0)' : 'translateX(-40px)',
    right: isVisible ? 'translateX(0)' : 'translateX(40px)',
    scale: isVisible ? 'scale(1)' : 'scale(0.96)',
    none: 'none',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: dirMap[direction] || dirMap.up,
        transition: `opacity ${duration}s cubic-bezier(0.2,0.8,0.2,1) ${delay}s, transform ${duration}s cubic-bezier(0.2,0.8,0.2,1) ${delay}s`,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Parallax - Scroll-linked parallax motion (CSS fallback)
 */
export const Parallax = ({
  children,
  className = '',
  style,
  ...props
}) => {
  return (
    <div className={className} style={style} {...props}>
      {children}
    </div>
  );
};

/**
 * StaggerContainer - Wrapper for staggered children animations (CSS-based)
 */
export const StaggerContainer = ({
  children,
  stagger = 0.08,
  delay = 0,
  className = '',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child, idx) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              style: {
                ...child.props.style,
                animationDelay: `${delay + idx * stagger}s`,
              },
            })
          : child
      )}
    </div>
  );
};

/**
 * StaggerItem - Child component for StaggerContainer
 */
export const StaggerItem = ({ children, className = '', style, ...props }) => {
  return (
    <div className={className} style={style} {...props}>
      {children}
    </div>
  );
};

/**
 * TextReveal - Word/line-by-word text animation (CSS-based)
 */
export const TextReveal = ({
  children,
  className = '',
  style,
  ...props
}) => {
  return (
    <div className={className} style={style} {...props}>
      {children}
    </div>
  );
};

/**
 * Marquee - Infinite scrolling text/brand strip (CSS-based)
 */
export const Marquee = ({
  children,
  speed = 30,
  className = '',
  ...props
}) => {
  return (
    <div className={`overflow-hidden ${className}`} style={{ animation: `marquee ${speed}s linear infinite` }} {...props}>
      <div className="flex w-max">
        {children}
        {children}
      </div>
    </div>
  );
};

/**
 * Shimmer - Loading placeholder animation (CSS-based)
 */
export const Shimmer = ({
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      className={`animate-shimmer ${className}`}
      style={{
        ...style,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        backgroundSize: '200% 100%',
      }}
      {...props}
    />
  );
};

export default { Reveal, Parallax, StaggerContainer, StaggerItem, TextReveal, Marquee, Shimmer };