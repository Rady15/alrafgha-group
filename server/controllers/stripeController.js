let stripe = null;

const getStripeInstance = () => {
    if (!stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new AppError('Stripe not configured', 503);
        }
        stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
};

const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Vehicle = require('../models/Vehicle');
const Package = require('../models/Package');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const logAudit = require('../utils/auditLog');

const isStripeEnabled = () => !!process.env.STRIPE_SECRET_KEY;

// Create payment intent for advance payment (40% of estimated cost)
exports.createAdvancePaymentIntent = catchAsync(async (req, res, next) => {
    if (!isStripeEnabled()) {
        return next(new AppError('Stripe payment not configured', 503));
    }

    const { vehicle_id, booking_id } = req.body;

    if (!vehicle_id) {
        return next(new AppError('Vehicle ID is required', 400));
    }

    // Server-side amount calculation: find the vehicle and its package
    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle) {
        return next(new AppError('Vehicle not found', 404));
    }

    const packageData = await Package.findOne({
        cc_range_min: { $lte: vehicle.cc_engine },
        cc_range_max: { $gte: vehicle.cc_engine },
        vehicle_type: vehicle.type,
        is_active: true
    });
    if (!packageData) {
        return next(new AppError('No package found for this vehicle', 404));
    }

    // Calculate estimated cost from package (assume 24h minimum rental)
    const estimatedCost = packageData.price_per_hour * 24;
    const advanceAmount = Math.round(estimatedCost * 0.40);
    const amountInSmallestUnit = advanceAmount * 100; // Stripe uses smallest currency unit

    try {
        const paymentIntent = await getStripeInstance().paymentIntents.create({
            amount: amountInSmallestUnit,
            currency: 'sar',
            automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
            metadata: {
                payment_type: 'advance',
                vehicle_id: vehicle_id,
                user_id: req.user.id,
                estimated_cost: estimatedCost.toString(),
                advance_amount: advanceAmount.toString(),
                booking_id: booking_id || 'none'
            }
        }, {
            idempotencyKey: `adv_${vehicle_id}_${req.user.id}_${Date.now()}`
        });

        res.status(200).json({
            status: 'success',
            data: {
                client_secret: paymentIntent.client_secret,
                payment_intent_id: paymentIntent.id,
                amount: advanceAmount,
                currency: 'SAR'
            }
        });
    } catch (error) {
        console.error('Stripe payment intent creation error:', error.message);
        console.error('Stripe error type:', error.type, 'code:', error.code, 'status:', error.statusCode, 'decline:', error.decline_code);
        return next(new AppError('Failed to create payment intent: ' + error.message + ' | type=' + (error.type || '') + ' | code=' + (error.code || '') + ' | status=' + (error.statusCode || ''), 500));
    }
});

// Create payment intent for final payment
exports.createFinalPaymentIntent = catchAsync(async (req, res, next) => {
    if (!isStripeEnabled()) {
        return next(new AppError('Stripe payment not configured', 503));
    }

    const { booking_id } = req.body;

    if (!booking_id) {
        return next(new AppError('Booking ID is required', 400));
    }

    const booking = await Booking.findById(booking_id);
    if (!booking) {
        return next(new AppError('Booking not found', 404));
    }

    // Verify booking ownership
    if (booking.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('You can only pay for your own bookings', 403));
    }

    // Server-side amount calculation: use final_cost from database (set by staff on return)
    const finalAmount = booking.final_cost || 0;
    const advancePaid = booking.advance_payment?.amount || 0;
    const remainingAmount = Math.max(0, Math.round(finalAmount - advancePaid));

    if (remainingAmount <= 0) {
        return res.status(200).json({
            status: 'success',
            message: 'No remaining amount to pay',
            data: { remaining_amount: 0 }
        });
    }

    const amountInSmallestUnit = remainingAmount * 100;

    try {
        const paymentIntent = await getStripeInstance().paymentIntents.create({
            amount: amountInSmallestUnit,
            currency: 'sar',
            automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
            metadata: {
                payment_type: 'final',
                booking_id: booking_id,
                user_id: req.user.id,
                final_amount: finalAmount.toString(),
                advance_paid: advancePaid.toString(),
                remaining_amount: remainingAmount.toString()
            }
        }, {
            idempotencyKey: `fin_${booking_id}_${Date.now()}`
        });

        res.status(200).json({
            status: 'success',
            data: {
                client_secret: paymentIntent.client_secret,
                payment_intent_id: paymentIntent.id,
                amount: remainingAmount,
                currency: 'SAR'
            }
        });
    } catch (error) {
        console.error('Stripe final payment intent error:', error.message);
        return next(new AppError('Failed to create payment intent', 500));
    }
});

// Verify payment and create booking (for advance payment)
exports.verifyAndCreateBooking = catchAsync(async (req, res, next) => {
    if (!isStripeEnabled()) {
        return next(new AppError('Stripe payment not configured', 503));
    }

    const { payment_intent_id, vehicle_id, start_location, requested_pickup_date, requested_pickup_time } = req.body;

    if (!payment_intent_id || !vehicle_id) {
        return next(new AppError('Payment intent ID and vehicle ID are required', 400));
    }

    // Retrieve payment intent from Stripe to verify
    let paymentIntent;
    try {
        paymentIntent = await getStripeInstance().paymentIntents.retrieve(payment_intent_id);
    } catch (error) {
        return next(new AppError('Invalid payment intent', 400));
    }

    // Verify payment status
    if (paymentIntent.status !== 'succeeded') {
        return next(new AppError(`Payment not successful. Status: ${paymentIntent.status}`, 400));
    }

    // Verify amount matches SERVER-SIDE calculation (never trust client)
    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle) {
        return next(new AppError('Vehicle not found', 404));
    }
    const packageData = await Package.findOne({
        cc_range_min: { $lte: vehicle.cc_engine },
        cc_range_max: { $gte: vehicle.cc_engine },
        vehicle_type: vehicle.type,
        is_active: true
    });
    if (!packageData) {
        return next(new AppError('No package found for this vehicle', 404));
    }
    const estimatedCost = packageData.price_per_hour * 24;
    const expectedAdvance = Math.round(estimatedCost * 0.40) * 100;
    if (paymentIntent.amount !== expectedAdvance) {
        return next(new AppError('Payment amount mismatch', 400));
    }

    // Verify metadata
    if (paymentIntent.metadata.vehicle_id !== vehicle_id) {
        return next(new AppError('Payment vehicle mismatch', 400));
    }

    // CRITICAL: Verify the payment intent belongs to the authenticated user
    if (paymentIntent.metadata.user_id !== req.user.id) {
        return next(new AppError('Payment does not belong to this user', 403));
    }

    // Check for duplicate payment (idempotency)
    const existingPayment = await Payment.findOne({ transaction_id: payment_intent_id });
    if (existingPayment) {
        return next(new AppError('Payment already processed', 409));
    }

    // ATOMIC: Reserve vehicle (vehicle already fetched above, re-reserve atomically)
    const reservedVehicle = await Vehicle.findOneAndUpdate(
        { _id: vehicle_id, availability_status: 'available' },
        { $set: { availability_status: 'booked' } },
        { new: true }
    );

    if (!reservedVehicle) {
        return next(new AppError('Vehicle not available', 409));
    }

    try {
        if (!packageData) {
            await Vehicle.findByIdAndUpdate(vehicle_id, { $set: { availability_status: 'available' } });
            return next(new AppError('No package found for this vehicle', 404));
        }

        // Create booking
        const advanceAmount = Math.round(estimatedCost * 0.40);
        const newBooking = await Booking.create({
            user_id: req.user.id,
            vehicle_id,
            vendor_id: vehicle.vendor_id,
            package_id: packageData._id,
            start_location,
            requested_pickup_date,
            requested_pickup_time,
            estimated_cost: estimatedCost,
            advance_payment: {
                amount: advanceAmount,
                stripe_payment_id: payment_intent_id,
                status: 'completed',
                paid_at: new Date()
            },
            status: 'booking_requested'
        });

        // Create payment record
        await Payment.create({
            booking_id: newBooking._id,
            user_id: req.user.id,
            amount: advanceAmount,
            payment_method: 'stripe',
            transaction_id: payment_intent_id,
            payment_status: 'success',
            payment_date: new Date()
        });

        const populatedBooking = await Booking.findById(newBooking._id)
            .populate('vehicle_id')
            .populate('package_id')
            .populate('user_id', 'name email phone');

        // Audit log
        await logAudit({
            actor_id: req.user.id,
            actor_role: req.user.role,
            action: 'payment',
            entity_type: 'booking',
            entity_id: newBooking._id,
            description: `Advance payment completed via Stripe: ${payment_intent_id}`,
            after_value: { amount: advanceAmount, payment_intent_id },
            req
        });

        res.status(201).json({
            status: 'success',
            message: 'Payment successful! Booking confirmed.',
            data: {
                booking: populatedBooking,
                payment: {
                    payment_intent_id,
                    amount: advanceAmount,
                    status: 'succeeded'
                }
            }
        });
    } catch (error) {
        await Vehicle.findByIdAndUpdate(vehicle_id, { $set: { availability_status: 'available' } });
        throw error;
    }
});

// Stripe webhook handler
exports.handleWebhook = catchAsync(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('Stripe webhook secret not configured');
        return res.status(400).json({ error: 'Webhook secret not configured' });
    }

    if (!sig) {
        return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    let event;
    try {
        if (typeof req.body === 'string') {
            JSON.parse(req.body); // Ensure the raw body is valid JSON
        } else if (Buffer.isBuffer(req.body)) {
            JSON.parse(req.body.toString('utf8'));
        }
        event = getStripeInstance().webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook verification failed:', err.message);
        const malformed = err.type === 'entity.parse.failed' ||
            err instanceof SyntaxError ||
            (err.message && (err.message.includes('JSON') || err.message.includes('Unexpected token')));
        return res.status(malformed ? 400 : 400).json({
            error: malformed ? 'Malformed webhook payload' : 'Invalid signature'
        });
    }

    // Handle events
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);

            // Check for duplicate processing
            const existingPayment = await Payment.findOne({ transaction_id: paymentIntent.id });
            if (existingPayment) {
                console.log('Payment already processed:', paymentIntent.id);
                break;
            }

            // Update booking if exists
            const bookingId = paymentIntent.metadata.booking_id;
            if (bookingId && bookingId !== 'none') {
                await Booking.findByIdAndUpdate(bookingId, {
                    'advance_payment.stripe_payment_id': paymentIntent.id,
                    'advance_payment.status': 'completed'
                });
            }
            break;
        }
        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            console.log('Payment failed:', paymentIntent.id);
            break;
        }
        default:
            console.log('Unhandled event type:', event.type);
    }

    res.status(200).json({ received: true });
});

// Get publishable key for frontend
exports.getStripeConfig = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || '',
            is_enabled: isStripeEnabled()
        }
    });
});
