import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VehicleCard from '../components/VehicleCard';
import VehicleCardSkeleton from '../components/VehicleCardSkeleton';
import { API_ENDPOINTS } from '../config/api';
import {
  ArrowLeft,
  ArrowUpLeft,
  Bike,
  CalendarDays,
  Car,
  Check,
  Headset,
  KeyRound,
  MapPin,
  Play,
  Search,
  ShieldCheck,
  Star,
  Wallet,
  Zap,
} from 'lucide-react';

const getSettingValue = (settings, keys) => {
  for (const key of keys) {
    const value = settings?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (value && typeof value === 'object' && typeof value.url === 'string' && value.url.trim()) {
      return value.url.trim();
    }
  }
  return '';
};

const useReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const nodes = root.querySelectorAll('[data-reveal]');
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px' }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return ref;
};

const HomePage = () => {
  const { t } = useTranslation('home');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const pageRef = useReveal();

  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadHomeData = async () => {
      try {
        const [featuredResponse, vehiclesResponse, postsResponse, settingsResponse] = await Promise.all([
          fetch(API_ENDPOINTS.vehiclesFeatured),
          fetch(API_ENDPOINTS.vehicles),
          fetch(API_ENDPOINTS.publishedPosts),
          fetch(API_ENDPOINTS.settings),
        ]);

        const [featured, vehicles, posts, siteSettings] = await Promise.all([
          featuredResponse.json(),
          vehiclesResponse.json(),
          postsResponse.json(),
          settingsResponse.json(),
        ]);

        if (cancelled) return;

        if (featured.status === 'success') setFeaturedVehicles(featured.data?.vehicles || []);
        if (vehicles.status === 'success') setAllVehicles(vehicles.data?.vehicles || []);
        if (posts.status === 'success') setBlogPosts(posts.data?.posts || []);
        if (siteSettings.status === 'success') setSettings(siteSettings.data?.settings || {});
      } catch (error) {
        console.error('Home data loading failed:', error);
      } finally {
        if (!cancelled) setLoadingVehicles(false);
      }
    };

    loadHomeData();
    return () => { cancelled = true; };
  }, []);

  const filteredVehicles = useMemo(() => {
    if (activeCategory === 'all') return featuredVehicles.slice(0, 6);
    return featuredVehicles.filter((vehicle) => vehicle.type === activeCategory).slice(0, 6);
  }, [activeCategory, featuredVehicles]);

  const typeCounts = useMemo(() => ({
    car: allVehicles.filter((vehicle) => vehicle.type === 'car').length,
    bike: allVehicles.filter((vehicle) => vehicle.type === 'bike').length,
  }), [allVehicles]);

  const cityCount = useMemo(() => new Set(allVehicles.map((vehicle) => vehicle.location).filter(Boolean)).size, [allVehicles]);
  const availableCount = useMemo(() => allVehicles.filter((vehicle) => vehicle.availability_status === 'available').length, [allVehicles]);

  const dynamicCollections = useMemo(() => {
    const map = new Map();
    allVehicles.forEach((vehicle) => {
      const key = `${vehicle.brand || ''}-${vehicle.type || ''}`;
      if (!map.has(key)) map.set(key, { brand: vehicle.brand, type: vehicle.type, count: 0, image: vehicle.images?.[0] || '' });
      const item = map.get(key);
      item.count += 1;
      if (!item.image && vehicle.images?.[0]) item.image = vehicle.images[0];
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 4);
  }, [allVehicles]);

  const heroVideoUrl = getSettingValue(settings, ['home_hero_video', 'hero_video_url', 'heroVideoUrl']);
  const heroPoster = getSettingValue(settings, ['home_hero_poster', 'hero_poster_url', 'heroPosterUrl']) || featuredVehicles[0]?.images?.[0] || allVehicles[0]?.images?.[0] || '';
  const secondaryImage = featuredVehicles[1]?.images?.[0] || featuredVehicles[0]?.images?.[0] || allVehicles[1]?.images?.[0] || '';

  const stats = [
    { value: allVehicles.length, label: t('stats.vehicles'), icon: Car },
    { value: availableCount, label: t('stats.availableNow'), icon: Check },
    { value: cityCount, label: t('stats.citiesLive'), icon: MapPin },
    { value: featuredVehicles.length, label: t('featured.editorsPick'), icon: Star },
  ];

  const benefits = [
    { icon: Zap, title: t('features.instantBooking.title'), description: t('features.instantBooking.description') },
    { icon: Wallet, title: t('features.payPerUse.title'), description: t('features.payPerUse.description') },
    { icon: ShieldCheck, title: t('features.verifiedInsured.title'), description: t('features.verifiedInsured.description') },
    { icon: Headset, title: t('features.roadside.title'), description: t('features.roadside.description') },
  ];

  const steps = [
    { number: '01', icon: Search, title: t('howItWorks.discover.title'), description: t('howItWorks.discover.description') },
    { number: '02', icon: CalendarDays, title: t('howItWorks.book.title'), description: t('howItWorks.book.description') },
    { number: '03', icon: KeyRound, title: t('howItWorks.ride.title'), description: t('howItWorks.ride.description') },
  ];

  const filterTabs = [
    ['all', t('featured.all')],
    ['car', t('categories.cityCars')],
    ['bike', t('categories.commuterBikes')],
  ];

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (pickupDate) params.set('pickup', pickupDate);
    if (returnDate) params.set('return', returnDate);
    navigate(`/vehicles${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="alrafgha-home" dir="rtl" ref={pageRef}>
      <section className="home-hero home-hero--cinematic" data-testid="hero-section">
        <div className="home-hero__grain" />
        <div className="home-hero__glow home-hero__glow--one" />
        <div className="home-hero__glow home-hero__glow--two" />

        <div className="home-shell home-hero__content">
          <div className="home-hero__copy" data-reveal="up">
            <span className="home-kicker"><span className="home-kicker__dot" /> {t('hero.pillLive')}</span>
            <h1 className="home-display-title">
              {t('hero.headline1')} <span>{t('hero.headlineTap')}</span><br />{t('hero.headline2')}
            </h1>
            <p>{t('hero.subtext')}</p>
            <div className="home-hero__actions">
              <Link to="/vehicles" className="home-btn home-btn--primary">{t('hero.allVehicles')} <ArrowLeft size={17} /></Link>
              <Link to="/pricing" className="home-btn home-btn--ghost">{t('hero.seePricing')}</Link>
            </div>
          </div>

          <div className="home-hero__visual" data-reveal="scale">
            {heroVideoUrl ? (
              <video
                className="home-hero__media"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={heroPoster || undefined}
                aria-label={t('hero.allVehicles')}
              >
                <source src={heroVideoUrl} />
              </video>
            ) : heroPoster ? (
              <img className="home-hero__media" src={heroPoster} alt={t('hero.allVehicles')} />
            ) : (
              <div className="home-hero__media home-hero__media--empty" aria-hidden="true" />
            )}
            <div className="home-hero__shade" />
            <div className="home-hero__scanline" />

            <div className="home-hero__floating home-hero__floating--top">
              <ShieldCheck size={18} />
              <div><strong>{t('hero.verified')}</strong><span>{t('features.verifiedInsured.description').split('—')[0]}</span></div>
            </div>

            {heroVideoUrl && (
              <div className="home-hero__video-badge"><Play size={13} fill="currentColor" /> {t('hero.cinematic')}</div>
            )}

            <div className="home-hero__floating home-hero__floating--bottom">
              <span className="home-live-dot" /> {t('hero.pillSuffix')} <b>{allVehicles.length || '—'}</b>
            </div>
          </div>
        </div>

        <div className="home-search-wrap home-shell" data-reveal="up">
          <form className="home-search" onSubmit={submitSearch}>
            <div className="home-search__field home-search__field--location">
              <MapPin size={19} />
              <label>{t('search.location')}<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('search.locationPlaceholder')} /></label>
            </div>
            <div className="home-search__field">
              <CalendarDays size={19} />
              <label>{t('search.pickup')}<input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} /></label>
            </div>
            <div className="home-search__field">
              <CalendarDays size={19} />
              <label>{t('search.return')}<input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></label>
            </div>
            <button className="home-search__submit" type="submit"><Search size={19} /> {t('search.submit')}</button>
          </form>
        </div>

        <div className="home-shell home-stats" data-reveal="up">
          {stats.map(({ value, label, icon: Icon }) => (
            <div className="home-stat" key={label}><Icon size={19} /><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      </section>

      <section className="home-section home-section--dark home-marquee-section" data-reveal="up">
        <div className="home-shell">
          <div className="home-section-head home-section-head--light home-section-head--compact">
            <div><span className="home-overline home-overline--light">{t('categories.badge')}</span><h2>{t('categories.pickYour')} <span>{t('categories.vibe')}</span></h2></div>
            <p>{t('categories.subtitle')}</p>
          </div>

          {dynamicCollections.length > 0 ? (
            <div className="home-category-grid">
              {dynamicCollections.map((collection, index) => (
                <Link
                  key={`${collection.brand}-${collection.type}`}
                  to={`/vehicles?type=${collection.type}`}
                  className="home-category-card"
                  data-reveal="up"
                  style={{ '--reveal-delay': `${index * 90}ms` }}
                >
                  {collection.image ? <img src={collection.image} alt={collection.brand} /> : <div className="home-category-card__empty" />}
                  <div className="home-category-card__overlay" />
                  <div className="home-category-card__top"><span>{collection.type === 'car' ? <Car size={13} /> : <Bike size={13} />}</span><span>{collection.count} {t('stats.vehicles')}</span></div>
                  <div className="home-category-card__bottom"><small>{collection.type === 'car' ? t('categories.cityCars') : t('categories.commuterBikes')}</small><h3>{collection.brand}</h3><span>{t('categories.exploreCollection')} <ArrowUpLeft size={13} /></span></div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="home-empty home-empty--dark">{t('categories.noData')}</div>
          )}
        </div>
      </section>

      <section className="home-section" data-testid="featured-vehicles-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--compact" data-reveal="up">
            <div><span className="home-overline">{t('featured.editorsPick')}</span><h2>{t('featured.featuredRides')}</h2><p>{t('featured.subtitle')}</p></div>
            <Link to="/vehicles" className="home-text-link">{t('featured.viewAll')} <ArrowLeft size={16} /></Link>
          </div>

          <div className="home-filter-pills" role="tablist" aria-label={t('categories.badge')} data-reveal="up">
            {filterTabs.map(([key, label]) => (
              <button key={key} className={activeCategory === key ? 'is-active' : ''} onClick={() => setActiveCategory(key)} role="tab" aria-selected={activeCategory === key}>{label}</button>
            ))}
          </div>

          {loadingVehicles ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><VehicleCardSkeleton /><VehicleCardSkeleton /><VehicleCardSkeleton /></div>
          ) : filteredVehicles.length > 0 ? (
            <div className="home-vehicle-grid">
              {filteredVehicles.map((vehicle, index) => <div key={vehicle._id} data-reveal="up" style={{ '--reveal-delay': `${index * 70}ms` }}><VehicleCard vehicle={vehicle} /></div>)}
            </div>
          ) : (
            <div className="home-empty">{t('featured.noVehicles')} <Link to="/vehicles">{t('featured.viewAllVehicles')}</Link></div>
          )}
        </div>
      </section>

      {secondaryImage && (
        <section className="home-owner-cta" data-reveal="scale">
          <div className="home-owner-cta__image"><img src={secondaryImage} alt={featuredVehicles[1]?.name || featuredVehicles[0]?.name || ''} /></div>
          <div className="home-owner-cta__content home-shell">
            <div data-reveal="right"><span className="home-overline home-overline--light">{t('cta.specialOffer')}</span><h2>{t('cta.readyToHit')} <span>{t('cta.theRoad')}</span></h2><p>{t('cta.subtitle')}</p></div>
            <Link to="/vehicles" className="home-btn home-btn--primary" data-reveal="left">{t('cta.browseVehicles')} <ArrowUpLeft size={17} /></Link>
          </div>
        </section>
      )}

      <section className="home-section home-section--soft" data-testid="features-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--center" data-reveal="up">
            <div><span className="home-overline">{t('features.badge')}</span><h2>{t('features.title1')} <span>{t('features.freedom')}</span> {t('features.title2')} <span>{t('features.honesty')}</span></h2></div>
            <p>{t('features.subtitle')}</p>
          </div>
          <div className="home-benefits-grid">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <div className="home-benefit" key={title} data-reveal="up" style={{ '--reveal-delay': `${index * 80}ms` }}><div className="home-benefit__icon"><Icon size={21} /></div><h3>{title}</h3><p>{description}</p><span className="home-benefit__line" /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-process" data-testid="how-it-works-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--light" data-reveal="up"><div><span className="home-overline home-overline--light">{t('howItWorks.badge')}</span><h2>{t('howItWorks.title')} <span>{t('howItWorks.openRoad')}</span></h2></div><p>{t('howItWorks.discover.description')}</p></div>
          <div className="home-steps">
            {steps.map(({ number, icon: Icon, title, description }, index) => (
              <div className="home-step" key={number} data-reveal="up" style={{ '--reveal-delay': `${index * 100}ms` }}><span className="home-step__number">{number}</span><div className="home-step__icon"><Icon size={21} /></div><h3>{title}</h3><p>{description}</p><span className="home-step__progress" /></div>
            ))}
          </div>
        </div>
      </section>

      {blogPosts.length > 0 && (
        <section className="home-section home-section--soft">
          <div className="home-shell">
            <div className="home-section-head home-section-head--compact" data-reveal="up"><div><span className="home-overline">{tCommon('nav.blog')}</span><h2>{t('blog.latest')}</h2></div><Link to="/blog" className="home-text-link">{t('featured.viewAll')} <ArrowLeft size={16} /></Link></div>
            <div className="home-articles">
              {blogPosts.slice(0, 3).map((post, index) => (
                <Link to={`/blog/${post.slug}`} className="home-article" key={post._id} data-reveal="up" style={{ '--reveal-delay': `${index * 90}ms` }}>
                  <div className="home-article__image">{post.featured_image ? <img src={post.featured_image} alt={post.title} /> : <div className="home-article__empty" />}<span>{post.category}</span></div>
                  <div className="home-article__body"><h3>{post.title}</h3><p>{post.excerpt || ''}</p><span>{t('blog.read')} <ArrowLeft size={15} /></span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-final-cta" data-reveal="up">
        <div className="home-shell home-final-cta__inner">
          <div><span className="home-overline home-overline--light">{allVehicles.length ? `${allVehicles.length} ${t('stats.vehicles')}` : t('cta.specialOffer')}</span><h2>{t('cta.readyToHit')} <span>{t('cta.theRoad')}</span></h2><p>{t('cta.subtitle')}</p></div>
          <div className="home-final-cta__actions"><Link to="/vehicles" className="home-btn home-btn--primary">{t('cta.browseVehicles')} <ArrowLeft size={17} /></Link><Link to="/about" className="home-btn home-btn--dark-ghost">{tCommon('nav.about')} <ArrowLeft size={17} /></Link></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
