import React, { forwardRef, useId, useState, useEffect } from 'react';

const Input = forwardRef((
  {
    label,
    type = 'text',
    error,
    success = false,
    disabled = false,
    readOnly = false,
    required = false,
    leftIcon,
    rightIcon,
    helperText,
    containerClassName = '',
    onBlur,
    onFocus,
    ...props
  },
  ref
) => {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const describedBy = [error && errorId, helperText && helperId].filter(Boolean).join(' ') || undefined;

  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(props.value && props.value.toString().length > 0);
  }, [props.value]);

  const handleFocus = (e) => { setIsFocused(true); onFocus?.(e); };
  const handleBlur = (e) => { setIsFocused(false); onBlur?.(e); };

  const baseInputStyles = `w-full bg-white text-ink-900 placeholder:text-ink-400 disabled:bg-ink-50 disabled:text-ink-400 disabled:cursor-not-allowed read-only:bg-ink-50 read-only:cursor-not-allowed transition-all duration-200 focus:outline-none`;
  const stateStyles = error
    ? 'border-2 border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-500/20'
    : success
    ? 'border-2 border-success-500 focus:border-success-500 focus:ring-2 focus:ring-success-500/20'
    : isFocused
    ? 'border-2 border-gold-500 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20'
    : 'border-2 border-ink-200 hover:border-ink-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20';
  const sizeStyles = props.size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-3.5 text-base';
  const paddingAdjust = (leftIcon ? 'pl-11' : '') + ' ' + (rightIcon ? 'pr-11' : '');

  return (
    <div className={`${containerClassName} relative`}>
      {label && (
        <label htmlFor={inputId} className={`block text-sm font-medium mb-2 transition-colors duration-200 ${hasValue || isFocused ? 'text-gold-600' : 'text-ink-700'} ${error ? 'text-error-600' : ''}`}>
          {label}{required && <span className="text-error-500 ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-gold-500' : 'text-ink-400'} ${error ? 'text-error-500' : ''} ${success ? 'text-success-500' : ''}`} aria-hidden="true">{leftIcon}</div>}
        <input ref={ref} id={inputId} type={type} disabled={disabled} readOnly={readOnly} required={required} aria-invalid={error ? 'true' : 'false'} aria-describedby={describedBy} aria-required={required} onFocus={handleFocus} onBlur={handleBlur} className={`${baseInputStyles} ${stateStyles} ${sizeStyles} rounded-xl ${paddingAdjust}`} {...props} />
        {rightIcon && <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-gold-500' : 'text-ink-400'} ${error ? 'text-error-500' : ''} ${success ? 'text-success-500' : ''}`} aria-hidden="true">{rightIcon}</div>}
      </div>
      {(error || helperText) && (
        <div className="mt-2 flex items-center gap-1.5 animate-fade-in" id={error ? errorId : helperId} role={error ? 'alert' : undefined}>
          {error ? (
            <>
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="text-sm text-error-600">{error}</span>
            </>
          ) : <span className="text-sm text-ink-500">{helperText}</span>}
        </div>
      )}
    </div>
  );
});
Input.displayName = 'Input';
export default Input;
