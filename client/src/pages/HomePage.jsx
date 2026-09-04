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
  Search,
  ShieldCheck,
  Star,
  Wallet,
  Zap,
} from 'lucide-react';

const getSettingValue = (settings, keys) => {
  for (const key of keys) {
    const v = settings?.[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (v && typeof v === 'object' && typeof v.url === 'string' && v.url.trim()) return v.url.trim();
  }
  return '';
};

export default function HomePage() {
  const { t } = useTranslation('home');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const rootRef = useRef(null);

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
    (async () => {
      try {
        const [fr, vr, pr, sr] = await Promise.all([
          fetch(API_ENDPOINTS.vehiclesFeatured),
          fetch(API_ENDPOINTS.vehicles),
          fetch(API_ENDPOINTS.publishedPosts),
          fetch(API_ENDPOINTS.settings),
        ]);
        const [f, v, p, s] = await Promise.all([fr.json(), vr.json(), pr.json(), sr.json()]);
        if (cancelled) return;
        if (f.status === 'success') setFeaturedVehicles(f.data?.vehicles || []);
        if (v.status === 'success') setAllVehicles(v.data?.vehicles || []);
        if (p.status === 'success') setBlogPosts(p.data?.posts || []);
        if (s.status === 'success') setSettings(s.data?.settings || {});
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoadingVehicles(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // single IntersectionObserver for the whole page — no per-section observers
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loadingVehicles]);

  const filteredVehicles = useMemo(() => {
    if (activeCategory === 'all') return featuredVehicles.slice(0, 6);
    return featuredVehicles.filter((v) => v.type === activeCategory).slice(0, 6);
  }, [activeCategory, featuredVehicles]);

  const heroImage = useMemo(() => {
    const poster = getSettingValue(settings, ['home_hero_poster', 'hero_poster_url', 'heroPosterUrl']);
    if (poster) return poster;
    // prefer a car, fall back to first vehicle
    return (featuredVehicles.find(v => v.type === 'car')?.images?.[0]) || featuredVehicles[0]?.images?.[0] || allVehicles[0]?.images?.[0] || '';
  }, [settings, featuredVehicles, allVehicles]);

  const editorialImage = useMemo(() => {
    // second distinct image for the Saudi presence / owner CTA strip
    const pool = [...featuredVehicles, ...allVehicles];
    const first = heroImage;
    const second = pool.find(v => v.images?.[0] && v.images[0] !== first)?.images?.[0];
    return second || first || '';
  }, [featuredVehicles, allVehicles, heroImage]);

  const brands = useMemo(() => {
    const m = new Map();
    allVehicles.forEach((v) => {
      const k = `${v.brand}__${v.type}`;
      if (!m.has(k)) m.set(k, { brand: v.brand, type: v.type, count: 0, image: v.images?.[0] || '' });
      const it = m.get(k); it.count += 1; if (!it.image && v.images?.[0]) it.image = v.images[0];
    });
    return Array.from(m.values()).sort((a, b) => b.count - a.count).slice(0, 4);
  }, [allVehicles]);

  const submitSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (location.trim()) p.set('location', location.trim());
    if (pickupDate) p.set('pickup', pickupDate);
    if (returnDate) p.set('return', returnDate);
    navigate(`/vehicles${p.toString() ? `?${p.toString()}` : ''}`);
  };

  return (
    <div className="alrafgha-home" ref={rootRef}>
      {/* ── HERO — asymmetric editorial, not a template ── */}
      <section className="lh-hero" data-testid="hero-section">
        <div className="lh-shell lh-hero__grid">
          {/* Copy — left, editorial */}
          <div className="lh-hero__copy" data-reveal="up">
            <p className="lh-eyebrow"><span className="lh-dot" aria-hidden="true" />{t('hero.pillLive')} — {t('hero.pillMiddle') || t('hero.pillSuffix')}</p>
            <h1 className="lh-title">
              <span className="lh-title__line">{t('hero.headline1')}</span>
              <span className="lh-title__line lh-title__line--accent">{t('hero.headlineTap')}</span>
              <span className="lh-title__line">{t('hero.headline2')}</span>
            </h1>
            <p className="lh-sub">{t('hero.subtext')}</p>
            <div className="lh-actions">
              <Link to="/vehicles" className="lh-btn lh-btn--solid">{t('hero.allVehicles')} <ArrowUpLeft size={14} strokeWidth={2.5} /></Link>
              <Link to="/pricing" className="lh-btn lh-btn--line">{t('hero.seePricing')}</Link>
            </div>
            {/* Trust row — inline, not card grid */}
            <div className="lh-trust" aria-label="Trust indicators">
              <span className="lh-trust__item"><ShieldCheck size={13} />{t('features.verifiedInsured.title')}</span>
              <span className="lh-trust__sep" aria-hidden="true">·</span>
              <span className="lh-trust__item"><MapPin size={13} />Riyadh · Jeddah · Dammam</span>
              <span className="lh-trust__sep" aria-hidden="true">·</span>
              <span className="lh-trust__item">{allVehicles.length ? `${allVehicles.length} ${t('stats.vehicles')}` : t('hero.pillLive')}</span>
            </div>
          </div>

          {/* Visual — right, single strong image with docked utility card */}
          <div className="lh-hero__visual" data-reveal="scale">
            {heroImage ? <img className="lh-hero__img" src={heroImage} alt="" /> : <div className="lh-hero__img lh-hero__img--empty" aria-hidden="true" />}
            <div className="lh-hero__vignette" aria-hidden="true" />
            {/* Utility dock — search, attached to image bottom, not floating */}
            <form className="lh-dock" onSubmit={submitSearch} aria-label={t('search.submit')}>
              <label className="lh-dock__field">
                <span className="lh-dock__label"><MapPin size={12} />{t('search.location')}</span>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('search.locationPlaceholder')} />
              </label>
              <span className="lh-dock__div" aria-hidden="true" />
              <label className="lh-dock__field">
                <span className="lh-dock__label"><CalendarDays size={12} />{t('search.pickup')}</span>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
              </label>
              <span className="lh-dock__div" aria-hidden="true" />
              <label className="lh-dock__field">
                <span className="lh-dock__label"><CalendarDays size={12} />{t('search.return')}</span>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
              </label>
              <button className="lh-dock__go" type="submit" aria-label={t('search.submit')}><Search size={16} /></button>
            </form>
          </div>
        </div>

        {/* Thin proof line — not a stats grid */}
        <div className="lh-shell lh-proof" data-reveal="up" style={{ '--reveal-delay': '80ms' }}>
          <span>{allVehicles.length} {t('stats.vehicles')} — {t('stats.availableNow')} {allVehicles.filter(v=>v.availability_status==='available').length} — {new Set(allVehicles.map(v=>v.location).filter(Boolean)).size} {t('stats.citiesLive')} — SAR {t('pricing:perDay') || 'per day pricing'}</span>
          <Link to="/vehicles" className="lh-proof__link">{t('featured.viewAll')} <ArrowLeft size={12} /></Link>
        </div>
      </section>

      {/* ── COLLECTIONS — 2 large editorial blocks, not 4 uniform cards ── */}
      {brands.length > 0 && (
        <section className="lh-section lh-section--paper" data-reveal="up">
          <div className="lh-shell">
            <div className="lh-head lh-head--split">
              <div>
                <p className="lh-kicker">{t('categories.badge')}</p>
                <h2 className="lh-h2">{t('categories.pickYour')} <em>{t('categories.vibe')}</em></h2>
              </div>
              <p className="lh-lead">{t('categories.subtitle')}</p>
            </div>
            <div className="lh-collections">
              {brands.slice(0, 2).map((c) => (
                <Link key={`${c.brand}-${c.type}`} to={`/vehicles?type=${c.type}`} className="lh-collection lh-collection--large">
                  {c.image ? <img src={c.image} alt={c.brand} loading="lazy" /> : <div className="lh-collection__empty" />}
                  <div className="lh-collection__scrim" />
                  <div className="lh-collection__meta">
                    <span className="lh-collection__type">{c.type === 'car' ? t('categories.cityCars') : t('categories.commuterBikes')}</span>
                    <h3>{c.brand}</h3>
                    <span className="lh-collection__count">{c.count} {t('stats.vehicles')} — {t('categories.exploreCollection')} <ArrowUpLeft size={11} /></span>
                  </div>
                </Link>
              ))}
            </div>
            {brands.length > 2 && (
              <div className="lh-collections lh-collections--small">
                {brands.slice(2, 4).map((c) => (
                  <Link key={`${c.brand}-${c.type}-sm`} to={`/vehicles?type=${c.type}`} className="lh-collection lh-collection--sm">
                    {c.image ? <img src={c.image} alt={c.brand} loading="lazy" /> : <div className="lh-collection__empty" />}
                    <div className="lh-collection__scrim" />
                    <div className="lh-collection__meta"><span className="lh-collection__type">{c.type === 'car' ? 'City' : 'Commute'}</span><h3>{c.brand}</h3></div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FEATURED — horizontal editorial strip with sticky label ── */}
      <section className="lh-section lh-section--ink" data-testid="featured-vehicles-section">
        <div className="lh-shell">
          <div className="lh-head lh-head--inline">
            <div>
              <p className="lh-kicker lh-kicker--gold">{t('featured.editorsPick')}</p>
              <h2 className="lh-h2 lh-h2--light">{t('featured.featuredRides')}</h2>
            </div>
            <div className="lh-head__actions">
              <div className="lh-pills" role="tablist" aria-label={t('categories.badge')}>
                {[
                  ['all', t('featured.all')],
                  ['car', t('categories.cityCars')],
                  ['bike', t('categories.commuterBikes')],
                ].map(([k, label]) => (
                  <button key={k} className={activeCategory === k ? 'is-active' : ''} onClick={() => setActiveCategory(k)} role="tab" aria-selected={activeCategory === k}>{label}</button>
                ))}
              </div>
              <Link to="/vehicles" className="lh-link lh-link--light">{t('featured.viewAll')} <ArrowLeft size={13} /></Link>
            </div>
          </div>
          <p className="lh-lead lh-lead--muted" style={{ marginTop: -12, marginBottom: 22 }}>{t('featured.subtitle')}</p>

          {loadingVehicles ? (
            <div className="lh-skeleton-grid"><VehicleCardSkeleton /><VehicleCardSkeleton /><VehicleCardSkeleton /></div>
          ) : filteredVehicles.length > 0 ? (
            <div className="lh-fleet">
              {filteredVehicles.map((v) => (
                <div key={v._id} className="lh-fleet__item"><VehicleCard vehicle={v} /></div>
              ))}
            </div>
          ) : (
            <div className="lh-empty lh-empty--dark">{t('featured.noVehicles')} <Link to="/vehicles">{t('featured.viewAllVehicles')}</Link></div>
          )}
        </div>
      </section>

      {/* ── SAUDI PRESENCE — full-bleed image + text inset, not a CTA card ── */}
      {editorialImage && (
        <section className="lh-presence">
          <img src={editorialImage} alt="" aria-hidden="true" loading="lazy" />
          <div className="lh-presence__wash" aria-hidden="true" />
          <div className="lh-shell lh-presence__inner">
            <div className="lh-presence__copy" data-reveal="up">
              <p className="lh-kicker lh-kicker--gold">— {t('cta.specialOffer')}</p>
              <h2>{t('cta.readyToHit')} <em>{t('cta.theRoad')}</em></h2>
              <p>{t('cta.subtitle')}</p>
              <div className="lh-actions" style={{ marginTop: 18 }}>
                <Link to="/vehicles" className="lh-btn lh-btn--solid lh-btn--small">{t('cta.browseVehicles')} <ArrowUpLeft size={13} /></Link>
                <Link to="/about" className="lh-btn lh-btn--ghost lh-btn--ghost-light">{tCommon('nav.about')}</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US — ruled editorial list, not 4 cards ── */}
      <section className="lh-section lh-section--paper lh-why" data-testid="features-section">
        <div className="lh-shell lh-why__grid">
          <div data-reveal="up">
            <p className="lh-kicker">{t('features.badge')}</p>
            <h2 className="lh-h2">{t('features.title1')} <em>{t('features.freedom')}</em> {t('features.title2')} <em>{t('features.honesty')}</em></h2>
            <p className="lh-lead" style={{ marginTop: 12 }}>{t('features.subtitle')}</p>
          </div>
          <ol className="lh-why__list" data-reveal="up" style={{ '--reveal-delay': '80ms' }}>
            {[
              { icon: Zap, title: t('features.instantBooking.title'), desc: t('features.instantBooking.description') },
              { icon: Wallet, title: t('features.payPerUse.title'), desc: t('features.payPerUse.description') },
              { icon: ShieldCheck, title: t('features.verifiedInsured.title'), desc: t('features.verifiedInsured.description') },
              { icon: Headset, title: t('features.roadside.title'), desc: t('features.roadside.description') },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <li key={b.title} className="lh-why__item">
                  <span className="lh-why__num" aria-hidden="true">0{i + 1}</span>
                  <span className="lh-why__icon"><Icon size={16} /></span>
                  <div><h3>{b.title}</h3><p>{b.desc}</p></div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── HOW IT WORKS — timeline, not 3 cards ── */}
      <section className="lh-how" data-testid="how-it-works-section">
        <div className="lh-shell">
          <div className="lh-head">
            <div><p className="lh-kicker lh-kicker--gold">{t('howItWorks.badge')}</p><h2 className="lh-h2 lh-h2--light">{t('howItWorks.title')} <em>{t('howItWorks.openRoad')}</em></h2></div>
            <p className="lh-lead lh-lead--muted" style={{ maxWidth: 360 }}>{t('howItWorks.discover.description')}</p>
          </div>
          <ol className="lh-timeline">
            {[
              { n: '01', icon: Search, title: t('howItWorks.discover.title'), desc: t('howItWorks.discover.description') },
              { n: '02', icon: CalendarDays, title: t('howItWorks.book.title'), desc: t('howItWorks.book.description') },
              { n: '03', icon: KeyRound, title: t('howItWorks.ride.title'), desc: t('howItWorks.ride.description') },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.n} className="lh-timeline__step">
                  <span className="lh-timeline__n">{s.n}</span>
                  <span className="lh-timeline__icon"><Icon size={16} /></span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── JOURNAL — minimal, metadata-rich ── */}
      {blogPosts.length > 0 && (
        <section className="lh-section lh-section--paper">
          <div className="lh-shell">
            <div className="lh-head lh-head--inline">
              <div><p className="lh-kicker">{tCommon('nav.blog')}</p><h2 className="lh-h2">{t('blog.latest')}</h2></div>
              <Link to="/blog" className="lh-link">{t('featured.viewAll')} <ArrowLeft size={13} /></Link>
            </div>
            <div className="lh-journal">
              {blogPosts.slice(0, 3).map((post) => (
                <Link to={`/blog/${post.slug}`} key={post._id} className="lh-journal__item">
                  <div className="lh-journal__img">{post.featured_image ? <img src={post.featured_image} alt="" loading="lazy" /> : <div className="lh-journal__empty" />}</div>
                  <span className="lh-journal__cat">{post.category || tCommon('nav.blog')}</span>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  <span className="lh-journal__more">{t('blog.read')} <ArrowLeft size={11} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CLOSING — quiet, no gradient blob ── */}
      <section className="lh-close">
        <div className="lh-shell lh-close__inner">
          <div>
            <p className="lh-kicker lh-kicker--gold">{t('cta.specialOffer')}</p>
            <h2>{t('cta.readyToHit')} <em>{t('cta.theRoad')}</em></h2>
            <p className="lh-lead lh-lead--muted">{t('cta.subtitle')}</p>
          </div>
          <div className="lh-close__actions">
            <Link to="/vehicles" className="lh-btn lh-btn--solid">{t('cta.browseVehicles')} <ArrowUpLeft size={14} /></Link>
            <span className="lh-close__meta"><Check size={12} />{t('features.verifiedInsured.title')} · <Star size={11} />4.9</span>
          </div>
        </div>
      </section>
    </div>
  );
}
