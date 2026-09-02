import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language || 'en';

  const btn = (lang, label) => (
    <button
      key={lang}
      type="button"
      onClick={() => changeLanguage(lang)}
      className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
        current.startsWith(lang)
          ? 'bg-white text-ink-900 shadow'
          : 'text-ink-500 hover:text-ink-900'
      }`}
      aria-label={`Switch to ${label}`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="flex items-center gap-0.5 rounded-full bg-ink-100 p-1 text-xs font-semibold select-none"
      data-testid="language-switcher"
    >
      {btn('en', 'EN')}
      {btn('ar', 'ع')}
    </div>
  );
};

export default LanguageSwitcher;
