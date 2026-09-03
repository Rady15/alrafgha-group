import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import BillModal from './BillModal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../i18n/format';
import Price from '../components/Price';
import { useTranslation } from 'react-i18next';
import CustomDropdown from './common/CustomDropdown';

const PickupModal = ({ booking, onClose, onSuccess }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const { t } = useTranslation('bookings');
    const [formData, setFormData] = useState({
        staff_id: user?.id || '',
        actual_pickup_date: new Date(booking.requested_pickup_date).toISOString().split('T')[0],
        actual_pickup_time: booking.requested_pickup_time,
        odometer_reading_start: '',
        vehicle_plate_number: booking.vehicle_id.registration_number,
        id_proof_type: 'aadhar_card',
        id_number: '',
        pickup_notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showBillModal, setShowBillModal] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    // ID validation patterns and messages
    const idValidators = {
        aadhar_card: {
            pattern: /^[2-9][0-9]{11}$/,
            message: t('bookings:pickup.validators.aadhar_card.message'),
            placeholder: t('bookings:pickup.validators.aadhar_card.placeholder'),
            uppercase: false
        },
        pan_card: {
            pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
            message: t('bookings:pickup.validators.pan_card.message'),
            placeholder: t('bookings:pickup.validators.pan_card.placeholder'),
            uppercase: true
        },
        voter_card: {
            pattern: /^[A-Z]{3}[0-9]{7}$/,
            message: t('bookings:pickup.validators.voter_card.message'),
            placeholder: t('bookings:pickup.validators.voter_card.placeholder'),
            uppercase: true
        },
        driving_license: {
            pattern: /^[A-Z]{2}[0-9]{13}$/,
            message: t('bookings:pickup.validators.driving_license.message'),
            placeholder: t('bookings:pickup.validators.driving_license.placeholder'),
            uppercase: true
        },
        passport: {
            pattern: /^[A-Z][0-9]{7}$/,
            message: t('bookings:pickup.validators.passport.message'),
            placeholder: t('bookings:pickup.validators.passport.placeholder'),
            uppercase: true
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        
        // Apply uppercase normalization for ID number based on ID type
        if (name === 'id_number') {
            const validator = idValidators[formData.id_proof_type];
            if (validator && validator.uppercase) {
                newValue = value.toUpperCase();
            }
        }
        
        setFormData(prev => ({ ...prev, [name]: newValue }));
        
        // Clear errors when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.odometer_reading_start) {
            newErrors.odometer_reading_start = t('bookings:pickup.odometerRequired');
        } else if (isNaN(formData.odometer_reading_start) || formData.odometer_reading_start < 0) {
            newErrors.odometer_reading_start = t('bookings:pickup.odometerInvalid');
        }

        if (!formData.vehicle_plate_number) {
            newErrors.vehicle_plate_number = t('bookings:pickup.vehiclePlateRequired');
        }

        // Dynamic ID number validation based on selected ID type
        if (!formData.id_number) {
            newErrors.id_number = t('bookings:pickup.idNumberRequired');
        } else {
            const validator = idValidators[formData.id_proof_type];
            if (validator) {
                // Apply uppercase if needed before validation
                const valueToValidate = validator.uppercase 
                    ? formData.id_number.toUpperCase() 
                    : formData.id_number;
                
                if (!validator.pattern.test(valueToValidate)) {
                    newErrors.id_number = validator.message;
                }
            } else if (formData.id_number.length < 5) {
                newErrors.id_number = t('bookings:pickup.idNumberMin');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const staffId = user?.id;

            if (!staffId) {
                toast.error(t('bookings:pickup.toastStaffId'));
                return;
            }

            const payload = {
                ...formData,
                staff_id: staffId
            };

            const response = await fetch(API_ENDPOINTS.confirmPickup(booking._id), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.status === 'success') {
                setConfirmedBooking(data.data.booking);
                setShowBillModal(true);
            } else {
                toast.error(data.message || t('bookings:pickup.toastFailed'));
            }
        } catch (error) {
            console.error('Error confirming pickup:', error);
            toast.error(t('bookings:pickup.toastFailedRetry'));
        } finally {
            setLoading(false);
        }
    };

    const handleBillClose = () => {
        setShowBillModal(false);
        onSuccess();
    };

    return (
        <>
            {showBillModal && confirmedBooking && (
                <BillModal 
                    booking={confirmedBooking} 
                    onClose={handleBillClose} 
                />
            )}
            
            <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-150 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{t('bookings:pickup.confirm')} <span className='text-red-600'>{t('bookings:pickup.vehiclePickup')}</span></h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{t('bookings:pickup.bookingDetails')}</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500">{t('bookings:pickup.customer')}</span>
                                <span className="ml-2 font-medium">{booking.user_id.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t('bookings:pickup.vehicle')}</span>
                                <span className="ml-2 font-medium">{booking.vehicle_id.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t('bookings:pickup.package')}</span>
                                <span className="ml-2 font-medium">{booking.package_id?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t('bookings:pickup.rates')}</span>
                                <span className="ml-2 font-medium">
                                    <Price>{formatPrice(booking.package_id?.price_per_hour)}</Price>{t('bookings:units.perHour')} | <Price>{formatPrice(booking.package_id?.price_per_km)}</Price>{t('bookings:units.perKm')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pickup Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('bookings:pickup.pickupDate')}
                                </label>
                            <input
                                type="date"
                                name="actual_pickup_date"
                                value={formData.actual_pickup_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('bookings:pickup.pickupTime')}
                                </label>
                            <input
                                type="time"
                                name="actual_pickup_time"
                                value={formData.actual_pickup_time}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    {/* Odometer Reading */}
                    <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('bookings:pickup.odometerStart')}
                            </label>
                        <input
                            type="number"
                            name="odometer_reading_start"
                            value={formData.odometer_reading_start}
                            onChange={handleChange}
                            placeholder={t('bookings:pickup.odometerStartPlaceholder')}
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.odometer_reading_start ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                }`}
                        />
                        {errors.odometer_reading_start && (
                            <p className="mt-1 text-sm text-red-600">{errors.odometer_reading_start}</p>
                        )}
                    </div>

                    {/* Vehicle Plate Number */}
                    <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('bookings:pickup.vehiclePlateNumber')}
                            </label>
                        <input
                            type="text"
                            name="vehicle_plate_number"
                            value={formData.vehicle_plate_number}
                            onChange={handleChange}
                            placeholder={t('bookings:pickup.vehiclePlatePlaceholder')}
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.vehicle_plate_number ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                }`}
                        />
                        {errors.vehicle_plate_number && (
                            <p className="mt-1 text-sm text-red-600">{errors.vehicle_plate_number}</p>
                        )}
                    </div>

                    {/* ID Proof Type */}
                    <CustomDropdown
                        label={`${t('bookings:pickup.idProofLabel')} *`}
                        options={[
                            { value: 'aadhar_card', label: t('bookings:pickup.idProofOptions.aadhar_card') },
                            { value: 'pan_card', label: t('bookings:pickup.idProofOptions.pan_card') },
                            { value: 'voter_card', label: t('bookings:pickup.idProofOptions.voter_card') },
                            { value: 'driving_license', label: t('bookings:pickup.idProofOptions.driving_license') },
                            { value: 'passport', label: t('bookings:pickup.idProofOptions.passport') },
                        ]}
                        value={formData.id_proof_type}
                        onChange={(val) => handleChange({ target: { name: 'id_proof_type', value: val } })}
                    />

                    {/* ID Number */}
                    <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('bookings:pickup.idNumberLabel')}
                            </label>
                        <input
                            type="text"
                            name="id_number"
                            value={formData.id_number}
                            onChange={handleChange}
                            placeholder={idValidators[formData.id_proof_type]?.placeholder || 'Enter ID number'}
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.id_number ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                }`}
                        />
                        {errors.id_number ? (
                            <p className="mt-1 text-sm text-red-600">{errors.id_number}</p>
                        ) : (
                            <p className="mt-1 text-xs text-gray-500">{idValidators[formData.id_proof_type]?.message}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('bookings:pickup.pickupNotes')}
                            </label>
                        <textarea
                            name="pickup_notes"
                            value={formData.pickup_notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder={t('bookings:pickup.pickupNotesPlaceholder')}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            {t('common:actions.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? t('bookings:pickup.confirming') : t('bookings:pickup.confirmPickup')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default PickupModal;
