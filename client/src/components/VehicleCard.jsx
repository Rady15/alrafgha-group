import { Link } from 'react-router-dom';
import { Car, Bike, MapPin, ArrowUpRight, Fuel, Gauge } from 'lucide-react';
import { formatPrice } from '../i18n/format';
import Price from './Price';
import { useTranslation } from 'react-i18next';

const VehicleCard = ({ vehicle }) => {
  const { t } = useTranslation('vehicles');
  const {
    _id,
    name,
    model_name,
    type,
    brand,
    price_per_day,
    price_per_km,
    cc_engine,
    images,
    availability_status,
    location,
  } = vehicle;

  const isAvailable = availability_status === 'available';
  const imageUrl = images?.[0] || '';
  const TypeIcon = type === 'car' ? Car : Bike;

  return (
    <article
      className="group relative bg-white rounded-2xl overflow-hidden border border-ink-100 shadow-card-rest hover:shadow-card-hover transition-all duration-500"
      data-testid={`vehicle-card-${_id}`}
    >
      {/* Image */}
      <Link to={`/vehicles/${_id}`} className="block" aria-label={`${name} ${model_name} - ${t('common:actions.viewDetails')}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-50 via-white to-gold-50">
          {/* Decorative grid */}
          <div className="absolute inset-0 dot-grid opacity-40" />

          {imageUrl ? (
            <img src={imageUrl} alt={name} className="relative w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out" />
          ) : (
            <div className="relative w-full h-full bg-gradient-to-br from-ink-100 via-white to-gold-50 flex items-center justify-center" aria-hidden="true">
              <TypeIcon className="w-16 h-16 text-ink-200" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top row - Type & Availability */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md text-ink-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
              <TypeIcon className="w-3.5 h-3.5 text-gold-500" />
              <span>{t(type === 'car' ? 'categories.cityCars' : 'categories.commuterBikes')}</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${isAvailable
                ? 'bg-success-500 text-white'
                : 'bg-white/95 text-ink-500'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-white animate-pulse-subtle' : 'bg-ink-200'}`} />
              <span>{isAvailable ? t('available') : t('booked')}</span>
            </div>
          </div>

          {/* Brand watermark */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80 bg-ink-900/70 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">
              {brand}
            </span>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <Link to={`/vehicles/${_id}`} className="group/link">
              <h3 className="text-xl font-display font-bold text-ink-900 leading-tight truncate group-hover/link:text-gold-600 transition-colors duration-300">
                {name}
              </h3>
            </Link>
            <p className="text-xs text-ink-500 font-medium mt-0.5 truncate">{model_name}</p>
          </div>
          {cc_engine && (
            <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-ink-50 group-hover:bg-gold-50 text-ink-700 group-hover:text-gold-700 text-[11px] font-bold rounded-md transition-colors duration-300">
              <Gauge className="w-3 h-3" />
              {cc_engine}cc
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-ink-500 text-xs font-medium mb-5">
          <MapPin className="w-3.5 h-3.5 text-gold-500" />
          <span className="truncate">{location}</span>
        </div>

        {/* Pricing — high contrast: ink-900 on gold-50, never white-on-white */}
        <div className="relative bg-gold-50 border border-gold-200 rounded-2xl p-4 mb-4 overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="relative flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-500 font-bold mb-1">{t('perDay')}</p>
              <span className="text-3xl font-display font-black text-ink-900"><Price size="lg">{formatPrice(price_per_day)}</Price></span>
            </div>
            {price_per_km && (
              <div className="text-right pl-3 border-l border-gold-200">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink-500 font-bold mb-1">{t('perKm')}</p>
                <span className="text-xl font-display font-black text-ink-800"><Price>{formatPrice(price_per_km)}</Price></span>
              </div>
            )}
          </div>
        </div>

        {/* CTA — always readable without hover (mobile) */}
        <Link
          to={`/vehicles/${_id}`}
          aria-disabled={!isAvailable}
          onClick={(e) => !isAvailable && e.preventDefault()}
          data-testid={`vehicle-book-btn-${_id}`}
          className={`group/cta relative flex items-center justify-between px-5 py-3 rounded-xl font-bold text-sm transition-colors overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${isAvailable
            ? 'bg-ink-900 text-white hover:bg-ink-800 active:bg-black'
            : 'bg-ink-100 text-ink-400 cursor-not-allowed'
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isAvailable ? (
              <>
                <Fuel className="w-4 h-4" />
                {t('reserveNow')}
              </>
            ) : (
              t('unavailable')
            )}
          </span>
          {isAvailable && (
            <span className="relative z-10 w-7 h-7 bg-white/15 group-hover/cta:bg-white text-white rounded-full flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </span>
          )}
        </Link>
      </div>
    </article>
  );
};

export default VehicleCard;