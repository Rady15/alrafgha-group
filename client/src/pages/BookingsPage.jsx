import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS, getAuthHeader } from '../config/api';
import BookingDetailsModal from '../components/BookingDetailsModal';
import CancelConfirmationModal from '../components/CancelConfirmationModal';
import { useToast } from '../contexts/ToastContext';
import { formatPrice, formatDate, formatDateTime } from '../i18n/format';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const BookingsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Final (remaining) online payment state
  const [payBooking, setPayBooking] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Get user ID from AuthContext
      const userId = user?._id || user?.id;

      if (!userId) {
        console.log('No user ID found');
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.userBookings(userId), {
        credentials: 'include',
        headers: {
          ...getAuthHeader()
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch bookings:', response.status, response.statusText);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Bookings data:', data);

      if (data.status === 'success') {
        // Transform backend data to match frontend structure
        const transformedBookings = data.data.bookings.map(booking => ({
          _id: booking._id,
          bill_id: booking.bill_id,
          vehicle: {
            _id: booking.vehicle_id._id,
            name: booking.vehicle_id.name,
            type: booking.vehicle_id.type,
            images: booking.vehicle_id.images,
            registration_number: booking.vehicle_id.registration_number,
            model_name: booking.vehicle_id.model_name,
            cc_engine: booking.vehicle_id.cc_engine
          },
          vehicle_id: booking.vehicle_id, // Keep original for bill modal
          user_id: booking.user_id, // Include user details for bill
          pickup_location: booking.start_location,
          start_location: booking.start_location, // Keep original field name
          pickup_datetime: booking.requested_pickup_date,
          pickup_time: booking.requested_pickup_time,
          return_datetime: booking.return_details?.actual_return_date || null,
          total_cost: booking.final_cost || 0,
          final_cost: booking.final_cost,
          status: mapBackendStatus(booking.status),
          payment_status: booking.payment_status,
          pickup_details: booking.pickup_details,
          return_details: booking.return_details,
          rejection_reason: booking.rejection_reason || null,
          advance_payment: booking.advance_payment,
          final_payment: booking.final_payment,
          // Cancellation and refund tracking
          cancellation_reason: booking.cancellation_reason || null,
          cancelled_by: booking.cancelled_by || null,
          cancelled_at: booking.cancelled_at || null,
          refund_status: booking.refund_status || 'not_applicable',
          refund_amount: booking.refund_amount || 0,
          refund_marked_at: booking.refund_marked_at || null,
          // Additional fields for bill display
          distance_traveled_km: booking.distance_traveled_km,
          duration_hours: booking.duration_hours,
          cost_per_distance: booking.cost_per_distance,
          cost_per_time: booking.cost_per_time,
          damage_cost: booking.damage_cost
        }));

        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Is this booking still owed money (customer pays remaining online)?
  const remainingDue = (booking) => {
    if (booking.payment_status !== 'partial') return 0;
    const adv = booking.advance_payment?.amount || 0;
    const fin = booking.final_cost || booking.total_cost || 0;
    return Math.max(0, Math.round((fin - adv) * 100) / 100);
  };

  const handleOpenFinalPayment = async (booking) => {
    const due = remainingDue(booking);
    if (due <= 0) {
      showToast(t('bookings:return.noRemainingAmount') || 'No remaining balance', 'info');
      return;
    }
    setPayBooking(booking);
    setPayLoading(true);
    try {
      const configRes = await fetch(API_ENDPOINTS.stripeConfig, { credentials: 'include' });
      const configData = await configRes.json();
      const pk = configData.data?.publishable_key || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!pk) {
        showToast(t('bookings:return.paymentGatewayFailed') || 'Payment gateway unavailable', 'error');
        setPayLoading(false);
        return;
      }
      const intentRes = await fetch(API_ENDPOINTS.stripeCreateFinalIntent, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ booking_id: booking._id, final_amount: booking.final_cost || booking.total_cost, advance_paid: booking.advance_payment?.amount || 0 })
      });
      const intentData = await intentRes.json();
      if (intentData.status !== 'success') {
        showToast(intentData.message || 'Failed to start payment', 'error');
        setPayLoading(false);
        return;
      }
      setClientSecret(intentData.data.client_secret);
      setStripePromise(loadStripe(pk));
    } catch (e) {
      console.error('Final payment start error:', e);
      showToast(t('bookings:return.somethingWentWrong') || 'Something went wrong', 'error');
    } finally {
      setPayLoading(false);
    }
  };

  const handlePaySuccess = useCallback(async () => {
    setClientSecret(null);
    showToast('Payment received successfully', 'success');
    setPayBooking(null);
    await fetchBookings();
  }, [showToast]);

  // Map backend status to frontend status
  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      'booking_requested': 'pending',
      'picked_up': 'confirmed',
      'returned': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-accent-100 text-accent-700';
      case 'cancelled': return 'bg-neutral-100 text-neutral-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'unpaid': return 'bg-secondary-100 text-secondary-700';
      case 'refunded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelBooking = async (cancellationReason) => {
    if (!selectedBooking) return;

    setCancelLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.bookings}/${selectedBooking._id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ cancellation_reason: cancellationReason }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        showToast(data.message || t('bookings:toast.bookingCancelled'), 'success');
        setShowCancelModal(false);
        setSelectedBooking(null);
        // Refresh bookings list
        fetchBookings();
      } else {
        showToast(data.message || t('bookings:toast.cancelFailed'), 'error');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showToast(t('bookings:toast.cancelError'), 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-2">
            {t('bookings:page.my')} <span className='text-red-500'>{t('common:nav.bookings')}</span>
          </h1>
          <p className="text-lg text-neutral-600">
            {t('bookings:page.subtitle')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white border border-primary-200 rounded-2xl shadow-card p-2 mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max sm:min-w-0">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                 className={`px-4 sm:px-6 py-2.5 rounded-xl font-medium text-sm sm:text-base capitalize transition-all duration-200 whitespace-nowrap ${filter === status
                   ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                   : 'text-neutral-700 sm:underline underline-offset-2 decoration-4 decoration-red-200 hover:bg-neutral-100 no-underline'
                   }`}
                >
                  {t(`bookings:status.${status}`)}
                </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Vehicle Image */}
                    <div className="lg:w-64 h-48 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={booking.vehicle.images[0]}
                        alt={booking.vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2 truncate">
                            {booking.vehicle.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-block px-3 py-1 bg-linear-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full font-semibold capitalize">
                              {booking.vehicle.type}
                            </span>
                            {booking.vehicle.registration_number && booking.status === 'confirmed' && (
                                <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full font-semibold">
                                  {t('bookings:labels.rc')}: {booking.vehicle.registration_number}
                                </span>
                            )}
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <div className="text-sm text-neutral-600 mb-1">
                            {t(`bookings:summary.${booking.status === 'completed' ? 'finalAmount' : 'advancePayment'}`)}
                          </div>
                          <div className="text-xl sm:text-2xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            {booking.status === 'completed' ? formatPrice(booking.total_cost) : formatPrice(booking.advance_payment?.amount || 0)}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-semibold text-neutral-700 mb-1">{t('bookings:labels.pickupLocation')}</div>
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <div>
                              <div className="text-neutral-900 font-medium">{booking.pickup_location}</div>
                              <div className="text-sm text-neutral-600">
                                {formatDate(booking.pickup_datetime)} {booking.pickup_time}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-neutral-700 mb-1">{t('bookings:labels.returnDate')}</div>
                          <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-secondary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              {booking.status === 'cancelled' ? (
                                <div className="text-sm text-neutral-600">{t('bookings:status.cancelled')}</div>
                              ) : booking.return_datetime ? (
                                <div className="text-sm text-neutral-600">{formatDateTime(booking.return_datetime)}</div>
                              ) : (
                                <div className="text-sm text-neutral-600">{t('bookings:status.pending')}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.status)}`}>
                          {t(`bookings:status.${booking.status}`)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="px-5 py-2 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-200"
                          data-testid="view-details-button"
                        >
                          {t('bookings:actions.viewDetails')}
                        </button>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelClick(booking)}
                            className="px-5 py-2 border-2 border-secondary-500 text-secondary-600 rounded-lg font-semibold hover:bg-secondary-50 transition-all duration-200"
                            data-testid="cancel-booking-button"
                          >
                            {t('bookings:actions.cancelBooking')}
                          </button>
                        )}
                        {remainingDue(booking) > 0 && (
                          <button
                            onClick={() => handleOpenFinalPayment(booking)}
                            disabled={payLoading}
                            className="px-5 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-testid="pay-remaining-button"
                          >
                            {t('bookings:actions.payRemaining') || 'Pay Balance'} · {formatPrice(remainingDue(booking))}
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <Link to={`/vehicles/${booking.vehicle._id}`}>
                              <button className="px-5 py-2 border-2 border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200">
                                {t('bookings:actions.bookAgain')}
                              </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-30 bg-white rounded-2xl shadow-card">
            <div className="inline-block p-8 bg-neutral-100 rounded-full mb-4">
              <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">{t('bookings:empty.title')}</h3>
            <p className="text-neutral-600 mb-6">
              {filter === 'all'
                ? t('bookings:empty.allMessage')
                : t('bookings:empty.filteredMessage', { filter: t(`bookings:status.${filter}`) })}
            </p>
            <Link
              to="/vehicles"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transform hover:scale-105 transition-all duration-200"
            >
              <span>{t('bookings:empty.browseVehicles')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={closeDetailsModal}
        />
      )}

      {showCancelModal && (
        <CancelConfirmationModal
          booking={selectedBooking}
          onConfirm={handleCancelBooking}
          onClose={closeCancelModal}
          loading={cancelLoading}
        />
      )}

      {payBooking && clientSecret && stripePromise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPayBooking(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900">{t('bookings:return.payViaMada') || 'Pay Remaining Balance'}</h3>
              <button
                onClick={() => setPayBooking(null)}
                className="text-neutral-400 hover:text-neutral-600 text-2xl leading-none"
                aria-label="close"
              >×</button>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              {payBooking.vehicle.name} — {t('bookings:summary.finalAmount') || 'Final amount'}: {formatPrice(remainingDue(payBooking))}
            </p>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <RemainingPaymentForm amount={remainingDue(payBooking)} onSuccess={handlePaySuccess} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

const RemainingPaymentForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [confirming, setConfirming] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const { t } = useTranslation('bookings');

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setConfirming(true);
    setPaymentError(null);
    const { error } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if (error) {
      setPaymentError(error.message);
      setConfirming(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="space-y-3">
      <PaymentElement options={{ layout: 'tabs' }} />
      {paymentError && <p className="text-sm text-red-600">{paymentError}</p>}
      <button
        onClick={handleConfirm}
        disabled={confirming || !stripe || !elements}
        className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="confirm-remaining-payment-button"
      >
        {confirming ? (t('bookings:form.processing') || 'Processing...') : (t('bookings:return.payViaMada', { amount: formatPrice(amount) }) || `Pay ${formatPrice(amount)}`)}
      </button>
    </div>
  );
};

export default BookingsPage;
