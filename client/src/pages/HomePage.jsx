import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
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

const categoryCards = [
  { key: 'cityCars', label: 'سيارات مدينة', count: '5+', type: 'car', image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=900&h=900&fit=crop' },
  { key: 'suvs', label: 'سيارات دفع رباعي', count: '3+', type: 'car', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=900&fit=crop' },
  { key: 'commuterBikes', label: 'دراجات تنقل', count: '5+', type: 'bike', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&h=900&fit=crop' },
  { key: 'sportsBikes', label: 'دراجات رياضية', count: '3+', type: 'bike', image: 'https://images.unsplash.com/photo-1558980664-10e7170e99f8?w=900&h=900&fit=crop' },
];

const articleCards = [
  { tag: 'سيارات', title: 'مستقبل السيارات الكهربائية في المملكة', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&h=600&fit=crop' },
  { tag: 'نصائح', title: 'أفضل وجهات السفر بالسيارة', image: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=900&h=600&fit=crop' },
  { tag: 'دليل', title: '5 نصائح للحفاظ على سيارتك', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=900&h=600&fit=crop' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

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

  const stats = [
    { value: '1000+', label: 'عميل سعيد', icon: Users },
    { value: '15+', label: 'مركبة متاحة', icon: Car },
    { value: '3+', label: 'مدن نخدمها', icon: MapPin },
    { value: '4.9', label: 'متوسط التقييم', icon: Star },
  ];

  const benefits = [
    { icon: Zap, title: 'حجز سريع', description: 'اختر مركبتك واحجزها خلال دقائق بدون تعقيد.' },
    { icon: Wallet, title: 'أسعار واضحة', description: 'تعرف التكلفة من البداية بدون رسوم مفاجئة.' },
    { icon: ShieldCheck, title: 'مركبات موثوقة', description: 'أسطول مختار ومراجع ليمنحك رحلة مطمئنة.' },
    { icon: Headset, title: 'دعم على مدار الساعة', description: 'فريق حقيقي جاهز لمساعدتك قبل الرحلة وأثناءها.' },
  ];

  const steps = [
    { number: '01', icon: Search, title: 'اكتشف', description: 'ابحث عن السيارة أو الدراجة المناسبة لك.' },
    { number: '02', icon: CalendarDays, title: 'احجز بسهولة', description: 'حدد الموعد والموقع وأكمل الحجز بخطوات بسيطة.' },
    { number: '03', icon: KeyRound, title: 'انطلق', description: 'استلم مركبتك واستمتع بالطريق، ونحن نهتم بالباقي.' },
  ];

  const testimonials = [
    { name: 'محمد العتيبي', role: 'عميل منذ 2025', text: 'تجربة ممتازة من أول حجز حتى التسليم. السيارة كانت نظيفة والدعم سريع جدًا.', rating: 5 },
    { name: 'نورة الدوسري', role: 'مسافرة متكررة', text: 'أكثر شيء أعجبني وضوح الأسعار وسهولة الحجز. أصبحت الرفقة خياري الأول.', rating: 5 },
    { name: 'خالد القحطاني', role: 'عميل دائم', text: 'أسطول ممتاز وخدمة احترافية. كل مرة أحتاج سيارة أرجع لهم بدون تردد.', rating: 5 },
  ];

  return (
    <div className="alrafgha-home" dir="rtl">
      {/* HERO */}
      <section className="home-hero" data-testid="hero-section">
        <div className="home-hero__glow home-hero__glow--one" />
        <div className="home-hero__glow home-hero__glow--two" />
        <div className="home-shell home-hero__content">
          <div className="home-hero__copy">
            <span className="home-kicker"><span className="home-kicker__dot" /> تأجير أسهل. طريق أجمل.</span>
            <h1>رحلتك تبدأ <span>من هنا</span></h1>
            <p>استأجر سيارتك بسهولة وأمان. تجربة حقيقية، أسعار واضحة، وخدمة تهتم بتفاصيل رحلتك.</p>
            <div className="home-hero__actions">
              <Link to="/vehicles" className="home-btn home-btn--primary">استعرض المركبات <ArrowLeft size={17} /></Link>
              <Link to="/pricing" className="home-btn home-btn--ghost">اعرف الأسعار</Link>
            </div>
          </div>

          <div className="home-hero__visual">
            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1500&h=1000&fit=crop" alt="سيارة للإيجار" />
            <div className="home-hero__shade" />
            <div className="home-hero__floating home-hero__floating--top">
              <ShieldCheck size={18} />
              <div><strong>مركبات موثوقة</strong><span>فحص وتجهيز قبل كل رحلة</span></div>
            </div>
            <div className="home-hero__floating home-hero__floating--bottom">
              <span className="home-live-dot" /> متاح الآن في أكثر من مدينة
            </div>
          </div>
        </div>

        <div className="home-search-wrap home-shell">
          <form className="home-search" onSubmit={submitSearch}>
            <div className="home-search__field home-search__field--location">
              <MapPin size={19} />
              <label>موقع الاستلام<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="اختر المدينة أو الموقع" /></label>
            </div>
            <div className="home-search__field">
              <CalendarDays size={19} />
              <label>تاريخ الاستلام<input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} /></label>
            </div>
            <div className="home-search__field">
              <CalendarDays size={19} />
              <label>تاريخ الإرجاع<input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></label>
            </div>
            <button className="home-search__submit" type="submit"><Search size={19} /> ابحث عن سيارة</button>
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
            <div><span className="home-overline">اختيارات تناسبك</span><h2>تصفح حسب <span>الفئة</span></h2></div>
            <p>من مشوار المدينة إلى الرحلات الطويلة، اختر المركبة التي تناسب خطتك.</p>
          </div>
          <div className="home-category-grid">
            {categoryCards.map((category) => (
              <Link key={category.key} to={`/vehicles?type=${category.type}`} className="home-category-card">
                <img src={category.image} alt={category.label} />
                <div className="home-category-card__overlay" />
                <div className="home-category-card__top"><span>{category.type === 'car' ? <Car size={13} /> : <Bike size={13} />}</span><span>{category.count} مركبات</span></div>
                <div className="home-category-card__bottom"><h3>{category.label}</h3><span>استكشف الفئة <ArrowLeft size={15} /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="home-section" data-testid="featured-vehicles-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--compact">
            <div><span className="home-overline">اختياراتنا اليوم</span><h2>مركبات <span>مميزة</span></h2></div>
            <Link to="/vehicles" className="home-text-link">عرض كل المركبات <ArrowLeft size={16} /></Link>
          </div>
          <div className="home-filter-pills" role="tablist" aria-label="تصفية المركبات">
            {[['all', 'الكل'], ['car', 'سيارات'], ['bike', 'دراجات']].map(([key, label]) => (
              <button key={key} className={activeCategory === key ? 'is-active' : ''} onClick={() => setActiveCategory(key)}>{label}</button>
            ))}
          </div>
          {loadingVehicles ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><VehicleCardSkeleton /><VehicleCardSkeleton /><VehicleCardSkeleton /></div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{filteredVehicles.map((vehicle) => <VehicleCard key={vehicle._id} vehicle={vehicle} />)}</div>
          ) : (
            <div className="home-empty">لا توجد مركبات مميزة متاحة حاليًا. <Link to="/vehicles">استعرض الأسطول الكامل</Link></div>
          )}
        </div>
      </section>

      {/* OWNER CTA */}
      <section className="home-owner-cta">
        <div className="home-owner-cta__image"><img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1300&h=800&fit=crop" alt="أضف سيارتك" /></div>
        <div className="home-owner-cta__content home-shell">
          <div><span className="home-overline home-overline--light">هل لديك سيارة؟</span><h2>اكسب من سيارتك <span>الآن</span></h2><p>أضف مركبتك إلى الرفقة وابدأ في تحقيق دخل إضافي مع تجربة إدارة واضحة وآمنة.</p></div>
          <Link to="/vendor" className="home-btn home-btn--primary">أضف سيارتك الآن <ArrowUpLeft size={17} /></Link>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="home-section home-section--soft" data-testid="features-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--center"><div><span className="home-overline">لماذا الرفقة؟</span><h2>لأن التفاصيل <span>تفرق</span></h2></div><p>كل ما تحتاجه لتكون رحلة الاستئجار أسهل وأكثر راحة.</p></div>
          <div className="home-benefits-grid">
            {benefits.map(({ icon: Icon, title, description }) => <div className="home-benefit" key={title}><div className="home-benefit__icon"><Icon size={21} /></div><h3>{title}</h3><p>{description}</p></div>)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-process" data-testid="how-it-works-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--light"><div><span className="home-overline home-overline--light">بكل بساطة</span><h2>ثلاث خطوات إلى <span>الطريق المفتوح</span></h2></div><p>لا إجراءات طويلة ولا تعقيد. اختر، احجز، وانطلق.</p></div>
          <div className="home-steps">
            {steps.map(({ number, icon: Icon, title, description }) => <div className="home-step" key={number}><span className="home-step__number">{number}</span><div className="home-step__icon"><Icon size={21} /></div><h3>{title}</h3><p>{description}</p></div>)}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="home-section" data-testid="experience-section">
        <div className="home-shell home-experience">
          <div className="home-experience__photo"><img src="https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1000&h=1200&fit=crop" alt="تجربة الرفقة" /><div className="home-experience__badge"><Check size={15} /> تجربة تستحق التكرار</div></div>
          <div className="home-experience__copy"><span className="home-overline">أكثر من تأجير</span><h2>تجربة تحترم <span>وقتك</span>.</h2><p>نصمم كل خطوة حول احتياجك: من البحث عن المركبة إلى لحظة تسليم المفتاح، لتعيش الرحلة بدون تشتيت.</p><div className="home-experience__list"><div><Clock3 size={19} /><span><strong>حجز مرن</strong> مواعيد واضحة وتفاصيل سهلة.</span></div><div><ShieldCheck size={19} /><span><strong>ثقة من البداية</strong> معلومات المركبة متاحة بوضوح.</span></div><div><Headset size={19} /><span><strong>مساعدة حقيقية</strong> فريق جاهز وقت ما تحتاجه.</span></div></div><Link to="/vehicles" className="home-btn home-btn--primary">ابدأ رحلتك <ArrowLeft size={17} /></Link></div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="home-section home-section--soft">
        <div className="home-shell">
          <div className="home-section-head home-section-head--compact"><div><span className="home-overline">من مدونتنا</span><h2>أحدث <span>المقالات</span></h2></div><Link to="/blog" className="home-text-link">عرض كل المقالات <ArrowLeft size={16} /></Link></div>
          <div className="home-articles">{articleCards.map((article) => <Link to="/blog" className="home-article" key={article.title}><div className="home-article__image"><img src={article.image} alt={article.title} /><span>{article.tag}</span></div><div className="home-article__body"><h3>{article.title}</h3><p>نصائح وأفكار تساعدك على اختيار المركبة والاستمتاع برحلتك بثقة.</p><span>اقرأ المقال <ArrowLeft size={15} /></span></div></Link>)}</div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="home-section" data-testid="testimonials-section">
        <div className="home-shell">
          <div className="home-section-head home-section-head--center"><div><span className="home-overline">آراء عملائنا</span><h2>محبوب من الركاب، <span>موثوق من الآلاف</span></h2></div></div>
          <div className="home-testimonials">{testimonials.map((item) => <article className="home-testimonial" key={item.name}><div className="home-testimonial__quote">“</div><div className="home-testimonial__stars">{Array.from({ length: item.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div><p>{item.text}</p><div className="home-testimonial__person"><div>{item.name.charAt(0)}</div><span><strong>{item.name}</strong><small>{item.role}</small></span></div></article>)}</div>
        </div>
      </section>

      {/* APP / FINAL CTA */}
      <section className="home-app-cta">
        <div className="home-shell home-app-cta__inner"><div className="home-app-cta__phone"><div className="home-phone-notch" /><img src="/arafgha-logo.png" alt="الرفقة" /></div><div><span className="home-overline home-overline--light">تجربة أفضل على الهاتف</span><h2>حمّل تطبيق <span>الرفقة</span></h2><p>تابع حجوزاتك، استعرض المركبات، واحصل على كل تفاصيل رحلتك في مكان واحد.</p><div className="home-app-buttons"><span><small>متوفر على</small><strong>App Store</strong></span><span><small>حمّل من</small><strong>Google Play</strong></span></div></div></div>
      </section>

      <section className="home-newsletter">
        <div className="home-shell home-newsletter__inner"><div><span className="home-overline">ابقَ على اطلاع</span><h2>عروض جديدة، بدون إزعاج.</h2></div><form onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني" /><button type="submit">اشترك <ArrowLeft size={15} /></button></form></div>
      </section>
    </div>
  );
};

export default HomePage;
