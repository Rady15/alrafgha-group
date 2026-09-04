import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  className = '',
}) => {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-full mx-4' };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closeOnOverlay ? onClose : undefined} aria-hidden="true" />
      <div className={`relative w-full ${sizes[size]} bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in ${className}`} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined} aria-describedby={description ? 'modal-description' : undefined} onClick={(e) => e.stopPropagation()}>
        {(title || showClose) && (
          <div className="flex items-start justify-between p-6 border-b border-ink-100">
            <div>
              {title && <h2 id="modal-title" className="text-2xl font-display font-bold text-ink-900">{title}</h2>}
              {description && <p id="modal-description" className="mt-1 text-ink-500">{description}</p>}
            </div>
            {showClose && (
              <button onClick={onClose} className="p-2 rounded-xl bg-ink-50 text-ink-500 hover:bg-ink-100 hover:text-ink-700 transition-colors" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
export default Modal;
