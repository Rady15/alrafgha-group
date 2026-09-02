import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPage = () => {
  const { t } = useTranslation('docs');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: t('privacy.sec.0.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.0.content.0.subtitle'), text: t('privacy.sec.0.content.0.text') },
        { subtitle: t('privacy.sec.0.content.1.subtitle'), text: t('privacy.sec.0.content.1.text') },
        { subtitle: t('privacy.sec.0.content.2.subtitle'), text: t('privacy.sec.0.content.2.text') },
        { subtitle: t('privacy.sec.0.content.3.subtitle'), text: t('privacy.sec.0.content.3.text') },
        { subtitle: t('privacy.sec.0.content.4.subtitle'), text: t('privacy.sec.0.content.4.text') },
        { subtitle: t('privacy.sec.0.content.5.subtitle'), text: t('privacy.sec.0.content.5.text') }
      ]
    },
    {
      title: t('privacy.sec.1.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.1.content.0.subtitle'), text: t('privacy.sec.1.content.0.text') },
        { subtitle: t('privacy.sec.1.content.1.subtitle'), text: t('privacy.sec.1.content.1.text') },
        { subtitle: t('privacy.sec.1.content.2.subtitle'), text: t('privacy.sec.1.content.2.text') },
        { subtitle: t('privacy.sec.1.content.3.subtitle'), text: t('privacy.sec.1.content.3.text') },
        { subtitle: t('privacy.sec.1.content.4.subtitle'), text: t('privacy.sec.1.content.4.text') },
        { subtitle: t('privacy.sec.1.content.5.subtitle'), text: t('privacy.sec.1.content.5.text') }
      ]
    },
    {
      title: t('privacy.sec.2.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.2.content.0.subtitle'), text: t('privacy.sec.2.content.0.text') },
        { subtitle: t('privacy.sec.2.content.1.subtitle'), text: t('privacy.sec.2.content.1.text') },
        { subtitle: t('privacy.sec.2.content.2.subtitle'), text: t('privacy.sec.2.content.2.text') },
        { subtitle: t('privacy.sec.2.content.3.subtitle'), text: t('privacy.sec.2.content.3.text') },
        { subtitle: t('privacy.sec.2.content.4.subtitle'), text: t('privacy.sec.2.content.4.text') },
        { subtitle: t('privacy.sec.2.content.5.subtitle'), text: t('privacy.sec.2.content.5.text') }
      ]
    },
    {
      title: t('privacy.sec.3.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.3.content.0.subtitle'), text: t('privacy.sec.3.content.0.text') },
        { subtitle: t('privacy.sec.3.content.1.subtitle'), text: t('privacy.sec.3.content.1.text') },
        { subtitle: t('privacy.sec.3.content.2.subtitle'), text: t('privacy.sec.3.content.2.text') },
        { subtitle: t('privacy.sec.3.content.3.subtitle'), text: t('privacy.sec.3.content.3.text') },
        { subtitle: t('privacy.sec.3.content.4.subtitle'), text: t('privacy.sec.3.content.4.text') }
      ]
    },
    {
      title: t('privacy.sec.4.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.4.content.0.subtitle'), text: t('privacy.sec.4.content.0.text') },
        { subtitle: t('privacy.sec.4.content.1.subtitle'), text: t('privacy.sec.4.content.1.text') },
        { subtitle: t('privacy.sec.4.content.2.subtitle'), text: t('privacy.sec.4.content.2.text') },
        { subtitle: t('privacy.sec.4.content.3.subtitle'), text: t('privacy.sec.4.content.3.text') }
      ]
    },
    {
      title: t('privacy.sec.5.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.5.content.0.subtitle'), text: t('privacy.sec.5.content.0.text') },
        { subtitle: t('privacy.sec.5.content.1.subtitle'), text: t('privacy.sec.5.content.1.text') },
        { subtitle: t('privacy.sec.5.content.2.subtitle'), text: t('privacy.sec.5.content.2.text') }
      ]
    },
    {
      title: t('privacy.sec.6.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.6.content.0.subtitle'), text: t('privacy.sec.6.content.0.text') },
        { subtitle: t('privacy.sec.6.content.1.subtitle'), text: t('privacy.sec.6.content.1.text') },
        { subtitle: t('privacy.sec.6.content.2.subtitle'), text: t('privacy.sec.6.content.2.text') },
        { subtitle: t('privacy.sec.6.content.3.subtitle'), text: t('privacy.sec.6.content.3.text') }
      ]
    },
    {
      title: t('privacy.sec.7.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.7.content.0.subtitle'), text: t('privacy.sec.7.content.0.text') }
      ]
    },
    {
      title: t('privacy.sec.8.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.8.content.0.subtitle'), text: t('privacy.sec.8.content.0.text') }
      ]
    },
    {
      title: t('privacy.sec.9.title'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      content: [
        { subtitle: t('privacy.sec.9.content.0.subtitle'), text: t('privacy.sec.9.content.0.text') }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden bg-linear-to-r from-secondary-600 via-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1
            data-testid="privacy-page-title"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
          >
            {t('privacy.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-primary-100">
            {t('privacy.heroSubtitle')}
          </p>
          <p className="text-sm text-primary-200 mt-4">
            {t('privacy.lastUpdated')}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border-l-4 border-secondary-600 p-6 rounded-r-xl mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">{t('privacy.commitmentTitle')} <span className='text-red-600'>:</span></h2>
            <p className="text-neutral-700 leading-relaxed mb-3">
              {t('privacy.commitmentText.0')}
            </p>
            <p className="text-neutral-700 leading-relaxed mb-3">
              {t('privacy.commitmentText.1')}
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {t('privacy.commitmentText.2')}
            </p>
          </div>

          {/* User Type Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('privacy.userType.0.title')}</h3>
              <p className="text-sm text-neutral-600">{t('privacy.userType.0.desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('privacy.userType.1.title')}</h3>
              <p className="text-sm text-neutral-600">{t('privacy.userType.1.desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('privacy.userType.2.title')}</h3>
              <p className="text-sm text-neutral-600">{t('privacy.userType.2.desc')}</p>
            </div>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                data-testid={`privacy-section-${sectionIndex}`}
                className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-neutral-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-linear-to-r from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white mr-4 shrink-0">
                    {section.icon}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mt-2">{section.title}</h2>
                </div>
                <div className="space-y-4 ml-0 md:ml-16">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2"><span className='text-red-500'>●</span> {item.subtitle}</h3>
                      <p className="text-neutral-700 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-linear-to-r from-secondary-600 to-primary-600 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.questionsTitle')}</h2>
            <p className="text-primary-100 leading-relaxed mb-6">
              {t('privacy.questionsText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/help"
                data-testid="privacy-help-center-btn"
                className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-50 transition-colors duration-200 text-center"
              >
                {t('privacy.visitHelp')}
              </Link>
              <a
                href="mailto:privacy@alrafgha-group.com"
                data-testid="privacy-email-btn"
                className="inline-block bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors duration-200 border-2 border-white text-center"
              >
                {t('privacy.emailBtn')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
