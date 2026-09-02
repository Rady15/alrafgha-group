import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { formatDate } from '../i18n/format';
import { useTranslation } from 'react-i18next';

const CancelConfirmationModal = ({ booking, onConfirm, onClose, loading }) => {
    const [cancellationReason, setCancellationReason] = useState('');
    const { t } = useTranslation('bookings');

    if (!booking) return null;

    const handleConfirm = () => {
        if (!cancellationReason.trim()) {
            return; // Validation handled by disabled button
        }
        onConfirm(cancellationReason);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-slideUp" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="border-b border-neutral-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900">{t('common:actions.cancel')} <span className='text-red-500'>{t('bookings:cancel.booking')}</span></h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-all"
                        disabled={loading}
                        data-testid="close-cancel-modal"
                    >
                        <X className="w-5 h-5 text-neutral-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-neutral-700">
                        {t('bookings:cancel.confirmText')}
                    </p>

                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                        <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wide">{t('bookings:details.title')}</p>
                        <p className="font-semibold text-neutral-900 mb-2">{booking.vehicle.name}</p>
                        <p className="text-sm text-neutral-600">
                            {formatDate(booking.pickup_datetime)} at {booking.pickup_time}
                        </p>
                        <p className="text-sm text-neutral-600">
                            {booking.pickup_location}
                        </p>
                    </div>

                    {/* Cancellation Reason */}
                    <div>
                            <label htmlFor="cancellation-reason" className="block text-sm font-medium text-neutral-700 mb-2">
                                {t('bookings:cancel.reasonLabel')} <span className="text-red-500">*</span>
                            </label>
                        <textarea
                            id="cancellation-reason"
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder={t('bookings:cancel.reasonPlaceholder')}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            rows="4"
                            disabled={loading}
                            data-testid="cancellation-reason-input"
                        />
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                            <p className="text-sm text-yellow-800">
                                {t('bookings:cancel.warning')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-neutral-200 p-4">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            data-testid="cancel-modal-no-button"
                        >
                            {t('bookings:cancel.keepBooking')}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading || !cancellationReason.trim()}
                            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            data-testid="cancel-modal-yes-button"
                        >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        {t('bookings:cancel.cancelling')}
                                    </span>
                                ) : (
                                    t('bookings:cancel.yesCancel')
                                )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelConfirmationModal;
