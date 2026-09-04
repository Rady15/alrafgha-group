import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MobileNav = () => {
  const { t } = useTranslation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-ink-100 shadow-[0_-8px_30px_-12px_rgba(20,20,32,0.08)]"
      data-testid="mobile-nav"
      role="navigation"
      aria-label={t('common:navigation.mobile')}
    >
      <div className="grid grid-cols-3 gap-0">
        <Link
          to="/"
          className="flex flex-col items-center gap-1 px-3 py-3 text-ink-500 hover:text-gold-600 transition-colors"
          data-testid="mobile-nav-home"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-medium">{t('nav.home')}</span>
        </Link>
        
        <Link
          to="/vehicles"
          className="flex flex-col items-center gap-1 px-3 py-3 text-ink-500 hover:text-gold-600 transition-colors"
          data-testid="mobile-nav-vehicles"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-[10px] font-medium">{t('nav.fleet')}</span>
        </Link>

        <Link
          to="/bookings"
          className="flex flex-col items-center gap-1 px-3 py-3 text-ink-500 hover:text-gold-600 transition-colors"
          data-testid="mobile-nav-bookings"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-[10px] font-medium">{t('nav.bookings')}</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;