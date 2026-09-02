import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { CircleUser, LogIn, LogOut, Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/vehicles', label: t('nav.fleet') },
    { path: '/offers', label: 'العروض' },
    { path: '/blog', label: 'المدونة' },
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/bookings', label: t('nav.bookings') },
    { path: '/vendor', label: t('nav.vendors') },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(20,20,32,0.12)] border-b border-ink-900/5'
        : 'bg-white/60 backdrop-blur-md border-b border-transparent'
        }`}
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0" data-testid="navbar-logo">
            <img src="/arafgha-logo.png" alt="Alrafgha Group" className="h-10 w-auto shrink-0" />
            <span className="hidden sm:inline text-[10px] font-display tracking-[0.1em] text-ink-400 font-medium">
              <span className='text-primary-500 font-bold'>~</span> {t('brandTagline')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1 bg-ink-50/70 backdrop-blur-sm rounded-full p-1.5 border border-ink-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.path)
                  ? 'text-white'
                  : 'text-ink-700 hover:text-ink-900'
                  }`}
              >
                {isActive(link.path) && (
                  <span className="absolute inset-0 bg-ink-900 rounded-full shadow-lg" />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden xl:flex items-center gap-2">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-ink-100 hover:border-primary-500 transition-all duration-300 magnetic overflow-hidden"
                  data-testid="navbar-profile-btn"
                  title={t('auth.profile')}
                >
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300 magnetic"
                  data-testid="navbar-logout-btn"
                  aria-label={t('auth.logout')}
                  title={t('auth.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-ink-700 hover:text-ink-900 transition-colors duration-200 text-sm font-medium"
                  data-testid="navbar-login-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('auth.login')}</span>
                </Link>
                <Link
                  to="/register"
                  data-testid="navbar-signup-btn"
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold magnetic transition-colors"
                >
                  <span className="relative z-10">{t('auth.signup')}</span>
                  <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-primary-400 group-hover:bg-white transition-colors" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex xl:hidden items-center gap-2">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full border border-primary-100 overflow-hidden flex items-center justify-center bg-primary-50"
                data-testid="mobile-profile-icon"
              >
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-linear-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
                  data-testid="mobile-signup-btn"
                >
                  {t('auth.signup')}
                </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2.5 rounded-full bg-white border border-ink-100 text-ink-900"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden absolute top-[calc(100%-0.5rem)] left-0 w-full px-4 pb-4 animate-fade-in-down" data-testid="mobile-menu">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-ink-100 p-2 shadow-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(link.path)
                    ? 'bg-primary-50 text-primary-600 font-bold'
                    : 'text-ink-700 hover:bg-ink-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
               {!isAuthenticated && (
                 <Link
                   to="/login"
                   className="block px-4 py-3 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-50"
                 >
                   {t('auth.login')}
                 </Link>
               )}
               {isAuthenticated && (
                 <button
                   onClick={handleLogout}
                   className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50"
                 >
                   {t('auth.logout')}
                 </button>
               )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;