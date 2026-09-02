import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TermsPage = () => {
  const { t } = useTranslation('docs');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: t('terms.sec.0.title'),
      content: t('terms.sec.0.content')
    },
    {
      title: t('terms.sec.1.title'),
      content: t('terms.sec.1.content')
    },
    {
      title: t('terms.sec.2.title'),
      content: t('terms.sec.2.content')
    },
    {
      title: t('terms.sec.3.title'),
      content: t('terms.sec.3.content')
    },
    {
      title: t('terms.sec.4.title'),
      content: t('terms.sec.4.content')
    },
    {
      title: t('terms.sec.5.title'),
      content: t('terms.sec.5.content')
    },
    {
      title: t('terms.sec.6.title'),
      content: t('terms.sec.6.content')
    },
    {
      title: t('terms.sec.7.title'),
      content: t('terms.sec.7.content')
    },
    {
      title: t('terms.sec.8.title'),
      content: t('terms.sec.8.content')
    },
    {
      title: t('terms.sec.9.title'),
      content: t('terms.sec.9.content')
    },
    {
      title: t('terms.sec.10.title'),
      content: t('terms.sec.10.content')
    },
    {
      title: t('terms.sec.11.title'),
      content: t('terms.sec.11.content')
    },
    {
      title: t('terms.sec.12.title'),
      content: t('terms.sec.12.content')
    },
    {
      title: t('terms.sec.13.title'),
      content: t('terms.sec.13.content')
    },
    {
      title: t('terms.sec.14.title'),
      content: t('terms.sec.14.content')
    },
    {
      title: t('terms.sec.15.title'),
      content: t('terms.sec.15.content')
    },
    {
      title: t('terms.sec.16.title'),
      content: t('terms.sec.16.content')
    },
    {
      title: t('terms.sec.17.title'),
      content: t('terms.sec.17.content')
    },
    {
      title: t('terms.sec.18.title'),
      content: t('terms.sec.18.content')
    },
    {
      title: t('terms.sec.19.title'),
      content: t('terms.sec.19.content')
    },
    {
      title: t('terms.sec.20.title'),
      content: t('terms.sec.20.content')
    },
    {
      title: t('terms.sec.21.title'),
      content: t('terms.sec.21.content')
    },
    {
      title: t('terms.sec.22.title'),
      content: t('terms.sec.22.content')
    }
  ];

  const paymentSummary = [
    t('terms.paymentSummary.0'),
    t('terms.paymentSummary.1'),
    t('terms.paymentSummary.2'),
    t('terms.paymentSummary.3')
  ];
  const cancelGuide = [
    t('terms.cancelGuide.0'),
    t('terms.cancelGuide.1'),
    t('terms.cancelGuide.2'),
    t('terms.cancelGuide.3')
  ];
  const pickupReq = [
    t('terms.pickupReq.0'),
    t('terms.pickupReq.1'),
    t('terms.pickupReq.2'),
    t('terms.pickupReq.3')
  ];
  const vendorEssentials = [
    t('terms.vendorEssentials.0'),
    t('terms.vendorEssentials.1'),
    t('terms.vendorEssentials.2'),
    t('terms.vendorEssentials.3')
  ];
  const keyPoints = [
    t('terms.keyPoints.0'),
    t('terms.keyPoints.1'),
    t('terms.keyPoints.2'),
    t('terms.keyPoints.3'),
    t('terms.keyPoints.4')
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden bg-linear-to-r from-primary-600 via-secondary-600 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1
            data-testid="terms-page-title"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
          >
            {t('terms.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-primary-100">
            {t('terms.heroSubtitle')}
          </p>
          <p className="text-sm text-primary-200 mt-4">
            {t('terms.lastUpdated')}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border-l-4 border-primary-600 p-6 rounded-r-xl mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">{t('terms.importantTitle')} <span className='text-red-600'>:</span></h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              {t('terms.importantText1')}
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {t('terms.importantText2')}
            </p>
          </div>

          {/* Quick Reference Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                {t('terms.paymentSummaryTitle')}
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                {paymentSummary.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('terms.cancelGuideTitle')}
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                {cancelGuide.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('terms.pickupReqTitle')}
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                {pickupReq.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
              <h3 className="font-bold text-neutral-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
                {t('terms.vendorEssentialsTitle')}
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                {vendorEssentials.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                data-testid={`terms-section-${index}`}
                className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-neutral-200 hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4 flex items-start">
                  <span className="bg-linear-to-r from-primary-500 to-secondary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <span>{section.title}</span>
                </h2>
                <p className="text-neutral-700 leading-relaxed ml-11">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Key Highlights */}
          <div className="mt-12 bg-amber-50 border border-amber-200 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {t('terms.keyPointsTitle')}
            </h3>
            <ul className="space-y-2 text-amber-900">
              {keyPoints.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Agreement Section */}
          <div className="mt-12 bg-linear-to-r from-primary-600 to-secondary-600 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">{t('terms.agreementTitle')}</h2>
            <p className="text-primary-100 leading-relaxed mb-6">
              {t('terms.agreementText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/help"
                data-testid="terms-help-center-btn"
                className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-50 transition-colors duration-200 text-center"
              >
                {t('terms.contactSupport')}
              </Link>
              <Link
                to="/privacy"
                data-testid="terms-privacy-link"
                className="inline-block bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors duration-200 border-2 border-white text-center"
              >
                {t('terms.viewPrivacy')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
