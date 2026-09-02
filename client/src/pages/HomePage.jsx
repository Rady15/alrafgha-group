import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice, formatDate, formatDateTime, formatTime, formatNumber } from '../i18n/format';
import VehicleCard from '../components/VehicleCard';
import VehicleCardSkeleton from '../components/VehicleCardSkeleton';
import { API_ENDPOINTS } from '../config/api';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
  Search,
  Calendar,
  KeyRound,
  ShieldCheck,
  Wallet,
  Headset,
  MapPin,
  Quote,
  TrendingUp,
  Bike,
  Car,
} from 'lucide-react';

const HomePage = () => {
  const { t } = useTranslation('home');
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.vehiclesFeatured);
        const data = await response.json();
        if (data.status === 'success') {
          setFeaturedVehicles(data.data.vehicles);
        }
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchFeaturedVehicles();
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Instant Booking',
      titleKey: 'instantBooking',
      description: 'Reserve any ride in 60 seconds — no advance, no hassle. Pickup ready when you are.',
    },
    {
      icon: Wallet,
      title: 'Pay-Per-Use',
      titleKey: 'payPerUse',
      description: 'Pay only for what you actually use — by distance or time, whichever benefits you more.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Insured',
      titleKey: 'verifiedInsured',
      description: 'Every vehicle is RC verified, insured, and maintained — your safety is non-negotiable.',
    },
    {
      icon: Headset,
      title: '24/7 Roadside',
      titleKey: 'roadside',
      description: 'Real humans, real fast. Call, chat or email — we are with you on every kilometer.',
    },
  ];

  const stats = [
    { value: '1000+', labelKey: 'happyRiders' },
    { value: '15+', labelKey: 'vehicles' },
    { value: '3+', labelKey: 'citiesLive' },
    { value: '4.9', labelKey: 'starRating' },
  ];

  const howItWorks = [
    {
      step: '01',
      icon: Search,
      titleKey: 'discover',
      title: 'Discover',
      description: 'Browse our curated fleet by type, city, package or vibe. Filter your perfect match in seconds.',
    },
    {
      step: '02',
      icon: Calendar,
      titleKey: 'book',
      title: 'Book',
      description: 'Choose pickup date and location. Lock your ride instantly — no upfront payment needed.',
    },
    {
      step: '03',
      icon: KeyRound,
      titleKey: 'ride',
      title: 'Ride',
      description: 'Pick up your keys, hit the open road. Return when done, pay only for what you used.',
    },
  ];

  const testimonials = [
    {
      name: 'محمد العتيبي',
      role: 'Weekend Road-tripper',
      roleKey: 'weekendRoadTripper',
      commentKey: 'comment1',
      savings: 2000,
      image: 'https://ui-avatars.com/api/?name=محمد+العتيبي&background=FF5722&color=fff&size=128',
      rating: 5,
    },
    {
      name: 'نورة الدوسري',
      role: 'City Commuter',
      roleKey: 'cityCommuter',
      commentKey: 'comment2',
      image: 'https://ui-avatars.com/api/?name=نورة+الدوسري&background=EF4444&color=fff&size=128',
      rating: 5,
    },
    {
      name: 'خالد القحطاني',
      role: 'Frequent Traveler',
      roleKey: 'frequentTraveler',
      commentKey: 'comment3',
      image: 'https://ui-avatars.com/api/?name=خالد+القحطاني&background=F59E0B&color=fff&size=128',
      rating: 5,
    },
  ];

  const vehicleCategories = [
    {
      name: 'City Cars',
      nameKey: 'cityCars',
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&h=400&fit=crop',
      count: '5+',
      tag: 'Daily drivers',
      tagKey: 'dailyDrivers',
      type: 'car',
    },
    {
      name: 'SUVs',
      nameKey: 'suvs',
      image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=600&h=400&fit=crop',
      count: '3+',
      tag: 'Family trips',
      tagKey: 'familyTrips',
      type: 'car',
    },
    {
      name: 'Commuter Bikes',
      nameKey: 'commuterBikes',
      image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?w=600&h=400&fit=crop',
      count: '5+',
      tag: 'Quick errands',
      tagKey: 'quickErrands',
      type: 'bike',
    },
    {
      name: 'Sports Bikes',
      nameKey: 'sportsBikes',
      image: 'https://images.unsplash.com/photo-1598209279122-8541213a0387?w=600&h=400&fit=crop',
      count: '3+',
      tag: 'Adrenaline',
      tagKey: 'adrenaline',
      type: 'bike',
    },
  ];

  const brands = ['HONDA', 'TOYOTA', 'MARUTI', 'HYUNDAI', 'YAMAHA', 'KTM', 'ROYAL ENFIELD', 'TATA', 'KIA', 'BAJAJ', 'MAHINDRA'];

  return (
    <div className="min-h-screen bg-[#fafaf7] overflow-x-hidden">
      {/* ============================ HERO ============================ */}
      <section className="relative bg-[#fafaf7] pt-10 pb-24 sm:pt-16 lg:pt-20 overflow-hidden" data-testid="hero-section">
        {/* decorative background */}
        <div className="absolute inset-0 grid-lines opacity-70 pointer-events-none" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-primary-200 rounded-full blur-[120px] opacity-50 pointer-events-none animate-float" />
        <div className="absolute top-40 -right-20 w-80 h-80 bg-secondary-200 rounded-full blur-[100px] opacity-50 pointer-events-none animate-float-delay" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-white rounded-full text-xs font-semibold tracking-wide mb-8 animate-fade-in-up" data-testid="hero-pill">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-primary-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-primary-500" />
            </span>
            <span>{t('hero.pillLive')}{' '}<span className='hidden sm:inline'>{t('hero.pillMiddle')}</span>{' '}{t('hero.pillSuffix')}</span>
          </div>

          {/* Mega headline */}
          <div className="grid lg:grid-cols-12 gap-8 items-end mb-10">
            <div className="lg:col-span-8">
              <h1 className="font-display font-bold text-[44px] sm:text-6xl lg:text-[88px] leading-[0.9] tracking-[-0.04em] text-ink-900 animate-fade-in-up">
                {t('hero.headline1')}
                <br />
                <span className="inline-flex items-baseline gap-4 flex-wrap">
                  <em className="not-italic text-gradient-warm">{t('hero.headlineTap')}</em>
                  <span className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-ink-900 text-primary-400 rounded-2xl rotate-[-6deg] md:animate-float">
                    <Zap className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11" strokeWidth={2.5} fill="currentColor" />
                  </span>
                </span>
                <br />
                {t('hero.headline2')}
              </h1>
            </div>
            <div className="lg:col-span-4 space-y-5 animate-fade-in-up delay-200">
              <p className="text-ink-600 text-lg leading-relaxed text-pretty">
                {t('hero.subtext')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/vehicles"
                  data-testid="hero-cta-browse"
                  className="group inline-flex items-center gap-2 px-6 py-4 bg-primary-500 text-white rounded-full font-semibold magnetic shine"
                >
                  <span>{t('common:footer.browseFleet')}</span>
                  <span className="w-7 h-7 bg-white text-primary-600 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                </Link>
                <Link
                  to="/pricing"
                  data-testid="hero-cta-pricing"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-white border border-ink-200 text-ink-900 rounded-full font-semibold hover:border-ink-900 transition-all magnetic"
                >
                  {t('hero.seePricing')}
                </Link>
              </div>
            </div>
          </div>

          {/* Hero image collage */}
          <div className="grid grid-cols-12 gap-3 sm:gap-5 mt-6 animate-fade-in-up delay-300">
            <div className="col-span-12 sm:col-span-7 relative rounded-3xl overflow-hidden h-72 sm:h-[420px] group">
              <img
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop"
                alt="Premium car"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1500ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent" />

              {/* Floating live tag */}
              <div className="absolute top-5 left-5 flex items-center gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider text-ink-900 shadow-lg">
                <Car className="w-3.5 h-3.5 text-primary-500" />
                {t('hero.carsFrom', { price: formatPrice(999) })}
              </div>

              {/* Floating verified card */}
              <div className="absolute bottom-5 right-5 bg-white rounded-2xl p-3.5 shadow-2xl animate-float hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{t('hero.verified')}</div>
                  <div className="text-sm font-bold text-ink-900">{t('hero.allVehicles')}</div>
                </div>
              </div>

              {/* Bottom strip */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto">
                <p className="font-display text-white font-bold text-2xl sm:text-4xl leading-tight">
                  {t('hero.driveLatest')}{' '}
                  <em className="not-italic text-primary-300">{t('hero.onDemand')}</em>
                </p>
              </div>
            </div>

            <div className="col-span-12 sm:col-span-5 grid grid-rows-2 gap-3 sm:gap-5">
              {/* Bike card */}
              <div className="relative rounded-3xl overflow-hidden bg-ink-900 group">
                <img
                  src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&h=400&fit=crop"
                  alt="Bike"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[1200ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink-900/90 via-ink-900/30 to-transparent" />
                <div className="relative h-full p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
                    <Bike className="w-3.5 h-3.5" />
                    {t('hero.bikesBadge')}
                  </div>
                  <div>
                    <p className="font-display text-white font-bold text-2xl leading-tight">
                      {t('hero.zipAcrossTown')}
                    </p>
                    <p className="text-white/70 text-xs mt-1">{t('hero.fromPrice', { price: formatPrice(299) })}</p>
                  </div>
                </div>
              </div>

              {/* Stats card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-600 text-white p-5 overflow-hidden">
                <div className="absolute inset-0 dot-grid-light opacity-60" />
                <div className="relative h-full flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{t('stats.trustedBy')}</span>
                  </div>
                  <div>
                    <div className="font-display text-5xl font-bold leading-none">1,000+</div>
                    <div className="text-white/85 text-xs mt-1">{t('stats.happyTravelers')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 animate-fade-in-up delay-500" data-testid="hero-stats">
            {stats.map((s, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-5 border border-ink-100 hover:border-ink-900 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="font-display text-3xl sm:text-4xl font-bold text-ink-900">{s.value}</div>
                <div className="text-xs text-ink-500 uppercase tracking-[0.15em] font-semibold mt-1">{t('stats.' + s.labelKey)}</div>
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ BRAND MARQUEE ============================ */}
      <section className="relative bg-ink-900 text-white py-6 overflow-hidden border-y border-ink-800">
        <div className="marquee-track gap-12 whitespace-nowrap">
          {[...brands, ...brands].map((b, i) => (
            <div key={i} className="flex items-center gap-12 shrink-0">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white/80 hover:text-primary-400 transition-colors">
                {b}
              </span>
              <span className="w-2 h-2 rounded-full bg-primary-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ============================ CATEGORIES ============================ */}
      <section className="relative py-24 bg-[#fafaf7]" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                {t('categories.badge')}
              </div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[0.95] tracking-tight">
                {t('categories.pickYour')}{' '}
                <em className="not-italic text-gradient-warm">{t('categories.vibe')}</em>
              </h2>
            </div>
            <p className="text-ink-600 max-w-md text-base">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {vehicleCategories.map((category, index) => (
              <Link
                key={index}
                to={`/vehicles?type=${category.type}`}
                className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden bg-ink-900 transition-all duration-500 hover:-translate-y-2"
                data-testid={`category-${category.name.toLowerCase().replace(' ', '-')}`}
              >
                <img
                  src={category.image}
                  alt={t('categories.' + category.nameKey)}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />

                {/* corner badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 rounded-full text-[10px] font-bold uppercase tracking-wider text-ink-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  {t('categories.' + category.tagKey)}
                </div>

                {/* arrow */}
                <div className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 text-ink-900" strokeWidth={2.5} />
                </div>

                {/* content */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="font-display text-3xl font-bold leading-tight">{t('categories.' + category.nameKey)}</h3>
                  <p className="text-white/80 text-xs mt-1 font-mono uppercase tracking-wider">
                    {t('categories.options', { count: category.count })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FEATURED VEHICLES ============================ */}
      <section className="relative py-24 bg-white border-t border-ink-100" data-testid="featured-vehicles-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-100 text-accent-700 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                <Star className="w-3.5 h-3.5 fill-current" />
                {t('featured.editorsPick')}
              </div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[0.95] tracking-tight">
                {t('featured.featuredRides')}<span className="text-primary-500">.</span>
              </h2>
              <p className="text-ink-600 mt-3 max-w-md">
                {t('featured.subtitle')}
              </p>
            </div>
            <Link
              to="/vehicles"
              data-testid="view-all-vehicles-btn"
              className="group hidden sm:inline-flex items-center gap-2 px-5 py-3 border border-ink-900 text-ink-900 rounded-full font-semibold magnetic"
            >
              <span>{t('featured.viewAll')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {loadingVehicles ? (
              Array.from({ length: 3 }).map((_, index) => <VehicleCardSkeleton key={index} />)
            ) : featuredVehicles.length > 0 ? (
              featuredVehicles.map((vehicle) => <VehicleCard key={vehicle._id} vehicle={vehicle} />)
            ) : (
              <div className="col-span-3 text-center py-16 bg-ink-50 rounded-3xl">
                <p className="text-ink-500 text-lg">{t('featured.noVehicles')}</p>
              </div>
            )}
          </div>

          <div className="text-center sm:hidden">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500 text-white rounded-full font-semibold magnetic"
            >
              {t('featured.viewAllVehicles')}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ HOW IT WORKS ============================ */}
      <section className="relative py-24 bg-ink-950 text-white overflow-hidden" data-testid="how-it-works-section">
        <div className="absolute inset-0 dot-grid-light opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 text-primary-300 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
              {t('howItWorks.badge')}
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight max-w-3xl mx-auto">
              {t('howItWorks.title')}
              <br />
              <em className="not-italic text-gradient-sunset">{t('howItWorks.openRoad')}</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Dotted connector */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-white/15" />

            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative bg-ink-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-7 hover:border-primary-500/50 transition-all duration-500 group hover:-translate-y-2"
                  data-testid={`how-it-works-step-${step.step}`}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="relative w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-[-8deg] transition-transform duration-500">
                        <Icon className="w-8 h-8" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="font-display text-6xl font-bold text-white/10 group-hover:text-primary-500/30 transition-colors">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">{t('howItWorks.' + step.titleKey + '.title')}</h3>
                  <p className="text-ink-300 leading-relaxed text-sm">{t('howItWorks.' + step.titleKey + '.description')}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ WHY CHOOSE ============================ */}
      <section className="relative py-24 bg-[#fafaf7]" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ink-900 text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                {t('features.badge')}
              </div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[0.95] tracking-tight">
                {t('features.title1')}{' '}
                <em className="not-italic text-gradient-warm">{t('features.freedom')}</em>,<br />
                {t('features.title2')}{' '}
                <em className="not-italic">{t('features.honesty')}</em>
              </h2>
            </div>
            <p className="lg:col-span-5 lg:col-start-8 text-ink-600 text-lg leading-relaxed self-end">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-7 border border-ink-100 hover:border-ink-900 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  data-testid={`feature-${feature.title.toLowerCase().replace(' ', '-')}`}
                >
                  {/* Decorative number */}
                  <div className="absolute top-5 right-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-300 font-bold">
                    0{index + 1}
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-ink-900 text-primary-400 flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-[-8deg] transition-all duration-500 shadow-lg">
                    <Icon className="w-7 h-7" strokeWidth={2} />
                  </div>

                  <h3 className="font-display text-xl font-bold text-ink-900 mb-2 leading-tight">
                    {t('features.' + feature.titleKey + '.title')}
                  </h3>
                  <p className="text-ink-600 text-sm leading-relaxed">{t('features.' + feature.titleKey + '.description')}</p>

                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-7 right-7 h-0.5 bg-ink-100 group-hover:bg-primary-500 transition-colors duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ STATS / EXPERIENCE ============================ */}
      <section className="relative py-24 bg-white border-t border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br Surgeon from-primary-200 to-secondary-200 rounded-[40px] blur-2xl opacity-50" />
              <div className="relative rounded-[36px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556740772-1a741367b93e?w=800&h=600&fit=crop"
                  alt="Alrafgha Group experience"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
              </div>

              {/* Floating GPS card */}
              <div className="absolute top-8 -right-3 sm:right-6 bg-white rounded-2xl shadow-2xl p-4 border border-ink-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-xl blur-md opacity-50" />
                    <div className="relative w-11 h-11 bg-green-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{t('experience.liveTracking')}</div>
                    <div className="text-sm font-bold text-ink-900">{t('experience.realTimeGps')}</div>
                  </div>
                </div>
              </div>

              {/* Floating support card */}
              <div className="absolute bottom-8 -left-3 sm:left-6 bg-ink-900 text-white rounded-2xl shadow-2xl p-4 animate-float-delay">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center">
                    <Headset className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{t('experience.support24')}</div>
                    <div className="text-sm font-bold">{t('experience.alwaysHere')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Contextual wrap */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('experience.premiumBadge')}
                </div>
                <h2 className="font-display font-bold text-4xl sm:text-5xl text-ink-900 leading-[0.95] tracking-tight mb-4">
                  {t('experience.title1')}{' '}
                  <em className="not-italic text-gradient-warm">{t('experience.titleEm')}</em>
                </h2>
                <p className="text-ink-600 text-lg">
                  {t('experience.subtitle')}
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    icon: Zap,
                    titleKey: 'item1',
                    title: 'Real-time booking system',
                    description: 'Lock your ride in 60 seconds with live availability across cities.',
                  },
                  {
                    icon: ShieldCheck,
                    titleKey: 'item2',
                    title: 'Verified documents always',
                    description: 'RC, insurance, fitness — every paper checked, every time.',
                  },
                  {
                    icon: Wallet,
                    titleKey: 'item3',
                    title: 'Pay your way',
                    description: 'Mada, Apple Pay, cards, cash — pay how you like, after your ride.',
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="group flex items-start gap-4 p-5 rounded-2xl border border-ink-100 hover:border-ink-900 transition-all hover:bg-ink-50/30">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-ink-900 text-primary-400 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-[-8deg] transition-all duration-500">
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-ink-900 leading-tight">{t('experience.' + item.titleKey + 'Title')}</h3>
                        <p className="text-ink-600 text-sm mt-1">{t('experience.' + item.titleKey + 'Desc')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/vehicles"
                className="group inline-flex items-center gap-2 px-6 py-4 bg-primary-500 text-white rounded-full font-semibold magnetic shine"
              >
                <span>{t('experience.startJourney')}</span>
                <span className="w-7 h-7 bg-white text-primary-600 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="relative py-24 bg-[#fafaf7] overflow-hidden" data-testid="testimonials-section">
        <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ink-900 text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
              <Star className="w-3.5 h-3.5 text-accent-400 fill-current" />
              {t('testimonials.badge')}
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[0.95] tracking-tight max-w-3xl mx-auto">
              {t('testimonials.title')}{' '}
              <em className="not-italic text-gradient-warm">{t('testimonials.titleEm')}</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tItem, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-3xl p-7 border border-ink-100 hover:border-ink-900 transition-all duration-500 hover:-translate-y-2"
                data-testid={`testimonial-${i}`}
              >
                <Quote className="w-10 h-10 text-primary-200 mb-4" strokeWidth={2} fill="currentColor" />
                <p className="text-ink-800 text-base leading-relaxed mb-6 font-medium">"{t('testimonials.' + tItem.commentKey, tItem.savings ? { amount: formatPrice(tItem.savings) } : undefined)}"</p>

                <div className="flex items-center gap-3 pt-5 border-t border-ink-100">
                  <img
                    src={tItem.image}
                    alt={tItem.name}
                    className="w-11 h-11 rounded-full ring-2 ring-primary-200 group-hover:ring-primary-500 transition-all"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-ink-900 truncate">{tItem.name}</div>
                    <div className="text-xs text-ink-500">{t('testimonials.' + tItem.roleKey)}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(tItem.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 text-accent-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="relative py-24 bg-[#fafaf7]" data-testid="final-cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[40px] bg-ink-950 text-white p-10 sm:p-16 overflow-hidden">
            <div className="absolute inset-0 dot-grid-light opacity-30" />
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-500 rounded-full blur-[120px] opacity-40 animate-float" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary-500 rounded-full blur-[120px] opacity-30 animate-float-delay" />

            <div className="relative grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-5">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-primary-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full w-2 h-2 bg-primary-500" />
                  </span>
                  {t('cta.specialOffer')}
                </div>
                <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl leading-[0.95] tracking-tight">
                  {t('cta.readyToHit')}
                  <br />
                  <em className="not-italic text-gradient-sunset">{t('cta.theRoad')}</em>
                </h2>
                <p className="text-white/75 text-lg mt-5 max-w-xl">
                  {t('cta.subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Link
                    to="/vehicles"
                    data-testid="cta-browse-vehicles-btn"
                    className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-primary-500 text-white rounded-full font-bold magnetic shine"
                  >
                    {t('cta.browseVehicles')}
                    <span className="w-7 h-7 bg-white text-primary-600 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
                      <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
                    </span>
                  </Link>
                  <Link
                    to="/vendor"
                    data-testid="cta-become-vendor-btn"
                    className="inline-flex items-center justify-center px-7 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold hover:bg-white/20 transition-all"
                  >
                    {t('common:footer.services.becomeVendor')}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-x-7 gap-y-3 mt-8 text-sm">
                  {[
                    { icon: Star, labelKey: 'rated' },
                    { icon: ShieldCheck, labelKey: 'freeCancellation' },
                    { icon: Headset, labelKey: 'support247' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center gap-2 text-white/85">
                        <Icon className="w-4 h-4 text-primary-400" />
                        <span>{t('cta.' + item.labelKey)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 hidden lg:block">
                <div className="relative rotate-3">
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/40 to-secondary-500/40 rounded-3xl blur-2xl" />
                  <div className="relative rounded-3xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=700&fit=crop"
                      alt="Car"
                      className="w-full h-[420px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" strokeWidth={2.5} fill="currentColor" />
                      </div>
                      <div className="text-ink-900">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-ink-500">{t('cta.startingAt')}</div>
                        <div className="font-display text-xl font-bold">{formatPrice(299)} <span className="text-xs font-normal text-ink-500">/ day</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
