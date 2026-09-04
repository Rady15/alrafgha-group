import { useTranslation } from 'react-i18next';

const Price = ({ children, className = '', withCurrency = true, size = 'md' }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith('ar');

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <span className={`price inline-flex items-center gap-1.5 ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <span>{children}</span>
      {withCurrency && (
        <span className="inline-flex items-center gap-1 shrink-0" aria-label="Saudi Riyal">
          <img
            src="/currency.png"
            alt="SAR"
            className={`${iconSize} object-contain`}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; const fallback = e.currentTarget.nextElementSibling; if (fallback) fallback.style.display = 'inline'; }}
          />
          <span className="text-[0.75em] font-bold opacity-80 hidden" aria-hidden="true">ر.س</span>
        </span>
      )}
    </span>
  );
};

export default Price;
