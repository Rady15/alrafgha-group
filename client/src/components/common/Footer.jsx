import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: t('footer.company.about'), path: '/about' },
      { label: t('footer.company.contact'), path: '/help' },
      { label: t('footer.company.careers'), path: '/about' },
      { label: t('footer.company.blog'), path: '/about' },
    ],
    services: [
      { label: t('footer.services.carRentals'), path: '/vehicles?type=car' },
      { label: t('footer.services.bikeRentals'), path: '/vehicles?type=bike' },
      { label: t('footer.services.becomeVendor'), path: '/vendor' },
      { label: t('footer.services.pricing'), path: '/pricing' },
    ],
    support: [
      { label: t('footer.support.help'), path: '/help' },
      { label: t('footer.support.faqs'), path: '/faq' },
      { label: t('footer.support.terms'), path: '/terms' },
      { label: t('footer.support.privacy'), path: '/privacy' },
    ],
  };

  return (
    <footer className="relative bg-ink-950 text-white overflow-hidden" data-testid="footer">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid-light opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Mega CTA banner */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 p-8 sm:p-12 overflow-hidden">
          <div className="absolute inset-0 dot-grid-light opacity-50" />
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-accent-300/40 rounded-full blur-3xl animate-float" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-4xl sm:text-5xl font-display font-bold leading-[0.95] tracking-tight">
                {t('footer.ctaTitle')} <em className="not-italic underline decoration-accent-300 decoration-4 underline-offset-4">{t('footer.ctaEmphasis')}</em>?
              </h3>
              <p className="mt-3 text-white/85 text-base max-w-md">
                {t('footer.ctaSubtitle')}
              </p>
            </div>
            <div className="flex md:justify-end gap-3">
              <Link
                to="/vehicles"
                data-testid="footer-cta-browse"
                className="group inline-flex items-center gap-2 px-6 py-4 bg-white text-ink-900 rounded-full font-bold magnetic shadow-lg"
              >
                {t('footer.browseFleet')}
                <span className="w-7 h-7 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
              <Link
                to="/vendor"
                data-testid="footer-cta-vendor"
                className="hidden sm:inline-flex items-center px-6 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold hover:bg-white/20 transition-all"
              >
                {t('footer.becomeVendor')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-36 sm:pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img src="/arafgha-logo.png" alt="Alrafgha Group" className="h-10 w-auto" />
            </Link>

            <p className="text-ink-300 text-sm leading-relaxed max-w-xs">
              {t('footer.about')}
            </p>

            <div className="space-y-2.5 text-sm text-ink-300">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 bg-ink-800 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary-400" />
                </span>
                <span>{t('footer.contactEmail')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 bg-ink-800 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary-400" />
                </span>
                <span>{t('footer.contactPhone')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 bg-ink-800 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary-400" />
                </span>
                <span>{t('footer.contactAddress')}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {[
                { d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { d: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                { d: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-ink-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-rotate-6"
                  aria-label="social"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: t('footer.sections.company'), items: footerLinks.company },
            { title: t('footer.sections.services'), items: footerLinks.services },
            { title: t('footer.sections.support'), items: footerLinks.support },
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className="text-[11px] font-bold text-primary-400 uppercase tracking-[0.2em] mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-1.5 text-ink-300 hover:text-white text-sm transition-colors"
                    >
                      <span className="link-underline">{link.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-ink-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-ink-400 text-xs">
            © {currentYear} <span className="text-white font-semibold">Alrafgha Group</span>. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;