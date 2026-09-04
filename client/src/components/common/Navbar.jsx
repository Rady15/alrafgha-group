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
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/vehicles', label: t('nav.fleet') },
    { path: '/offers', label: t('nav.offers') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/bookings', label: t('nav.bookings') },
    { path: '/vendor', label: t('nav.vendors') },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(20,20,32,0.08)] border-b border-ink-100'
          : 'bg-white/70 backdrop-blur-md border-b border-transparent'}`}
        data-testid="main-navbar"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0" data-testid="navbar-logo">
            <img src="/arafgha-logo.png" alt="Alrafgha Group" className="h-10 w-auto shrink-0" />
            <span className="hidden sm:inline text-[10px] font-display tracking-[0.1em] text-ink-400 font-medium">
              <span className="text-gold-500 font-bold">~</span> {t('brandTagline')}
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-0.5">
            <div className="bg-ink-50/70 backdrop-blur-sm rounded-full p-1 border border-ink-100">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} data-testid={`nav-link-${link.label.toLowerCase()}`}
                  className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.path) ? 'text-white' : 'text-ink-700 hover:text-ink-900'}`}>
                  {isActive(link.path) && <span className="absolute inset-0 bg-ink-900 rounded-full shadow-lg" />}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-3">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-ink-100 hover:border-gold-500 transition-all duration-300" data-testid="navbar-profile-btn" aria-label={t('auth.profile')} aria-expanded={profileOpen} aria-haspopup="true">
                  {user?.profile_image ? <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover rounded-full" /> : <div className="w-full h-full bg-gradient-to-br from-gold-500 to-crimson-500 flex items-center justify-center text-white font-bold rounded-full">{user?.name?.charAt(0)?.toUpperCase()}</div>}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-ink-100 shadow-2xl overflow-hidden py-1 animate-fade-in" role="menu">
                    <div className="px-4 py-3 border-b border-ink-100">
                      <p className="text-sm font-semibold text-ink-900 truncate">{user?.name}</p>
                      <p className="text-xs text-ink-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-ink-700 hover:bg-ink-50 transition-colors" role="menuitem"><CircleUser className="w-4 h-4" />{t('auth.profile')}</Link>
                    {user?.role === 'admin' && <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-ink-700 hover:bg-ink-50 transition-colors" role="menuitem">⚙ {t('admin.dashboard')}</Link>}
                    {user?.role === 'vendor' && <Link to="/vendor-dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-ink-700 hover:bg-ink-50 transition-colors" role="menuitem">📊 {t('vendor.dashboard')}</Link>}
                    {user?.role === 'office_staff' && <Link to="/office-staff" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-ink-700 hover:bg-ink-50 transition-colors" role="menuitem">📋 {t('staff.dashboard')}</Link>}
                    <div className="border-t border-ink-100 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error-600 hover:bg-error-50 transition-colors" role="menuitem"><LogOut className="w-4 h-4" />{t('auth.logout')}</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 px-4 py-2.5 rounded-full text-ink-700 hover:text-ink-900 hover:bg-ink-50 transition-all duration-200 text-sm font-medium" data-testid="navbar-login-btn"><LogIn className="w-4 h-4" />{t('auth.login')}</Link>
                <Link to="/register" data-testid="navbar-signup-btn" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-semibold hover:shadow-lg transition-all">
                  <span>{t('auth.signup')}</span><span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                </Link>
              </>
            )}
          </div>

          <div className="flex xl:hidden items-center gap-1.5">
            <LanguageSwitcher />
            {isAuthenticated && (
              <Link to="/profile" className="w-10 h-10 rounded-full border border-gold-100 overflow-hidden flex items-center justify-center bg-gold-50" data-testid="mobile-profile-icon">
                {user?.profile_image ? <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-gold-500 to-crimson-500 flex items-center justify-center text-white font-bold">{user?.name?.charAt(0)?.toUpperCase()}</div>}
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen((v) => !v)} className="p-2.5 rounded-full bg-white border border-ink-100 text-ink-900" data-testid="mobile-menu-toggle" aria-label={mobileMenuOpen ? t('common:actions.close') : t('common:actions.menu')} aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[70]" data-testid="mobile-menu">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <div className="absolute top-0 end-0 h-full w-[86%] max-w-[380px] bg-white shadow-2xl overflow-y-auto flex flex-col animate-drawer-in">
            <div className="flex items-center justify-between p-5 border-b border-ink-100 shrink-0">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <img src="/arafgha-logo.png" alt="Alrafgha Group" className="h-8 w-auto" />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-full bg-ink-900 text-white hover:bg-black" aria-label={t('common:actions.close')}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className={`block px-5 py-4 rounded-xl text-[17px] font-bold transition-colors ${isActive(link.path) ? 'bg-gold-50 text-gold-600' : 'text-ink-800 hover:bg-ink-50'}`}>{link.label}</Link>
              ))}
            </nav>
            <div className="p-4 border-t border-ink-100 space-y-3 shrink-0">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-4 rounded-xl text-lg font-bold border-2 border-ink-900 text-ink-900 hover:bg-ink-50">{t('auth.login')}</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-4 rounded-xl text-lg font-bold bg-ink-900 text-white hover:bg-black" data-testid="mobile-menu-signup">{t('auth.signup')}</Link>
                </>
              ) : (
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-center px-4 py-4 rounded-xl text-lg font-bold text-error-600 border border-error-200 hover:bg-error-50">{t('auth.logout')}</button>
              )}
              <div className="flex justify-center pt-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
