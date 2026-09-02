import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, getAuthHeader } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { formatDate, formatNumber } from '../i18n/format';
import { Award, Star, Gift, Copy, Check, TrendingUp, Crown, Users, LogIn } from 'lucide-react';

const LoyaltyPage = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [points, setPoints] = useState(null);
    const [tier, setTier] = useState(null);
    const [referral, setReferral] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchLoyaltyData = async () => {
            try {
                setLoading(true);
                const [pointsRes, tierRes, referralRes] = await Promise.all([
                    fetch(API_ENDPOINTS.loyaltyMyPoints, { headers: getAuthHeader() }),
                    fetch(API_ENDPOINTS.loyaltyMyTier, { headers: getAuthHeader() }),
                    fetch(API_ENDPOINTS.loyaltyReferralCode, { headers: getAuthHeader() }),
                ]);

                const pointsData = await pointsRes.json();
                const tierData = await tierRes.json();
                const referralData = await referralRes.json();

                if (pointsData.status === 'success') {
                    setPoints(pointsData.data);
                }
                if (tierData.status === 'success') {
                    setTier(tierData.data);
                }
                if (referralData.status === 'success') {
                    setReferral(referralData.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLoyaltyData();
    }, [isAuthenticated]);

    const copyReferralCode = () => {
        if (referral?.referral_code) {
            navigator.clipboard.writeText(referral.referral_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center py-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full mb-6 border border-primary-100">
                        <LogIn className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="font-display text-3xl font-bold text-ink-900 mb-3">تسجيل الدخول مطلوب</h3>
                    <p className="text-ink-600 mb-8 text-lg">يرجى تسجيل الدخول لعرض نقاط المكافآت والمستوى</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold transition-colors"
                    >
                        <LogIn className="w-5 h-5" />
                        تسجيل الدخول
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-base text-ink-600 font-medium tracking-wider uppercase">Loading loyalty data...</p>
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
                        <Award className="w-3.5 h-3.5" />
                        برنامج الولاء
                    </div>
                    <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[0.95] tracking-tight mb-4">
                        المكافآت
                        <em className="not-italic text-primary-500"> / Loyalty</em>
                    </h1>
                    <p className="text-ink-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        اكسب نقاط مع كل حجز واستمتع بمزايا حصرية
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Points Balance & Tier Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Points Balance Card */}
                    <div className="bg-white rounded-[32px] border border-ink-100 shadow-card p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center">
                                <Star className="w-7 h-7 text-primary-500" />
                            </div>
                            <div>
                                <h3 className="font-display text-lg font-bold text-ink-900">رصيد النقاط</h3>
                                <p className="text-ink-500 text-sm">Points Balance</p>
                            </div>
                        </div>
                        <div className="text-4xl font-display font-bold text-primary-500 mb-2">
                            {formatNumber(points?.balance || 0)}
                        </div>
                        <p className="text-ink-500 text-sm">نقطة متاحة للاستخدام</p>
                    </div>

                    {/* Current Tier Card */}
                    <div className="bg-white rounded-[32px] border border-ink-100 shadow-card p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: tier?.tier?.color ? `${tier.tier.color}20` : '#fef3c7' }}
                            >
                                <Crown
                                    className="w-7 h-7"
                                    style={{ color: tier?.tier?.color || '#f59e0b' }}
                                />
                            </div>
                            <div>
                                <h3 className="font-display text-lg font-bold text-ink-900">
                                    {tier?.tier?.name || tier?.tier?.name_ar || 'عضو'}
                                </h3>
                                <p className="text-ink-500 text-sm">Current Tier</p>
                            </div>
                        </div>
                        {tier?.tier?.discount_percent && (
                            <div className="text-4xl font-display font-bold text-ink-900 mb-2">
                                {tier.tier.discount_percent}%
                                <span className="text-lg text-ink-500 font-normal mr-2">خصم</span>
                            </div>
                        )}

                        {/* Progress to next tier */}
                        {tier?.nextTier && tier?.progress != null && (
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-ink-500 mb-2">
                                    <span>التقدم للمستوى التالي</span>
                                    <span>{Math.round(tier.progress)}%</span>
                                </div>
                                <div className="w-full h-3 bg-ink-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                                        style={{ width: `${tier.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tier Benefits */}
                {tier?.tier?.benefits && tier.tier.benefits.length > 0 && (
                    <div className="bg-white rounded-[32px] border border-ink-100 shadow-card p-8 mb-12">
                        <h3 className="font-display text-2xl font-bold text-ink-900 mb-6 flex items-center gap-3">
                            <Gift className="w-6 h-6 text-primary-500" />
                            مزايا مستواك الحالي
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {tier.tier.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-ink-50 rounded-2xl">
                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4 text-primary-600" />
                                    </div>
                                    <span className="text-ink-700 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Referral Section */}
                {referral && (
                    <div className="bg-white rounded-[32px] border border-ink-100 shadow-card p-8 mb-12">
                        <h3 className="font-display text-2xl font-bold text-ink-900 mb-6 flex items-center gap-3">
                            <Users className="w-6 h-6 text-primary-500" />
                            إحالة الأصدقاء
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-ink-50 rounded-2xl p-6 text-center">
                                <p className="text-ink-500 text-sm mb-2">رمز الإحالة</p>
                                <div className="flex items-center justify-center gap-2">
                                    <code className="text-2xl font-bold text-ink-900 bg-white px-4 py-2 rounded-xl border border-ink-100">
                                        {referral.referral_code}
                                    </code>
                                    <button
                                        onClick={copyReferralCode}
                                        className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
                                        title="Copy code"
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-ink-50 rounded-2xl p-6 text-center">
                                <p className="text-ink-500 text-sm mb-2">إجمالي الإحالات</p>
                                <p className="text-3xl font-display font-bold text-ink-900">
                                    {formatNumber(referral.total_referrals || 0)}
                                </p>
                            </div>
                            <div className="bg-ink-50 rounded-2xl p-6 text-center">
                                <p className="text-ink-500 text-sm mb-2">النقاط المكتسبة</p>
                                <p className="text-3xl font-display font-bold text-primary-500">
                                    {formatNumber(referral.points_earned || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Points History */}
                {points?.points && points.points.length > 0 && (
                    <div className="bg-white rounded-[32px] border border-ink-100 shadow-card p-8">
                        <h3 className="font-display text-2xl font-bold text-ink-900 mb-6 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-primary-500" />
                            سجل النقاط
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-ink-100">
                                        <th className="text-right py-3 px-4 text-sm font-bold text-ink-500">التاريخ</th>
                                        <th className="text-right py-3 px-4 text-sm font-bold text-ink-500">الوصف</th>
                                        <th className="text-right py-3 px-4 text-sm font-bold text-ink-500">النقاط</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {points.points.map((transaction, idx) => (
                                        <tr key={idx} className="border-b border-ink-50 hover:bg-ink-50/50 transition-colors">
                                            <td className="py-3 px-4 text-sm text-ink-600">
                                                {formatDate(transaction.created_at || transaction.date)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-ink-700 font-medium">
                                                {transaction.description || transaction.type || '—'}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-bold">
                                                <span className={transaction.amount > 0 ? 'text-green-600' : 'text-secondary-500'}>
                                                    {transaction.amount > 0 ? '+' : ''}{formatNumber(transaction.amount)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoyaltyPage;
