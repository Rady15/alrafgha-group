import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AboutUsPage = () => {
  const { t, i18n } = useTranslation('docs');
  const brandName = i18n.language && i18n.language.startsWith('ar') ? 'الرفقه جروب' : 'Alrafgha Group';

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('about.values.0.title'),
      description: t('about.values.0.description')
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('about.values.1.title'),
      description: t('about.values.1.description')
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: t('about.values.2.title'),
      description: t('about.values.2.description')
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('about.values.3.title'),
      description: t('about.values.3.description')
    }
  ];

  const milestones = [
    { year: '2025', title: t('about.milestone.0.title'), description: t('about.milestone.0.description') },
    { year: '2026', title: t('about.milestone.1.title'), description: t('about.milestone.1.description') }
  ];

  const stats = [
    { number: '1000+', label: t('about.stat.registeredUsers') },
    { number: '15+', label: t('about.stat.vehiclesListed') },
    { number: '5+', label: t('about.stat.verifiedVendors') },
    { number: '3+', label: t('about.stat.citiesCovered') }
  ];

  const howItWorks = [
    {
      step: '1',
      title: t('about.how.0.title'),
      description: t('about.how.0.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      step: '2',
      title: t('about.how.1.title'),
      description: t('about.how.1.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      step: '3',
      title: t('about.how.2.title'),
      description: t('about.how.2.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      step: '4',
      title: t('about.how.3.title'),
      description: t('about.how.3.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      step: '5',
      title: t('about.how.4.title'),
      description: t('about.how.4.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  const forWhom = [
    {
      title: t('about.for.0.title'),
      description: t('about.for.0.description'),
      features: [t('about.for.0.features.0'), t('about.for.0.features.1'), t('about.for.0.features.2'), t('about.for.0.features.3'), t('about.for.0.features.4')],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: t('about.for.1.title'),
      description: t('about.for.1.description'),
      features: [t('about.for.1.features.0'), t('about.for.1.features.1'), t('about.for.1.features.2'), t('about.for.1.features.3'), t('about.for.1.features.4')],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: t('about.for.2.title'),
      description: t('about.for.2.description'),
      features: [t('about.for.2.features.0'), t('about.for.2.features.1'), t('about.for.2.features.2'), t('about.for.2.features.3'), t('about.for.2.features.4')],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1
              data-testid="about-page-title"
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6"
            >
              {t('about.heroTitle')} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-600">{brandName}</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">
              {t('about.heroSubtitle')}
            </p>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-6 w-32 h-32 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-6 -left-12 w-20 h-20 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-20 left-4 w-14 h-14 bg-yellow-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-16 right-24 w-28 h-28 bg-pink-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-32 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-50 blur-md" />
          <div className="absolute top-44 right-16 w-12 h-12 bg-green-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-10 right-8 w-24 h-24 bg-red-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-4 right-24 w-16 h-16 bg-blue-300 rounded-full opacity-50 blur-md" />
          <div className="absolute -bottom-20 right-16 w-12 h-12 bg-yellow-300 rounded-full opacity-50 blur-md" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-linear-to-br from-primary-50 to-white p-8 md:p-10 rounded-2xl shadow-lg border border-primary-100">
              <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">{t('about.missionTitle')} <span className='text-red-500'>:</span></h2>
              <p className="text-neutral-700 leading-relaxed">
                {t('about.missionText')}
              </p>
            </div>

            <div className="bg-linear-to-br from-secondary-50 to-white p-8 md:p-10 rounded-2xl shadow-lg border border-secondary-100">
              <div className="w-16 h-16 bg-linear-to-br from-secondary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">{t('about.visionTitle')} <span className='text-red-500'>:</span></h2>
              <p className="text-neutral-700 leading-relaxed">
                {t('about.visionText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">{t('about.howItWorksTitle')} <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">{t('about.howItWorksSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border border-neutral-100 hover:shadow-xl transition-all duration-300 relative"
              >
                <div className="absolute -top-4 left-6 w-10 h-10 bg-linear-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {step.step}
                </div>
                <div className="mt-4 mb-4 text-primary-600">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is Alrafgha Group For Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">{t('about.forWhomTitle')} <span className='text-red-500'>?</span></h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">{t('about.forWhomSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {forWhom.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className={`bg-linear-to-r ${item.color} p-6 text-white`}>
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90 text-sm">{item.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-neutral-700">
                        <svg className="w-5 h-5 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">{t('about.valuesTitle')} <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">{t('about.valuesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-100 hover:border-primary-200 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">{t('about.differentTitle')} <span className='text-red-500'>?</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-xl border border-emerald-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('about.diff.0.title')}
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                {t('about.diff.0.description')}
              </p>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t('about.diff.1.title')}
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                {t('about.diff.1.description')}
              </p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {t('about.diff.2.title')}
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                {t('about.diff.2.description')}
              </p>
            </div>
            <div className="bg-linear-to-br from-orange-50 to-white p-8 rounded-xl border border-orange-100">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('about.diff.3.title')}
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                {t('about.diff.3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20 bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">{t('about.journeyTitle')} <span className='text-red-500'>:</span></h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">{t('about.journeySubtitle')}</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-primary-500 to-secondary-500 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <div className="bg-red-50 p-6 rounded-xl shadow-lg border border-neutral-200 inline-block">
                      <div className="text-3xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{milestone.title}</h3>
                      <p className="text-neutral-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-linear-to-br from-primary-500 to-secondary-600 rounded-full border-4 border-white shadow-lg z-10 my-4 md:my-0" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-linear-to-r from-primary-600 via-secondary-600 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{t('about.ctaTitle')}</h2>
          <p className="text-xl text-primary-100 mb-8">{t('about.ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vehicles"
              data-testid="about-browse-vehicles-btn"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 transition-colors duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {t('about.ctaBrowse')}
            </Link>
            <Link
              to="/vendor"
              className="inline-block bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-700 transition-colors duration-200 border-2 border-white"
            >
              {t('about.ctaVendor')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
