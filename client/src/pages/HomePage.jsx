import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../i18n/format';
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
  Clock3,
  Headset,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.vehiclesFeatured);
        const data = await response.json();
        if (data.status === 'success') setFeaturedVehicles(data.data.vehicles || []);
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchFeaturedVehicles();
  }, []);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.publishedPosts);
        const data = await res.json();
        if (data.status === 'success') setBlogPosts(data.data.posts || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      }
    };
    fetchBlogPosts();
  }, []);

  const filteredVehicles = useMemo(() => {
    if (activeCategory === 'all') return featuredVehicles.slice(0, 6);
    return featuredVehicles.filter((vehicle) => vehicle.type === activeCategory).slice(0, 6);
  }, [activeCategory, featuredVehicles]);

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (pickupDate) params.set('pickup', pickupDate);
    if (returnDate) params.set('return', returnDate);
    navigate(`/vehicles${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const categoryCards = [
    { key: 'cityCars', type: 'car', image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=900&h=900&fit=crop' },
    { key: 'suvs', type: 'car', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=900&fit=crop' },
    { key: 'commuterBikes', type: 'bike', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&h=900&fit=crop' },
    { key: 'sportsBikes', type: 'bike', image: 'https://images.unsplash.com/photo-1558980664-10e7170e99f8?w=900&h=900&fit=crop' },
  ];

  const categoryCounts = { cityCars: '5+', suvs: '3+', commuterBikes: '5+', sportsBikes: '3+' };

  const stats = [
    { value: '1000+', label: t('home.stats.happyRiders'), icon: Users },
    { value: '15+', label: t('home.stats.vehicles'), icon: Car },
    { value: '3+', label: t('home.stats.citiesLive'), icon: MapPin },
    { value: '4.9', label: t('home.stats.starRating'), icon: Star },
  ];

  const benefits = [
    { icon: Zap, title: t('home.features.instantBooking.title'), description: t('home.features.instantBooking.description') },
    { icon: Wallet, title: t('home.features.payPerUse.title'), description: t('home.features.payPerUse.description') },
    { icon: ShieldCheck, title: t('home.features.verifiedInsured.title'), description: t('home.features.verifiedInsured.description') },
    { icon: Headset, title: t('home.features.roadside.title'), description: t('home.features.roadside.description') },
  ];

  const steps = [
    { number: '01', icon: Search, title: t('home.howItWorks.discover.title'), description: t('home.howItWorks.discover.description') },
    { number: '02', icon: CalendarDays, title: t('home.howItWorks.book.title'), description: t('home.howItWorks.book.description') },
    { number: '03', icon: KeyRound, title: t('home.howItWorks.ride.title'), description: t('home.howItWorks.ride.description') },
  ];

  const testimonials = [
    { name: 'محمد العتيبي', role: t('home.testimonials.weekendRoadTripper'), text: t('home.testimonials.comment1', { amount: '200 ر.س' }), rating: 5 },
    { name: 'نورة الدوسري', role: t('home.testimonials.cityCommuter'), text: t('home.testimonials.comment2'), rating: 5 },
    { name: 'خالد القحطاني', role: t('home.testimonials.frequentTraveler'), text: t('home.testimonials.comment3'), rating: 5 },
  ];

  const filterTabs = [['all', t('home.categories.badge')], ['car', t('home.categories.cityCars')], ['bike', t('home.categories.commuterBikes')]];

  return (
    <div className="alrafgha-home" dir="rtl">
      {/* HERO */}
      <section className="home-hero" data-testid="hero-section">
        <div className="home-hero__glow home-hero__glow--one" />
        <div className="home-hero__glow home-hero__glow--two" />
        <div className="home-shell home-hero__content">
          <div className="home-hero__copy">
            <span className="home-kicker"><span className="home-kicker__dot" /> {t('home.hero.subtext').split('.')[0]}.</span>
            <h1>{t('home.hero.headline1')} <span>{t('home.hero.headlineTap')}</span> {t('home.hero.headline2')}</h1>
            <p>{t('home.hero.subtext')}</p>
            <div className="home-hero__actions">
              <Link to="/vehicles" className="home-btn home-btn--primary">{t('home.hero.allVehicles')} <ArrowLeft size={17} /></Link>
              <Link to="/pricing" className="home-btn home-btn--ghost">{t('home.hero.seePricing')}</Link>
            </div>
          </div>

          <div className="home-hero__visual">
            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1500&h=1000&fit=crop" alt={t('home.hero.allVehicles')} />
            <div className="home-hero__shade" />
            <div className="home-hero__floating home-hero__floating--top">
              <ShieldCheck size={18} />
              <div><strong>{t('home.hero.verified')}</strong><span>{t('home.features.verifiedInsured.description').split('.')[0]}</span></div>
            </div>
            <div className="home-hero__floating home-hero__floating--bottom">
              <span className="home-live-dot" /> {t('home.hero.pillSuffix')}
            </div>
          </div>
        </div>

        <div className="home-search-wrap home-shell">
          <form className="home-search" onSubmit={submitSearch}>
            <div className="home-search__field home-search__field--location">
              <MapPin size={19} />
              <label>{t('home.howItWorks.book.title')}<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('home.howItWorks.book.description').split('.')[0]} /></label>
            </div>
            <div className="home-search__field">
              <CalendarDays size={19} />
              <label>{t('home.howItWorks.book.title')}<input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} /></label>
            </div>
            <div className="home-search__field">
              <CalendarDays size={19} />
              <label>{t('home.howItWorks.book.title')}<input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></label>
            </div>
            <button className="home-search__submit" type="submit"><Search size={19} /> {t('home.hero.allVehicles')}</button>
          </form>
        </div>

        <div className="home-shell home-stats">
          {stats.map(({ value, label, icon: Icon }) => (
            <div className="home-stat" key={label}><Icon size={19} /><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="home-section home-section--soft" data-testid="categories-section">
        <div className="home-shell">
          <div className="home-section-head">
            <div><span className="home-overline">{t('home.categories.badge')}</span><h2>{t('home.categories.pickYour')} <span>{t('home.categories.vibe')}</span></h2></div>
            <p>{t('home.categories.subtitle')}</p>
          </div>
          <div className="home-category-grid">
            {categoryCards.map((category) => (
              <Link key={category.key} to={`/vehicles?type=${category.type}`} className="home-category-card">
                <img src={category.image} alt={t(`home.categories.${category.key}`)} />
                <div className="home-category-card__overlay" />
                <div className="home-category-card__top"><span>{category.type === 'car' ? <Car size={13} /> : <Bike size={13} />}</span><span>{categoryCounts[category.key]} {t('home.stats.vehicles')}</span></div>
                <div className="home-category-card__bottom"><h3>{t(`home.categories.${category.key}`)}</h3><span>{t('home.categories.options', { count: categoryCounts[category.key] })}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="home-section" data-testid="featured-vehicles-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--compact">
            <div><span className="home-overline">{t('home.featured.editorsPick')}</span><h2>{t('home.featured.featuredRides')}</h2></div>
            <Link to="/vehicles" className="home-text-link">{t('home.featured.viewAll')} <ArrowLeft size={16} /></Link>
          </div>
          <div className="home-filter-pills" role="tablist" aria-label={t('home.categories.badge')}>
            {filterTabs.map(([key, label]) => (
              <button key={key} className={activeCategory === key ? 'is-active' : ''} onClick={() => setActiveCategory(key)}>{label}</button>
            ))}
          </div>
          {loadingVehicles ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><VehicleCardSkeleton /><VehicleCardSkeleton /><VehicleCardSkeleton /></div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{filteredVehicles.map((vehicle) => <VehicleCard key={vehicle._id} vehicle={vehicle} />)}</div>
          ) : (
            <div className="home-empty">{t('home.featured.noVehicles')} <Link to="/vehicles">{t('home.featured.viewAllVehicles')}</Link></div>
          )}
        </div>
      </section>

      {/* OWNER CTA */}
      <section className="home-owner-cta">
        <div className="home-owner-cta__image"><img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1300&h=800&fit=crop" alt={t('home.cta.browseVehicles')} /></div>
        <div className="home-owner-cta__content home-shell">
          <div><span className="home-overline home-overline--light">{t('home.cta.specialOffer')}</span><h2>{t('home.cta.readyToHit')} <span>{t('home.cta.theRoad')}</span></h2><p>{t('home.cta.subtitle')}</p></div>
          <Link to="/vendor" className="home-btn home-btn--primary">{t('home.cta.browseVehicles')} <ArrowUpLeft size={17} /></Link>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="home-section home-section--soft" data-testid="features-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--center"><div><span className="home-overline">{t('home.features.badge')}</span><h2>{t('home.features.title1')} <span>{t('home.features.freedom')}</span> {t('home.features.title2')} <span>{t('home.features.honesty')}</span></h2></div><p>{t('home.features.subtitle')}</p></div>
          <div className="home-benefits-grid">
            {benefits.map(({ icon: Icon, title, description }) => <div className="home-benefit" key={title}><div className="home-benefit__icon"><Icon size={21} /></div><h3>{title}</h3><p>{description}</p></div>)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-process" data-testid="how-it-works-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--light"><div><span className="home-overline home-overline--light">{t('home.howItWorks.badge')}</span><h2>{t('home.howItWorks.title')} <span>{t('home.howItWorks.openRoad')}</span></h2></div><p>{t('home.howItWorks.discover.description')}</p></div>
          <div className="home-steps">
            {steps.map(({ number, icon: Icon, title, description }) => <div className="home-step" key={number}><span className="home-step__number">{number}</span><div className="home-step__icon"><Icon size={21} /></div><h3>{title}</h3><p>{description}</p></div>)}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="home-section" data-testid="experience-section">
        <div className="home-shell home-experience">
          <div className="home-experience__photo"><img src="https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1000&h=1200&fit=crop" alt={t('home.experience.premiumBadge')} /><div className="home-experience__badge"><Check size={15} /> {t('home.experience.premiumBadge')}</div></div>
          <div className="home-experience__copy"><span className="home-overline">{t('home.experience.title1')}</span><h2>{t('home.experience.titleEm')}</h2><p>{t('home.experience.subtitle')}</p><div className="home-experience__list"><div><Clock3 size={19} /><span><strong>{t('home.experience.item1Title')}</strong> {t('home.experience.item1Desc')}</span></div><div><ShieldCheck size={19} /><span><strong>{t('home.experience.item2Title')}</strong> {t('home.experience.item2Desc')}</span></div><div><Headset size={19} /><span><strong>{t('home.experience.item3Title')}</strong> {t('home.experience.item3Desc')}</span></div></div><Link to="/vehicles" className="home-btn home-btn--primary">{t('home.experience.startJourney')} <ArrowLeft size={17} /></Link></div>
        </div>
      </section>

      {/* ARTICLES */}
      {blogPosts.length > 0 && (
        <section className="home-section home-section--soft">
          <div className="home-shell">
            <div className="home-section-head home-section-head--compact"><div><span className="home-overline">{t('nav.blog')}</span><h2>{t('home.featured.featuredRides')}</h2></div><Link to="/blog" className="home-text-link">{t('home.featured.viewAll')} <ArrowLeft size={16} /></Link></div>
            <div className="home-articles">{blogPosts.map((post) => <Link to={`/blog/${post.slug}`} className="home-article" key={post._id}><div className="home-article__image"><img src={post.featured_image || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&h=600&fit=crop'} alt={post.title} /><span>{post.category}</span></div><div className="home-article__body"><h3>{post.title}</h3><p>{post.excerpt || t('home.features.subtitle')}</p><span>{t('home.experience.startJourney')} <ArrowLeft size={15} /></span></div></Link>)}</div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="home-section" data-testid="testimonials-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--center"><div><span className="home-overline">{t('home.testimonials.badge')}</span><h2>{t('home.testimonials.title')} <span>{t('home.testimonials.titleEm')}</span></h2></div></div>
          <div className="home-testimonials">{testimonials.map((item) => <article className="home-testimonial" key={item.name}><div className="home-testimonial__quote">"</div><div className="home-testimonial__stars">{Array.from({ length: item.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div><p>{item.text}</p><div className="home-testimonial__person"><div>{item.name.charAt(0)}</div><span><strong>{item.name}</strong><small>{item.role}</small></span></div></article>)}</div>
        </div>
      </section>

      {/* APP / FINAL CTA */}
      <section className="home-app-cta">
        <div className="home-shell home-app-cta__inner"><div className="home-app-cta__phone"><div className="home-phone-notch" /><img src="/arafgha-logo.png" alt="Alrafgha Group" /></div><div><span className="home-overline home-overline--light">{t('home.cta.specialOffer')}</span><h2>{t('home.cta.readyToHit')} <span>{t('home.cta.theRoad')}</span></h2><p>{t('home.cta.subtitle')}</p><div className="home-app-buttons"><span><small>App Store</small><strong>App Store</strong></span><span><small>Google Play</small><strong>Google Play</strong></span></div></div></div>
      </section>

      <section className="home-newsletter">
        <div className="home-shell home-newsletter__inner"><div><span className="home-overline">{t('home.stats.trustedBy')}</span><h2>{t('home.cta.readyToHit')} <span>{t('home.cta.theRoad')}</span></h2></div><form onSubmit={(e) => e.preventDefault()}><input type="email" placeholder={t('home.hero.subtext').split('.')[0]} aria-label={t('home.hero.subtext').split('.')[0]} /><button type="submit">{t('actions.next')} <ArrowLeft size={15} /></button></form></div>
      </section>
    </div>
  );
};

export default HomePage;
