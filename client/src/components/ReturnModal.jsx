import { useState, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../i18n/format';
import Price from '../components/Price';
import { useTranslation } from 'react-i18next';
import CustomDropdown from './common/CustomDropdown';
import FinalBillModal from './FinalBillModal';
import PaymentSuccessModal from './PaymentSuccessModal';

const ReturnModal = ({ booking, onClose, onSuccess }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const { t } = useTranslation('bookings');
    const [showFinalBill, setShowFinalBill] = useState(false);
    const [completedBooking, setCompletedBooking] = useState(null);
    const [formData, setFormData] = useState({
        staff_id: user?.id || '',
        actual_return_date: new Date().toISOString().split('T')[0], // input expects YYYY-MM-DD
        actual_return_time: new Date().toTimeString().slice(0, 5),   // HH:MM 24h
        odometer_reading_end: '',
        vehicle_plate_number: booking.vehicle_id?.registration_number || '',
        engine_number: booking.vehicle_id?.engine_number || '',
        chassis_number: booking.vehicle_id?.chassis_number || '',
        vehicle_condition: 'perfect',
        damage_cost: 0,
        damage_description: '',
        return_notes: '',
        payment_done: false,
        amount_paid: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [costBreakdown, setCostBreakdown] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'online'
    const [cashPaymentConfirmed, setCashPaymentConfirmed] = useState(false);
    const [onlinePaymentCompleted, setOnlinePaymentCompleted] = useState(false);
    const [onlinePaymentDetails, setOnlinePaymentDetails] = useState(null);
    const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

    // Get advance payment amount from booking
    const advancePaid = booking?.advance_payment?.amount || 0;

    // ---- Local Date/Time Parsing Utilities (supports DD/MM/YYYY and YYYY-MM-DD and MM/DD/YYYY) ----
    const parseTimeString = (t) => {
        if (!t || typeof t !== 'string') return null;
        const s = t.trim().toUpperCase();
        const ampmMatch = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
        if (ampmMatch) {
            let h = parseInt(ampmMatch[1], 10);
            const m = parseInt(ampmMatch[2], 10);
            const mod = ampmMatch[3];
            if (mod === 'PM' && h !== 12) h += 12;
            if (mod === 'AM' && h === 12) h = 0;
            return { hours: h, minutes: m };
        }
        const hhmm = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
        if (hhmm) return { hours: parseInt(hhmm[1], 10), minutes: parseInt(hhmm[2], 10) };
        return null;
    };

    const parseDateStringLocal = (s) => {
        if (!s || typeof s !== 'string') return null;
        const str = s.trim();
        // Case: YYYY-MM-DD
        const ymd = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (ymd) {
            const y = parseInt(ymd[1], 10);
            const m = parseInt(ymd[2], 10) - 1;
            const d = parseInt(ymd[3], 10);
            return new Date(y, m, d);
        }
        // Case: ISO with time
        if (str.includes('T')) {
            const iso = new Date(str);
            if (!isNaN(iso)) {
                // convert to local date parts (avoid UTC shifting when we later set time)
                return new Date(iso.getFullYear(), iso.getMonth(), iso.getDate());
            }
        }
        // Case: D/M/YYYY or M/D/YYYY with heuristic
        const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (dmy) {
            let a = parseInt(dmy[1], 10);
            let b = parseInt(dmy[2], 10);
            const y = parseInt(dmy[3], 10);
            let day, month;
            if (a > 12 && b <= 12) {
                day = a; month = b;
            } else if (b > 12 && a <= 12) {
                day = b; month = a;
            } else {
                day = a; month = b;
            }
            return new Date(y, month - 1, day);
        }
        const nat = new Date(str);
        return isNaN(nat) ? null : nat;
    };

    const combineLocalDateAndTime = (dateOnly, timeStr) => {
        const t = parseTimeString(timeStr);
        if (!dateOnly) return null;
        const base = new Date(dateOnly.getFullYear(), dateOnly.getMonth(), dateOnly.getDate());
        if (t) {
            base.setHours(t.hours, t.minutes, 0, 0);
        } else {
            // If time not parsable, keep 00:00
            base.setHours(0, 0, 0, 0);
        }
        return base;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Calculate cost preview when odometer reading, return date, or return time changes
        if (name === 'odometer_reading_end' && value && booking.pickup_details) {
            calculateCostPreview(value);
        } else if ((name === 'actual_return_date' || name === 'actual_return_time') && formData.odometer_reading_end) {
            const updatedFormData = { ...formData, [name]: value };
            calculateCostPreviewWithFormData(formData.odometer_reading_end, updatedFormData);
        } else if ((name === 'damage_cost' || name === 'vehicle_condition') && formData.odometer_reading_end) {
            const updatedFormData = { ...formData, [name]: value };
            calculateCostPreviewWithFormData(formData.odometer_reading_end, updatedFormData);
        }
    };

    const calculateCostPreviewWithFormData = (odometerEndParam, currentFormData) => {
        const odometerEnd = Number(odometerEndParam);
        const odometerStart = Number(booking.pickup_details.odometer_reading_start);
        if (Number.isNaN(odometerEnd) || Number.isNaN(odometerStart)) {
            console.error('Invalid odometer values', { odometerEndParam, start: booking.pickup_details.odometer_reading_start });
            return;
        }
        const distanceTraveled = odometerEnd - odometerStart;
        if (distanceTraveled < 0) {
            console.error('End odometer less than start', { odometerEnd, odometerStart });
            return;
        }

        const rawPickupDate = booking?.pickup_details?.actual_pickup_date || booking?.requested_pickup_date;
        const rawPickupTime = booking?.pickup_details?.actual_pickup_time || booking?.requested_pickup_time || '';

        const pickupDateOnly = parseDateStringLocal(typeof rawPickupDate === 'string' ? rawPickupDate : '');
        if (!pickupDateOnly) {
            console.error('Invalid pickup date', rawPickupDate);
            return;
        }
        const pickupDateObj = combineLocalDateAndTime(pickupDateOnly, rawPickupTime) || pickupDateOnly;

        // Return date/time from form (HTML date input gives YYYY-MM-DD)
        const returnDateOnly = parseDateStringLocal(currentFormData.actual_return_date);
        const returnDateObj = combineLocalDateAndTime(returnDateOnly, currentFormData.actual_return_time);
        if (!returnDateObj || isNaN(returnDateObj.getTime())) {
            console.error('Invalid return date/time', currentFormData.actual_return_date, currentFormData.actual_return_time);
            return;
        }

        // Difference in minutes using local times
        let msDiff = returnDateObj.getTime() - pickupDateObj.getTime();
        if (msDiff < 0) {
            console.warn('Return time is before pickup time; setting duration to 0 for preview');
            msDiff = 0;
        }
        const minutes = Math.round(msDiff / 60000);
        const durationHoursExact = minutes / 60;
        const durationH = Math.floor(minutes / 60);
        const durationM = minutes % 60;

        const pricePerKm = parseFloat(booking?.package_id?.price_per_km) || 0;
        const pricePerHour = parseFloat(booking?.package_id?.price_per_hour) || 0;
        const costPerDistance = distanceTraveled * pricePerKm;
        const costPerTime = durationHoursExact * pricePerHour; // time-based pricing
        const maxCost = Math.max(costPerDistance, costPerTime);
        const damageCost = parseFloat(currentFormData.damage_cost || 0) || 0;
        const totalCost = maxCost + damageCost;
        
        // Calculate remaining amount after advance payment
        const remainingAmount = Math.max(0, totalCost - advancePaid);

        setCostBreakdown({
            distanceTraveled,
            durationHoursExact,
            durationH,
            durationM,
            costPerDistance,
            costPerTime,
            maxCost,
            damageCost,
            totalCost,
            advancePaid,
            remainingAmount
        });
    };

    const calculateCostPreview = (odometerEndParam) => {
        calculateCostPreviewWithFormData(odometerEndParam, formData);
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.odometer_reading_end) {
            newErrors.odometer_reading_end = 'Odometer reading is required';
        } else if (isNaN(formData.odometer_reading_end) || (booking.pickup_details && formData.odometer_reading_end < booking.pickup_details.odometer_reading_start)) {
            newErrors.odometer_reading_end = t('bookings:return.odometerInvalid');
        }

        if (!formData.vehicle_plate_number) {
            newErrors.vehicle_plate_number = 'Vehicle plate number is required';
        }

        if (!formData.engine_number) {
            newErrors.engine_number = t('bookings:return.engineRequired');
        }

        if (!formData.chassis_number) {
            newErrors.chassis_number = t('bookings:return.chassisRequired');
        }

        if (formData.vehicle_condition === 'damaged' && !formData.damage_description) {
            newErrors.damage_description = t('bookings:return.damageDescriptionRequired');
        }

        // Payment validation
        if (paymentMethod === 'cash') {
            if (!cashPaymentConfirmed) {
                newErrors.payment_confirmation = t('bookings:return.paymentConfirmationRequired');
            }
        } else if (paymentMethod === 'online') {
            if (!onlinePaymentCompleted && costBreakdown && costBreakdown.remainingAmount > 0) {
                newErrors.payment_confirmation = t('bookings:return.paymentConfirmationOnline');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle payment success modal close - auto submit the return form
    const handlePaymentSuccessClose = useCallback(async () => {
        setShowPaymentSuccessModal(false);
        toast.success(t('bookings:return.paymentCollected'));
        
        // Auto-submit the return form after a brief delay
        setTimeout(async () => {
            setLoading(true);
            try {
                const staffId = user?.id;
                if (!staffId) {
                    toast.error(t('bookings:return.toastStaffId'));
                    setLoading(false);
                    return;
                }

                const payload = {
                    ...formData,
                    staff_id: staffId,
                    payment_done: true,
                    amount_paid: costBreakdown ? costBreakdown.totalCost : 0,
                    payment_mode: paymentMethod  // Add payment mode to the payload
                };

                const response = await fetch(API_ENDPOINTS.confirmReturn(booking._id), {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.status === 'success') {
                    toast.success(t('bookings:return.returnConfirmed', { amount: formatPrice(data.data.booking.final_cost) }));
                    // Show the final bill modal with the completed booking data
                    setCompletedBooking(data.data.booking);
                    setShowFinalBill(true);
                } else {
                    toast.error(data.message || t('bookings:return.failedConfirmReturn'));
                }
            } catch (error) {
                console.error('Error confirming return:', error);
                toast.error(t('bookings:return.failedConfirmReturnRetry'));
            } finally {
                setLoading(false);
            }
        }, 500);
    }, [user, formData, costBreakdown, booking._id, paymentMethod, t, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const staffId = user?.id;
            if (!staffId) {
                toast.error(t('bookings:return.toastStaffId'));
                return;
            }

            const payload = {
                ...formData,
                staff_id: staffId,
                payment_done: paymentMethod === 'cash' ? cashPaymentConfirmed : onlinePaymentCompleted,
                amount_paid: costBreakdown ? (paymentMethod === 'cash' ? costBreakdown.totalCost : costBreakdown.advancePaid) : 0,
                payment_mode: paymentMethod  // Add payment mode to the payload
            };

            const response = await fetch(API_ENDPOINTS.confirmReturn(booking._id), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.status === 'success') {
                toast.success(t('bookings:return.returnConfirmed', { amount: formatPrice(data.data.booking.final_cost) }));
                // Show the final bill modal with the completed booking data
                setCompletedBooking(data.data.booking);
                setShowFinalBill(true);
            } else {
                toast.error(data.message || t('bookings:return.failedConfirmReturn'));
            }
        } catch (error) {
            console.error('Error confirming return:', error);
            toast.error(t('bookings:return.failedConfirmReturnRetry'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-150 flex items-center justify-center p-4" data-testid="return-modal-overlay">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" data-testid="return-modal">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{t('bookings:return.verify')} <span className='text-red-600'>{t('bookings:return.vehicleReturn')}</span></h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        data-testid="return-modal-close-button"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6" data-testid="return-form">
                    {/* Booking & Pickup Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">{t('bookings:return.bookingInfo')}</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500">{t('bookings:return.customer')}</span>
                                <span className="ml-2 font-medium">{booking.user_id?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t('bookings:return.vehicle')}</span>
                                <span className="ml-2 font-medium">{booking.vehicle_id?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">{t('bookings:return.pickupOdometer')}</span>
                                <span className="ml-2 font-medium">{booking.pickup_details?.odometer_reading_start} km</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Govt. ID Proof:</span>
                                <span className="ml-2 font-medium">{booking.pickup_details?.id_proof_type?.replace('_', ' ').toUpperCase()}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">ID Number:</span>
                                <span className="ml-2 font-medium">{booking.pickup_details?.id_number || 'N/A'}</span>
                            </div>
                            {advancePaid > 0 && (
                                <div>
                                    <span className="text-gray-500">{t('bookings:return.advancePaid')}</span>
                                    <span className="ml-2 font-medium text-green-600"><Price>{formatPrice(advancePaid)}</Price></span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Return Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('bookings:return.returnDate')}
                                </label>
                            <input
                                type="date"
                                name="actual_return_date"
                                value={formData.actual_return_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                data-testid="return-date-input"
                            />
                        </div>
                        <div>
                                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('bookings:return.returnTime')}
                                </label>
                            <input
                                type="time"
                                name="actual_return_time"
                                value={formData.actual_return_time}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                data-testid="return-time-input"
                            />
                        </div>
                    </div>

                    {/* Odometer Reading */}
                    <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('bookings:return.odometerEnd')}
                            </label>
                        <input
                            type="number"
                            name="odometer_reading_end"
                            value={formData.odometer_reading_end}
                            onChange={handleChange}
                            placeholder="Enter current odometer reading in km"
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.odometer_reading_end ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                }`}
                            data-testid="odometer-end-input"
                        />
                        {errors.odometer_reading_end && (
                            <p className="mt-1 text-sm text-red-600" data-testid="odometer-end-error">{errors.odometer_reading_end}</p>
                        )}
                    </div>

                    {/* Vehicle Verification */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Vehicle Verification</h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('bookings:return.vehiclePlateNumber')}
                                    </label>
                                <input
                                    type="text"
                                    name="vehicle_plate_number"
                                    value={formData.vehicle_plate_number}
                                    onChange={handleChange}
                                    placeholder="Enter vehicle plate number"
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.vehicle_plate_number ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                        }`}
                                    data-testid="vehicle-plate-input"
                                />
                                {errors.vehicle_plate_number && (
                                    <p className="mt-1 text-sm text-red-600" data-testid="vehicle-plate-error">{errors.vehicle_plate_number}</p>
                                )}
                            </div>

                            <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('bookings:return.engineNumber')}
                                    </label>
                                <input
                                    type="text"
                                    name="engine_number"
                                    value={formData.engine_number}
                                    onChange={handleChange}
                                    placeholder={t('bookings:return.enginePlaceholder')}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.engine_number ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                        }`}
                                    data-testid="engine-number-input"
                                />
                                {errors.engine_number && (
                                    <p className="mt-1 text-sm text-red-600" data-testid="engine-number-error">{errors.engine_number}</p>
                                )}
                            </div>

                            <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('bookings:return.chassisNumber')}
                                    </label>
                                <input
                                    type="text"
                                    name="chassis_number"
                                    value={formData.chassis_number}
                                    onChange={handleChange}
                                    placeholder={t('bookings:return.chassisPlaceholder')}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.chassis_number ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                                        }`}
                                    data-testid="chassis-number-input"
                                />
                                {errors.chassis_number && (
                                    <p className="mt-1 text-sm text-red-600" data-testid="chassis-number-error">{errors.chassis_number}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Condition */}
                    <CustomDropdown
                        label={t('bookings:return.vehicleCondition')}
                        options={[
                            { value: 'perfect', label: t('bookings:return.conditionPerfect') },
                            { value: 'damaged', label: t('bookings:return.conditionDamaged') }
                        ]}
                        value={formData.vehicle_condition}
                        onChange={(val) => handleChange({ target: { name: 'vehicle_condition', value: val } })}
                    />

                    {/* Damage Details (conditional) */}
                    {formData.vehicle_condition === 'damaged' && (
                        <div className="space-y-4 bg-red-50 p-4 rounded-lg">
                            <div>
                                    <label className="block text-sm font-semibold text-red-700 mb-2">
                                        {t('bookings:return.damageCostLabel')} *
                                    </label>
                                <input
                                    type="number"
                                    name="damage_cost"
                                    value={formData.damage_cost}
                                    onChange={handleChange}
                                    placeholder={t('bookings:return.damageCostPlaceholder')}
                                    className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    data-testid="damage-cost-input"
                                />
                            </div>

                            <div>
                                    <label className="block text-sm font-semibold text-red-700 mb-2">
                                        {t('bookings:return.damageDescription')}
                                    </label>
                                <textarea
                                    name="damage_description"
                                    value={formData.damage_description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder={t('bookings:return.damageDescriptionPlaceholder')}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.damage_description ? 'border-red-500' : 'border-red-300 focus:border-red-500'
                                        }`}
                                    data-testid="damage-description-textarea"
                                />
                                {errors.damage_description && (
                                    <p className="mt-1 text-sm text-red-600" data-testid="damage-description-error">{errors.damage_description}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Return Notes */}
                    <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('bookings:return.returnNotes')}
                            </label>
                        <textarea
                            name="return_notes"
                            value={formData.return_notes}
                            onChange={handleChange}
                            rows="2"
                            placeholder={t('bookings:return.returnNotesPlaceholder')}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            data-testid="return-notes-textarea"
                        />
                    </div>

                    {/* Cost Breakdown */}
                    {costBreakdown && (
                        <div className="bg-green-50 rounded-lg p-4" data-testid="cost-breakdown">
                            <h3 className="font-semibold text-green-900 mb-3">{t('bookings:labels.costBreakdown')}</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-green-700">{t('bookings:return.distanceTraveled')}</span>
                                    <span className="font-medium" data-testid="distance-traveled">{t('bookings:units.km', { km: costBreakdown.distanceTraveled })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">{t('bookings:return.duration')}</span>
                                    <span className="font-medium" data-testid="duration-display">{t('bookings:units.hr', { hr: costBreakdown.durationH })} {t('bookings:units.min', { min: costBreakdown.durationM })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">{t('bookings:return.costDistanceBased')}</span>
                                    <span className="font-medium" data-testid="cost-distance"><Price>{formatPrice(costBreakdown.costPerDistance)}</Price></span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">{t('bookings:return.costTimeBased')}</span>
                                    <span className="font-medium" data-testid="cost-time"><Price>{formatPrice(costBreakdown.costPerTime)}</Price></span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">{t('bookings:return.maxCost')}</span>
                                    <span className="font-medium" data-testid="max-cost"><Price>{formatPrice(costBreakdown.maxCost)}</Price></span>
                                </div>
                                {costBreakdown.damageCost > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span>{t('bookings:details.damageCost')}</span>
                                        <span className="font-medium" data-testid="damage-cost"><Price>{formatPrice(costBreakdown.damageCost)}</Price></span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-green-900 pt-2 border-t-2 border-green-200">
                                    <span>{t('bookings:return.totalAmount')}</span>
                                    <span data-testid="total-amount"><Price>{formatPrice(costBreakdown.totalCost)}</Price></span>
                                </div>
                                
                                {/* Advance Payment Info */}
                                {costBreakdown.advancePaid > 0 && (
                                    <>
                                        <div className="flex justify-between pt-2 border-t border-green-200">
                                            <span className="text-green-700">{t('bookings:return.advancePaid')}</span>
                                            <span className="font-medium text-green-600" data-testid="advance-paid">- <Price>{formatPrice(costBreakdown.advancePaid)}</Price></span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-blue-900 pt-2 border-t-2 border-blue-300 bg-blue-50 -mx-4 px-4 py-2">
                                            <span>{t('bookings:return.remainingToCollect')}</span>
                                            <span data-testid="remaining-amount"><Price>{formatPrice(costBreakdown.remainingAmount)}</Price></span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Method Section */}
                    <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-300">
                        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {t('bookings:return.paymentMethod')}
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Payment Method Selection */}
                            <div className="space-y-3">
                                {/* Cash Payment Option */}
                                <div 
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                        paymentMethod === 'cash' 
                                            ? 'border-green-500 bg-green-50' 
                                            : 'border-gray-300 bg-white hover:border-green-300'
                                    }`}
                                    onClick={() => {
                                        setPaymentMethod('cash');
                                        setOnlinePaymentCompleted(false);
                                        setOnlinePaymentDetails(null);
                                    }}
                                    data-testid="cash-payment-option"
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="payment_cash"
                                            name="payment_method"
                                            value="cash"
                                            checked={paymentMethod === 'cash'}
                                            onChange={(e) => {
                                                setPaymentMethod(e.target.value);
                                                setOnlinePaymentCompleted(false);
                                                setOnlinePaymentDetails(null);
                                            }}
                                            className="w-5 h-5 text-green-600 border-2 border-gray-300 focus:ring-2 focus:ring-green-500"
                                        />
                                        <label htmlFor="payment_cash" className="ml-3 flex items-center cursor-pointer">
                                            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="text-base font-semibold text-gray-900">{t('bookings:return.cashPayment')}</span>
                                        </label>
                                    </div>
                                    
                                    {/* Cash Payment Confirmation */}
                                    {paymentMethod === 'cash' && (
                                        <div className="mt-4 ml-8 pl-4 border-l-2 border-green-400">
                                            <div className="flex items-start">
                                                <input
                                                    type="checkbox"
                                                    id="cash_payment_confirmed"
                                                    checked={cashPaymentConfirmed}
                                                    onChange={(e) => setCashPaymentConfirmed(e.target.checked)}
                                                    className="mt-1 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                                                    data-testid="cash-payment-confirmation-checkbox"
                                                />
                                                <label htmlFor="cash_payment_confirmed" className="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                                                    {t('bookings:return.cashConfirm', { amount: formatPrice(costBreakdown ? costBreakdown.remainingAmount : 0) })}
                                                </label>
                                            </div>
                                            {errors.payment_confirmation && paymentMethod === 'cash' && (
                                                <p className="mt-2 text-sm text-red-600" data-testid="payment-confirmation-error">
                                                    {errors.payment_confirmation}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Online Payment Option */}
                                <div 
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                        paymentMethod === 'online' 
                                            ? 'border-purple-500 bg-purple-50' 
                                            : 'border-gray-300 bg-white hover:border-purple-300'
                                    }`}
                                    onClick={() => {
                                        setPaymentMethod('online');
                                        setCashPaymentConfirmed(false);
                                    }}
                                    data-testid="online-payment-option"
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="payment_online"
                                            name="payment_method"
                                            value="online"
                                            checked={paymentMethod === 'online'}
                                            onChange={(e) => {
                                                setPaymentMethod(e.target.value);
                                                setCashPaymentConfirmed(false);
                                            }}
                                            className="w-5 h-5 text-purple-600 border-2 border-gray-300 focus:ring-2 focus:ring-purple-500"
                                        />
                                        <label htmlFor="payment_online" className="ml-3 flex items-center cursor-pointer">
                                            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span className="text-base font-semibold text-gray-900">{t('bookings:return.onlinePayment')}</span>
                                        </label>
                                    </div>
                                    
                                    {/* Online Payment Section */}
                                    {paymentMethod === 'online' && (
                                        <div className="mt-4 ml-8 pl-4 border-l-2 border-purple-400">
                                            <div className="space-y-3 rounded-xl border-2 border-neutral-200 p-4 bg-purple-50">
                                                <p className="text-sm font-semibold text-purple-800">
                                                    {t('bookings:return.customerPaysOnlineNote', { amount: formatPrice(costBreakdown ? costBreakdown.remainingAmount : 0) })}
                                                </p>
                                                <p className="text-sm text-purple-700">
                                                    {t('bookings:return.customerPaysOnlineHint')}
                                                </p>
                                                <label className="flex items-start space-x-2 text-sm text-neutral-700 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={onlinePaymentCompleted}
                                                        onChange={(e) => setOnlinePaymentCompleted(e.target.checked)}
                                                        className="mt-0.5 h-4 w-4 accent-purple-600"
                                                        data-testid="online-notice-confirm"
                                                    />
                                                    <span>{t('bookings:return.customerPaysOnlineConfirm')}</span>
                                                </label>
                                                {errors.payment_confirmation && paymentMethod === 'online' && (
                                                    <p className="text-sm text-red-600" data-testid="payment-confirmation-error">
                                                        {errors.payment_confirmation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Amount Display */}
                            {costBreakdown && (
                                <div className="bg-white rounded-lg p-3 border-2 border-blue-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">{t('bookings:return.amountToBeCollected')}</span>
                                        <span className="text-xl font-bold text-blue-900"><Price>{formatPrice(costBreakdown.remainingAmount)}</Price></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            data-testid="cancel-return-button"
                        >
                            {t('common:actions.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !costBreakdown || (paymentMethod === 'cash' && !cashPaymentConfirmed) || (paymentMethod === 'online' && !onlinePaymentCompleted)}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            data-testid="confirm-return-submit-button"
                        >
                            {loading ? t('bookings:return.confirming') : t('bookings:return.confirmReturn')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Payment Success Modal - shown after successful Stripe payment */}
            {showPaymentSuccessModal && onlinePaymentDetails && (
                <PaymentSuccessModal
                    paymentDetails={onlinePaymentDetails}
                    onClose={handlePaymentSuccessClose}
                    autoCloseDelay={3000}
                />
            )}

            {/* Final Bill Modal - shown after successful return */}
            {showFinalBill && completedBooking && (
                <FinalBillModal
                    booking={completedBooking}
                    onClose={() => {
                        setShowFinalBill(false);
                        setCompletedBooking(null);
                        onSuccess();
                    }}
                />
            )}
        </div>
    );
};

export default ReturnModal;
