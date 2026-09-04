import { forwardRef } from 'react';

const Button = forwardRef((
  {
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    onClick,
    type = 'button',
    ...props
  },
  ref
) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
  `;

  const variants = {
    primary: `
      bg-gold-500 text-ink-950 hover:bg-gold-400 active:bg-gold-600
      shadow-[0_4px_16px_rgba(239,182,22,0.25)] hover:shadow-[0_8px_24px_rgba(239,182,22,0.35)]
    `,
    secondary: `
      bg-white text-ink-900 border border-ink-200
      hover:bg-ink-50 hover:border-ink-300 active:bg-ink-100
    `,
    ghost: `
      bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-200
    `,
    outline: `
      bg-transparent text-ink-700 border-2 border-ink-300
      hover:bg-ink-50 hover:border-gold-500 hover:text-gold-600 active:bg-ink-100
    `,
    crimson: `
      bg-crimson-600 text-white hover:bg-crimson-500 active:bg-crimson-700
      shadow-[0_4px_16px_rgba(239,68,68,0.25)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.35)]
    `,
    subtle: `
      bg-ink-100 text-ink-900 hover:bg-ink-200 active:bg-ink-300
    `,
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-[11px] rounded-lg gap-1.5',
    sm: 'px-4 py-2 text-sm rounded-xl gap-2',
    md: 'px-6 py-3 text-base rounded-xl gap-2.5',
    lg: 'px-8 py-4 text-lg rounded-2xl gap-3',
    xl: 'px-10 py-5 text-xl rounded-2xl gap-3',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 animate-spin" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {!loading && leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
      <span className="relative z-10 flex-1">{children}</span>
      {!loading && rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
