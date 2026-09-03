import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_ENDPOINTS, getAuthHeader } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../i18n/format';
import Price from '../components/Price';
import { useTranslation } from 'react-i18next';

const BookingForm = ({ vehicle, onSubmit, onPaymentSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('bookings');
  const [formData, setFormData] = useState({
    pickup_location: vehicle?.location || '',
    pickup_datetime: '',
    dropoff_datetime: '',
  });

  const [errors, setErrors] = useState({});
  const [totalCost, setTotalCost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Stripe state
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate duration and cost when dates change
    if (name === 'pickup_datetime' || name === 'dropoff_datetime') {
      calculateCost({ ...formData, [name]: value });
    }
  };

  const calculateCost = (data) => {
    if (data.pickup_datetime && data.dropoff_datetime && vehicle) {
      const pickup = new Date(data.pickup_datetime);
      const dropoff = new Date(data.dropoff_datetime);
      const totalHours = Math.abs(dropoff - pickup) / 36e5;
      const days = Math.floor(totalHours / 24);
      const remainingHours = Math.floor(totalHours % 24);

      const cost = (days * vehicle.price_per_day) + (remainingHours * vehicle.price_per_hour);
      const estimatedTotal = Math.round(cost);
      const advanceAmount = Math.round(estimatedTotal * 0.40);
      
      setTotalCost({
        total: estimatedTotal,
        advanceAmount: advanceAmount,
        remainingAmount: estimatedTotal - advanceAmount,
        breakdown: {
          totalHours: Math.round(totalHours * 10) / 10,
          days,
          remainingHours,
          pricePerDay: vehicle.price_per_day,
          pricePerHour: vehicle.price_per_hour,
          dayCost: days * vehicle.price_per_day,
          hourCost: remainingHours * vehicle.price_per_hour
        }
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.pickup_location) newErrors.pickup_location = 'Pickup location is required';
    if (!formData.pickup_datetime) newErrors.pickup_datetime = 'Pickup date & time is required';
    if (!formData.dropoff_datetime) newErrors.dropoff_datetime = 'Return date & time is required';
    
    if (formData.pickup_datetime && formData.dropoff_datetime) {
      const pickup = new Date(formData.pickup_datetime);
      const dropoff = new Date(formData.dropoff_datetime);
      const now = new Date();
      
      if (pickup < now) {
        newErrors.pickup_datetime = 'Pickup date must be in the future';
      }
      if (dropoff <= pickup) {
        newErrors.dropoff_datetime = 'Return date must be after pickup date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartPayment = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a vehicle');
      return;
    }

    if (!validateForm()) return;
    if (!totalCost || totalCost.advanceAmount <= 0) {
      toast.error('Please select valid pickup and return dates');
      return;
    }

    setLoading(true);

    try {
      // Fetch Stripe publishable key from server config
      const configRes = await fetch(API_ENDPOINTS.stripeConfig);
      const configData = await configRes.json();
      const pk = configData.data?.publishable_key || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!pk) {
        toast.error('Payment gateway is not configured');
        setLoading(false);
        return;
      }

      // Create advance payment intent (server-side)
      const intentRes = await fetch(API_ENDPOINTS.stripeCreateAdvanceIntent, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify({ vehicle_id: vehicle._id })
      });

      const intentData = await intentRes.json();
      if (intentData.status !== 'success' || !intentData.data?.client_secret) {
        toast.error(intentData.message || 'Failed to create payment');
        setLoading(false);
        return;
      }

      setClientSecret(intentData.data.client_secret);
      setStripePromise(loadStripe(pk));
    } catch (error) {
      console.error('Payment setup error:', error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const closeSuccessPopup = () => {
    setShowPaymentSuccess(false);
    if (onSubmit) {
      onSubmit({
        ...formData,
        total_cost: totalCost?.total || 0,
        vehicle_id: vehicle._id,
      });
    }
  };

  return (
    <>
      <form className="bg-white rounded-2xl shadow-card p-6 space-y-6" data-testid="booking-form">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-linear-to-r from-primary-500 to-secondary-500 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">{t('bookings:form.book')} <span className="text-primary-500">{t('bookings:form.yourRide')}</span></h2>
        </div>

        {/* Pickup Location */}
        <div>
          <label htmlFor="pickup_location" className="block text-sm font-semibold text-neutral-700 mb-2">
            {t('bookings:form.pickupDropoffLocation')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </span>
            <input
              type="text"
              id="pickup_location"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              readOnly
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 cursor-not-allowed transition-all duration-200 ${
                errors.pickup_location ? 'border-secondary-500' : 'border-neutral-200'
              }`}
              placeholder={t('bookings:form.pickupLocationFixed')}
              data-testid="pickup-location-input"
            />
          </div>
          {errors.pickup_location && (
            <p className="mt-1 text-sm text-secondary-600">{errors.pickup_location}</p>
          )}
        </div>

        {/* Pickup Date & Time */}
        <div>
          <label htmlFor="pickup_datetime" className="block text-sm font-semibold text-neutral-700 mb-2">
            {t('bookings:form.pickupDateTime')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="datetime-local"
              id="pickup_datetime"
              name="pickup_datetime"
              value={formData.pickup_datetime}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                errors.pickup_datetime ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
              }`}
              data-testid="pickup-datetime-input"
            />
          </div>
          {errors.pickup_datetime && (
            <p className="mt-1 text-sm text-secondary-600">{errors.pickup_datetime}</p>
          )}
        </div>

        {/* Return Date & Time */}
        <div>
          <label htmlFor="dropoff_datetime" className="block text-sm font-semibold text-neutral-700 mb-2">
            {t('bookings:form.returnDateTime')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="datetime-local"
              id="dropoff_datetime"
              name="dropoff_datetime"
              value={formData.dropoff_datetime}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${
                errors.dropoff_datetime ? 'border-secondary-500' : 'border-neutral-200 focus:border-primary-500'
              }`}
              data-testid="dropoff-datetime-input"
            />
          </div>
          {errors.dropoff_datetime && (
            <p className="mt-1 text-sm text-secondary-600">{errors.dropoff_datetime}</p>
          )}
        </div>

        {/* Cost Breakdown Display */}
        {totalCost && totalCost.total > 0 && (
          <div className="bg-linear-to-r from-primary-50 to-secondary-50 rounded-xl p-5 border-2 border-primary-200" data-testid="cost-breakdown">
            <h3 className="text-lg font-bold text-neutral-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('bookings:labels.costBreakdown')}
            </h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">{t('bookings:form.totalDuration')}</span>
                  <span className="font-semibold text-neutral-800">
                    {t('bookings:units.hours', { hours: totalCost.breakdown.totalHours })}
                    {totalCost.breakdown.days > 0 && ` (${t('bookings:form.daysHours', { days: totalCost.breakdown.days, hours: totalCost.breakdown.remainingHours })})`}
                  </span>
              </div>
              
              {totalCost.breakdown.days > 0 && (
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">
                      {t('bookings:form.dayRate', { days: totalCost.breakdown.days, price: formatPrice(totalCost.breakdown.pricePerDay) })}
                    </span>
                    <span className="font-semibold text-neutral-800"><Price>{formatPrice(totalCost.breakdown.dayCost)}</Price></span>
                </div>
              )}
              
              {totalCost.breakdown.remainingHours > 0 && (
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">
                      {t('bookings:form.hourRate', { hours: totalCost.breakdown.remainingHours, price: formatPrice(totalCost.breakdown.pricePerHour) })}
                    </span>
                    <span className="font-semibold text-neutral-800"><Price>{formatPrice(totalCost.breakdown.hourCost)}</Price></span>
                </div>
              )}
              
              {totalCost.breakdown.days === 0 && totalCost.breakdown.remainingHours === 0 && (
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">{t('bookings:form.hourlyRate')}</span>
                    <span className="font-semibold text-neutral-800">{t('bookings:form.hourlyRateValue', { price: formatPrice(totalCost.breakdown.pricePerHour) })}</span>
                </div>
              )}
            </div>
            
            <div className="pt-3 border-t-2 border-primary-300">
              <div className="flex items-center justify-between mb-2">
                  <span className="text-neutral-700 font-bold text-lg">{t('bookings:form.estimatedTotal')}</span>
                  <span className="text-2xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent" data-testid="estimated-total">
                    <Price>{formatPrice(totalCost.total)}</Price>
                  </span>
              </div>
              
              {/* Advance Payment Info */}
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-green-800">{t('bookings:form.advancePayment40')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">{t('bookings:form.payNowToConfirm')}</span>
                  <span className="text-2xl font-bold text-green-600" data-testid="advance-amount"><Price>{formatPrice(totalCost.advanceAmount)}</Price></span>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  {t('bookings:form.remainingCollectedNote', { amount: formatPrice(totalCost.remainingAmount) })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stripe Payment Element - shown after client secret is created */}
        {clientSecret && stripePromise && (
          <div className="rounded-xl border-2 border-neutral-200 p-5" data-testid="stripe-payment-section">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeAdvanceForm
                formData={formData}
                totalCost={totalCost}
                vehicle={vehicle}
                user={user}
                toast={toast}
                onSuccess={(booking) => {
                  setPaymentDetails({
                    paymentId: booking?.advance_payment?.stripe_payment_id || 'confirmed',
                    amount: totalCost?.advanceAmount || 0,
                    booking: booking
                  });
                  setShowPaymentSuccess(true);
                  setClientSecret(null);
                  toast.success('Payment successful! Your booking is confirmed.');
                  if (onPaymentSuccess) {
                    onPaymentSuccess(booking);
                  }
                  setLoading(false);
                }}
                onError={(msg) => { toast.error(msg); setLoading(false); }}
              />
            </Elements>
          </div>
        )}

        {/* Pay Now Button */}
        <button
          type="button"
          onClick={handleStartPayment}
          disabled={!vehicle?.is_available_for_booking || loading || !totalCost || !!clientSecret}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            vehicle?.is_available_for_booking && !loading && totalCost && !clientSecret
              ? 'bg-linear-to-r from-green-500 to-green-600 text-white hover:shadow-glow transform hover:scale-105 cursor-pointer'
              : 'border-2 border-neutral-300 text-neutral-400 cursor-not-allowed'
          }`}
          data-testid="pay-now-button"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{t('bookings:form.processing')}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{vehicle?.is_available_for_booking && totalCost ? t('bookings:form.payAndBook', { amount: formatPrice(totalCost.advanceAmount) }) : t('bookings:form.notAvailable')}</span>
            </>
          )}
        </button>

        {!isAuthenticated && (
          <p className="text-center text-sm text-neutral-600">
            {t('bookings:form.please')} <a href="/login" className="text-primary-600 font-semibold hover:underline">{t('common:auth.login')}</a> {t('bookings:form.toBookVehicle')}
          </p>
        )}
      </form>

      {/* Payment Success Popup */}
      {showPaymentSuccess && paymentDetails && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/50 z-200 flex items-center justify-center p-4" data-testid="payment-success-modal">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-bounce-in">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              {t('bookings:form.successTitle')}
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {t('bookings:form.successMessage')}
            </p>

            {/* Payment Details */}
            <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('bookings:labels.paymentId')}:</span>
                  <span className="font-medium text-gray-900">{paymentDetails.paymentId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('bookings:labels.amountPaid')}:</span>
                  <span className="font-bold text-green-600"><Price>{formatPrice(paymentDetails.amount)}</Price></span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('bookings:form.vehicle')}</span>
                  <span className="font-medium text-gray-900">{vehicle?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('bookings:form.statusLabel')}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{t('bookings:status.confirmed')}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-lg p-3 mb-6 border border-blue-200">
              <p className="text-sm text-blue-700">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              {t('bookings:form.visitOffice')}
            </p>
            </div>

            {/* Action Button */}
            <button
              onClick={closeSuccessPopup}
              className="w-full py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              data-testid="view-bookings-btn"
            >
              {t('bookings:form.viewMyBookings')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const StripeAdvanceForm = ({ formData, totalCost, vehicle, user, toast, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [confirming, setConfirming] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleConfirm = async () => {
    if (!stripe || !elements) {
      return;
    }

    setConfirming(true);
    setPaymentError(null);

    try {
      const pickupDate = new Date(formData.pickup_datetime);
      const pickupTime = pickupDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: user?.name || '',
              email: user?.email || '',
              phone: user?.phone || ''
            }
          },
          return_url: window.location.origin + '/bookings'
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        setPaymentError(confirmError.message || 'Payment failed');
        onError?.(confirmError.message || 'Payment failed');
        toast.error(confirmError.message || 'Payment failed');
        setConfirming(false);
        return;
      }

      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        setPaymentError('Payment was not completed');
        onError?.('Payment was not completed');
        toast.error('Payment was not completed');
        setConfirming(false);
        return;
      }

      // Payment succeeded - now verify and create booking server-side
      const verifyRes = await fetch(API_ENDPOINTS.stripeVerifyAdvance, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        body: JSON.stringify({
          payment_intent_id: paymentIntent.id,
          vehicle_id: vehicle._id,
          start_location: formData.pickup_location,
          requested_pickup_date: pickupDate.toISOString(),
          requested_pickup_time: pickupTime
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyData.status !== 'success') {
        setPaymentError(verifyData.message || 'Booking could not be confirmed');
        onError?.(verifyData.message || 'Booking could not be confirmed');
        toast.error(verifyData.message || 'Booking could not be confirmed');
        setConfirming(false);
        return;
      }

      onSuccess?.(verifyData.data.booking);
    } catch (error) {
      console.error('Confirm payment error:', error);
      setPaymentError('Something went wrong. Please try again.');
      onError?.('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    }
    setConfirming(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span className="font-semibold text-neutral-800">Secure payment</span>
      </div>
      <PaymentElement options={{ layout: 'tabs' }} />
      {paymentError && (
        <p className="text-sm text-secondary-600">{paymentError}</p>
      )}
      <button
        type="button"
        disabled={!stripe || confirming}
        onClick={handleConfirm}
        className="w-full py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60"
        data-testid="confirm-payment-button"
      >
        {confirming ? 'Processing...' : `Confirm & Pay ${formatPrice(totalCost?.advanceAmount || 0)}`}
      </button>
      <p className="text-xs text-neutral-500">Payments are processed securely by Stripe.</p>
    </div>
  );
};

export default BookingForm;
