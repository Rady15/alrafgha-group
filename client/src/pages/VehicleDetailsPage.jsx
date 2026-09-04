import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { Motorbike, Car, Sparkles, MapPin, ChevronLeft, ChevronRight, ArrowLeft, Shield, Fuel, Calendar } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { formatPrice } from '../i18n/format';
import Price from '../components/Price';
import { useTranslation } from 'react-i18next';
import useScrollReveal from '../hooks/useScrollReveal';

const VehicleDetailsPage = () => {
  const { t } = useTranslation('vehicles');
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useScrollReveal();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchVehicleDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.vehicleById(id));
      const data = await response.json();
      if (data.status === 'success') setVehicle(data.data.vehicle);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchVehicleDetails(); }, [fetchVehicleDetails]);

  const handleBooking = async () => { navigate('/bookings'); };
  const handlePaymentSuccess = (booking) => { console.log('Booking created:', booking); };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-25 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-ink-500 font-medium tracking-wide uppercase">{t('loadingVehicles') || 'Loading vehicle…'}</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-neutral-25 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-6">
            <Car className="w-10 h-10 text-ink-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-ink-900 mb-2">{t('notFound')}</h2>
          <p className="text-ink-500 mb-6">{t('notFoundDesc') || 'The vehicle you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/vehicles')} className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-white rounded-xl font-semibold hover-lift">
            <ArrowLeft className="w-4 h-4" />{t('backToVehicles')}
          </button>
        </div>
      </div>
    );
  }

  const features = [
    { icon: '⚡', label: t('featurePerformanceLabel'), value: t('featurePerformanceValue') },
    { icon: '⛽', label: t('featureMileageLabel'), value: t('featureMileageValue') },
    { icon: '❤️‍🩹', label: t('featureInsuranceLabel'), value: t('featureInsuranceValue') },
    { icon: '🛡️', label: t('featureSafetyLabel'), value: t('featureSafetyValue') },
  ];

  const nextImage = () => setSelectedImage((i) => (i + 1) % vehicle.images.length);
  const prevImage = () => setSelectedImage((i) => (i - 1 + vehicle.images.length) % vehicle.images.length);
  const onGalleryKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-neutral-25">
      {/* Breadcrumb + Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2" data-reveal="up">
        <nav className="flex items-center gap-2 text-sm text-ink-500" aria-label="Breadcrumb">
          <button onClick={() => navigate('/vehicles')} className="hover:text-gold-600 transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />{t('vehicles')}
          </button>
          <span className="text-ink-300">/</span>
          <span className="text-ink-900 font-medium truncate">{vehicle.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left — Gallery & Details (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Gallery — no horizontal overflow, keyboard + SR friendly */}
            <div className="relative bg-ink-950 rounded-[22px] overflow-hidden shadow-2xl" data-reveal="up" onKeyDown={onGalleryKeyDown} tabIndex={vehicle.images.length > 1 ? 0 : -1} aria-label={t('vehicles:galleryLabel') || 'Vehicle gallery'}>
              <div className="aspect-[16/10] relative bg-ink-900 overflow-hidden">
                {/* Fallback icon — always behind, visible if image hidden/broken even when extension injects __web-inspector-hide-shortcut__ */}
                <div className="absolute inset-0 flex items-center justify-center bg-ink-900 text-ink-400" aria-hidden="true">
                  <Car className="w-16 h-16 opacity-30" />
                </div>
                <img
                  src={vehicle.images[selectedImage]}
                  alt={t('vehicles:imageAlt', { name: vehicle.name, n: selectedImage + 1 })}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.32) 100%)' }} />
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {vehicle.is_featured && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gold-500 text-ink-950">
                        <Sparkles className="w-3 h-3" />{t('featured')}
                      </span>
                    )}
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur border ${vehicle.is_available_for_booking ? 'bg-white text-ink-900 border-white' : 'bg-ink-900/70 text-white border-white/20'}`}>
                      {vehicle.is_available_for_booking ? `● ${t('available')}` : `○ ${t('notAvailable')}`}
                    </span>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur text-ink-700 shrink-0">
                    {vehicle.type === 'car' ? <Car className="w-4 h-4" /> : <Motorbike className="w-4 h-4" />}{t(vehicle.type === 'car' ? 'cars' : 'bikes')}
                  </span>
                </div>
                {vehicle.images.length > 1 && (
                  <>
                    <button onClick={prevImage} aria-label={t('common:actions.previous') || 'Previous image'} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-ink-900 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextImage} aria-label={t('common:actions.next') || 'Next image'} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-ink-900 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-black/45 backdrop-blur" aria-hidden="true">
                      {vehicle.images.map((_, i) => (
                        <span key={i} className={`h-1 rounded-full transition-all ${i === selectedImage ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {vehicle.images.length > 1 && (
                <div className="flex gap-2 p-2 bg-ink-900 overflow-x-auto overscroll-x-contain" style={{ scrollbarWidth: 'thin' }}>
                  {vehicle.images.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImage(idx)} aria-label={t('vehicles:imageAlt', { name: vehicle.name, n: idx + 1 })} aria-current={idx === selectedImage} className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${selectedImage === idx ? 'border-gold-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title block — editorial, not boxed */}
            <div className="px-1" data-reveal="up" style={{ '--reveal-delay': '80ms' }}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-none" style={{ color: '#0c0c14' }}>{vehicle.name}</h1>
                  <p className="mt-1.5 flex items-center gap-2 text-sm" style={{ color: '#484858' }}>
                    <span className="font-semibold" style={{ color: '#303040' }}>{vehicle.brand}</span>
                    <span className="w-1 h-1 rounded-full bg-gold-500" />
                    <span>{vehicle.model_name}</span>
                    {vehicle.cc_engine && <><span className="w-1 h-1 rounded-full bg-ink-300" /><span className="inline-flex items-center gap-1 font-mono text-xs bg-ink-100 px-2 py-0.5 rounded">{vehicle.cc_engine}cc</span></>}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-600 bg-white border border-ink-100 rounded-full px-3 py-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />{vehicle.location}
                </span>
              </div>
              {/* Pricing — inline, not card */}
              <div className="flex flex-wrap gap-6 py-4 border-y border-ink-100">
                <div>
                  <p className="text-[11px] uppercase tracking-widest font-bold text-ink-400">{t('perDay')}</p>
                  <p className="text-2xl font-display font-black text-ink-900"><Price>{formatPrice(vehicle.price_per_day)}</Price></p>
                </div>
                {vehicle.price_per_km && (
                  <div className="pl-6 border-l border-ink-100">
                    <p className="text-[11px] uppercase tracking-widest font-bold text-ink-400">{t('perKilometer')}</p>
                    <p className="text-2xl font-display font-black text-ink-700"><Price>{formatPrice(vehicle.price_per_km)}</Price></p>
                  </div>
                )}
                <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-ink-500">
                  <Shield className="w-4 h-4 text-gold-500" />{t('featureInsuranceValue')}
                </div>
              </div>
            </div>

            {/* Description — editorial */}
            <div className="bg-white rounded-2xl border border-ink-100 p-6 sm:p-8" data-reveal="up" style={{ '--reveal-delay': '120ms' }}>
              <h2 className="text-sm font-bold tracking-widest uppercase text-ink-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-[2px] bg-gold-500" />{t('aboutThisVehicle')}
              </h2>
              <p className="text-ink-600 leading-relaxed">{t('aboutDescription')}</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-neutral-25 border border-ink-100">
                    <span className="text-lg leading-none">{f.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink-900">{f.label}</p>
                      <p className="text-xs text-ink-500">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-white grid place-items-center text-[10px] font-black">!</span>
                {t('idProofNote', { id: t('originalIdProof') })}
              </p>
            </div>
          </div>

          {/* Right — Booking (2 cols, sticky only on desktop) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20 space-y-3">
              <div className="hidden lg:flex items-center gap-2 text-xs text-ink-600 bg-gold-50/70 border border-gold-100 rounded-xl px-3 py-2.5">
                <Shield className="w-4 h-4 text-gold-600 shrink-0" />
                <span>{t('trustNote') || 'Verified fleet • Insured • Roadside assistance — Saudi Arabia'}</span>
              </div>
              <BookingForm vehicle={vehicle} onSubmit={handleBooking} onPaymentSuccess={handlePaymentSuccess} />
              <p className="text-center text-xs text-ink-400 flex items-center justify-center gap-1.5 px-2">
                <Fuel className="w-3.5 h-3.5 shrink-0" />{t('payHint') || '40% advance to confirm • Remaining on return'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
