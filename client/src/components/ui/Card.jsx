import { forwardRef } from 'react';

const Card = forwardRef((
  {
    children,
    variant = 'default',
    padding = 'md',
    hover = false,
    clickable = false,
    className = '',
    onClick,
    ...props
  },
  ref
) => {
  const baseStyles = `
    bg-white rounded-2xl border
    transition-all duration-300 ease-out
  `;

  const variants = {
    default: 'border-ink-100 hover:border-ink-200',
    elevated: 'border-ink-100 shadow-card-rest hover:shadow-card-hover',
    outlined: 'border-2 border-ink-200 hover:border-gold-500',
    subtle: 'bg-ink-50 border-ink-100',
    dark: 'bg-ink-900 border-ink-800 text-white',
    gold: 'bg-gradient-to-br from-gold-50 via-white to-white border-gold-100',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const interactiveStyles = (clickable || hover) ? `
    hover-lift
    ${clickable ? 'cursor-pointer press-scale' : ''}
  ` : '';

  if (clickable) {
    return (
      <button ref={ref} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${interactiveStyles} ${className}`} {...props}>
        {children}
      </button>
    );
  }
  return (
    <div ref={ref} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${interactiveStyles} ${className}`} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;