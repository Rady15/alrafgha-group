import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { useTranslation } from 'react-i18next';
import { formatDate, formatPrice } from '../i18n/format';
import { Tag, Calendar, Car, Sparkles, ArrowUpRight } from 'lucide-react';

const OffersPage = () => {
    const { t } = useTranslation();
    const [offers, setOffers] = useState([]);
    const [discountedVehicles, setDiscountedVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.activeOffers);
                const data = await response.json();

                if (data.status === 'success') {
                    setOffers(data.data.offers || []);
                    setDiscountedVehicles(data.data.discountedVehicles || []);
                } else {
                    setError('Failed to load offers');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-base text-ink-600 font-medium tracking-wider uppercase">Loading offers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <h3 className="font-display text-4xl font-bold text-ink-900 mb-3">Something went wrong</h3>
                    <p className="text-ink-600 mb-8 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafaf7] overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-[#fafaf7] pt-20 pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[160px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-100 text-primary-700 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        <Tag className="w-3.5 h-3.5" />
                        عروض حصرية
                    </div>
                    <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[0.95] tracking-tight mb-4">
                        العروض
                        <em className="not-italic text-primary-500"> / Offers</em>
                    </h1>
                    <p className="text-ink-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        استفد من أفضل العروض والخصومات على تأجير السيارات
                    </p>
                </div>
            </section>

            {/* Offers Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {offers.length > 0 && (
                    <>
                        <h2 className="font-display text-3xl font-bold text-ink-900 mb-8 flex items-center gap-3">
                            <Sparkles className="w-7 h-7 text-primary-500" />
                            العروض النشطة
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {offers.map((offer) => (
                                <div
                                    key={offer._id}
                                    className="group relative bg-white rounded-[32px] border border-ink-100 hover:border-primary-200 transition-all duration-500 shadow-card hover:shadow-card-hover overflow-hidden transform hover:-translate-y-2"
                                >
                                    {offer.image && (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={offer.image}
                                                alt={offer.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {offer.discount_percentage && (
                                                <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                                    -{offer.discount_percentage}%
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="font-display text-xl font-bold text-ink-900 mb-2">{offer.title}</h3>
                                        <p className="text-ink-600 text-sm mb-4 line-clamp-2">{offer.description}</p>

                                        {offer.discount_percentage && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <Tag className="w-4 h-4 text-primary-500" />
                                                <span className="text-primary-600 font-bold text-sm">{offer.discount_percentage}% خصم</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 text-xs text-ink-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{formatDate(offer.valid_from)}</span>
                                            </div>
                                            <span>—</span>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{formatDate(offer.valid_until)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {offers.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-card border border-ink-100 max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-ink-50 rounded-full mb-6 border border-ink-100">
                            <Tag className="w-8 h-8 text-ink-400" />
                        </div>
                        <h3 className="font-display text-3xl font-bold text-ink-900 mb-3">No Active Offers</h3>
                        <p className="text-ink-500 text-lg">لا توجد عروض حالياً. تابعنا للحصول على أحدث العروض</p>
                    </div>
                )}

                {/* Discounted Vehicles */}
                {discountedVehicles.length > 0 && (
                    <>
                        <h2 className="font-display text-3xl font-bold text-ink-900 mb-8 flex items-center gap-3">
                            <Car className="w-7 h-7 text-primary-500" />
                            السيارات المخفضة
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {discountedVehicles.map((vehicle) => (
                                <Link
                                    to={`/vehicles/${vehicle._id}`}
                                    key={vehicle._id}
                                    className="group relative bg-white rounded-[32px] border border-ink-100 hover:border-primary-200 transition-all duration-500 shadow-card hover:shadow-card-hover overflow-hidden transform hover:-translate-y-2"
                                >
                                    {vehicle.images?.[0] && (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={vehicle.images[0]}
                                                alt={vehicle.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {vehicle.discount_percentage && (
                                                <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                                    -{vehicle.discount_percentage}%
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="font-display text-xl font-bold text-ink-900 mb-2">{vehicle.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                {vehicle.original_price && (
                                                    <span className="text-ink-400 line-through text-sm mr-2">
                                                        <span dangerouslySetInnerHTML={{ __html: formatPrice(vehicle.original_price) }} />
                                                    </span>
                                                )}
                                                <span className="text-primary-600 font-bold text-lg">
                                                    <span dangerouslySetInnerHTML={{ __html: formatPrice(vehicle.price_per_day) }} />/يوم
                                                </span>
                                            </div>
                                            <span className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OffersPage;
