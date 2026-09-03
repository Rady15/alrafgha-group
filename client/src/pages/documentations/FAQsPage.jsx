import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../i18n/format';

const FAQsPage = () => {
  const { t } = useTranslation('docs');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      category: t('faq.cat.0'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      faqs: [
        {
          question: t('faq.c.0.0.q'),
          answer: t('faq.c.0.0.a')
        },
        {
          question: t('faq.c.0.1.q'),
          answer: t('faq.c.0.1.a')
        },
        {
          question: t('faq.c.0.2.q'),
          answer: t('faq.c.0.2.a')
        },
        {
          question: t('faq.c.0.3.q'),
          answer: t('faq.c.0.3.a')
        }
      ]
    },
    {
      category: t('faq.cat.1'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      faqs: [
        {
          question: t('faq.c.1.0.q'),
          answer: t('faq.c.1.0.a')
        },
        {
          question: t('faq.c.1.1.q'),
          answer: t('faq.c.1.1.a')
        },
        {
          question: t('faq.c.1.2.q'),
          answer: t('faq.c.1.2.a')
        },
        {
          question: t('faq.c.1.3.q'),
          answer: t('faq.c.1.3.a')
        },
        {
          question: t('faq.c.1.4.q'),
          answer: t('faq.c.1.4.a')
        }
      ]
    },
    {
      category: t('faq.cat.2'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      faqs: [
        {
          question: t('faq.c.2.0.q'),
          answer: t('faq.c.2.0.a')
        },
        {
          question: t('faq.c.2.1.q'),
          answer: t('faq.c.2.1.a', { bikeHour: formatPrice(30), bikeKm: formatPrice(3), carHour: formatPrice(150), carKm: formatPrice(15) })
        },
        {
          question: t('faq.c.2.2.q'),
          answer: t('faq.c.2.2.a')
        },
        {
          question: t('faq.c.2.3.q'),
          answer: t('faq.c.2.3.a')
        },
        {
          question: t('faq.c.2.4.q'),
          answer: t('faq.c.2.4.a')
        },
        {
          question: t('faq.c.2.5.q'),
          answer: t('faq.c.2.5.a')
        }
      ]
    },
    {
      category: t('faq.cat.3'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      faqs: [
        {
          question: t('faq.c.3.0.q'),
          answer: t('faq.c.3.0.a')
        },
        {
          question: t('faq.c.3.1.q'),
          answer: t('faq.c.3.1.a')
        },
        {
          question: t('faq.c.3.2.q'),
          answer: t('faq.c.3.2.a')
        },
        {
          question: t('faq.c.3.3.q'),
          answer: t('faq.c.3.3.a')
        },
        {
          question: t('faq.c.3.4.q'),
          answer: t('faq.c.3.4.a')
        },
        {
          question: t('faq.c.3.5.q'),
          answer: t('faq.c.3.5.a')
        }
      ]
    },
    {
      category: t('faq.cat.4'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      faqs: [
        {
          question: t('faq.c.4.0.q'),
          answer: t('faq.c.4.0.a')
        },
        {
          question: t('faq.c.4.1.q'),
          answer: t('faq.c.4.1.a')
        },
        {
          question: t('faq.c.4.2.q'),
          answer: t('faq.c.4.2.a')
        },
        {
          question: t('faq.c.4.3.q'),
          answer: t('faq.c.4.3.a')
        }
      ]
    },
    {
      category: t('faq.cat.5'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      faqs: [
        {
          question: t('faq.c.5.0.q'),
          answer: t('faq.c.5.0.a')
        },
        {
          question: t('faq.c.5.1.q'),
          answer: t('faq.c.5.1.a')
        },
        {
          question: t('faq.c.5.2.q'),
          answer: t('faq.c.5.2.a')
        },
        {
          question: t('faq.c.5.3.q'),
          answer: t('faq.c.5.3.a')
        },
        {
          question: t('faq.c.5.4.q'),
          answer: t('faq.c.5.4.a')
        }
      ]
    },
    {
      category: t('faq.cat.6'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      faqs: [
        {
          question: t('faq.c.6.0.q'),
          answer: t('faq.c.6.0.a')
        },
        {
          question: t('faq.c.6.1.q'),
          answer: t('faq.c.6.1.a')
        },
        {
          question: t('faq.c.6.2.q'),
          answer: t('faq.c.6.2.a')
        },
        {
          question: t('faq.c.6.3.q'),
          answer: t('faq.c.6.3.a')
        },
        {
          question: t('faq.c.6.4.q'),
          answer: t('faq.c.6.4.a')
        },
        {
          question: t('faq.c.6.5.q'),
          answer: t('faq.c.6.5.a')
        }
      ]
    },
    {
      category: t('faq.cat.7'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      faqs: [
        {
          question: t('faq.c.7.0.q'),
          answer: t('faq.c.7.0.a')
        },
        {
          question: t('faq.c.7.1.q'),
          answer: t('faq.c.7.1.a')
        },
        {
          question: t('faq.c.7.2.q'),
          answer: t('faq.c.7.2.a')
        },
        {
          question: t('faq.c.7.3.q'),
          answer: t('faq.c.7.3.a')
        },
        {
          question: t('faq.c.7.4.q'),
          answer: t('faq.c.7.4.a')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1
            data-testid="faq-page-title"
            className="text-4xl md:text-5xl lg:text-6xl font-display leading-tight font-bold text-neutral-900 mb-6"
          >
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-600">{t('faq.heroTitle')}</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600">
            {t('faq.heroSubtitle')}
          </p>
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

      {/* Quick Navigation */}
      <section className="py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-primary-600 mb-4">{t('faq.jumpTo')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {faqCategories.map((category, index) => (
              <a
                key={index}
                href={`#category-${index}`}
                className="px-4 py-2 bg-neutral-200 hover:bg-primary-300 text-neutral-700 hover:text-black rounded-full text-sm font-medium transition-colors"
              >
                {category.category}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} id={`category-${categoryIndex}`} className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center text-white">
                  {category.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900">
                  {category.category} <span className='text-red-500'>:</span>
                </h2>
              </div>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div
                      key={faqIndex}
                      className="bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 rounded-xl shadow-md border border-primary-100 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        data-testid={`faq-question-${globalIndex}`}
                        className="w-full px-6 py-5 text-left flex items-center justify-between"
                      >
                        <span className="text-lg font-semibold text-neutral-900 pr-4">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-6 h-6 text-primary-600 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
                      >
                        <div className="px-6 pb-5 pt-2">
                          <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-linear-to-r from-primary-600 via-secondary-600 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t('faq.stillTitle')}</h2>
          <p className="text-xl text-primary-100 mb-8">
            {t('faq.stillSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/help"
              data-testid="faq-help-center-btn"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-neutral-50 transition-colors duration-200 shadow-xl"
            >
              {t('faq.visitHelp')}
            </Link>
            <a
              href="mailto:support@alrafgha-group.com"
              data-testid="faq-email-support-btn"
              className="inline-block bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-700 transition-colors duration-200 border-2 border-white"
            >
              {t('faq.emailSupport')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQsPage;
