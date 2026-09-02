const Coupon = require('../models/Coupon');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.validateCoupon = catchAsync(async (req, res, next) => {
    const { code, order_value } = req.body;
    if (!code) return next(new AppError('Coupon code required', 400));

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), is_active: true });
    if (!coupon) return next(new AppError('Invalid coupon code', 400));

    const now = new Date();
    if (now < coupon.start_date || now > coupon.end_date) {
        return next(new AppError('Coupon has expired', 400));
    }
    if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
        return next(new AppError('Coupon usage limit reached', 400));
    }
    if (order_value && order_value < coupon.min_order_value) {
        return next(new AppError(`Minimum order value is ${coupon.min_order_value}`, 400));
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
        discount = (order_value * coupon.discount_value) / 100;
        if (coupon.max_discount > 0) discount = Math.min(discount, coupon.max_discount);
    } else {
        discount = coupon.discount_value;
    }

    res.status(200).json({
        status: 'success',
        data: {
            coupon: {
                code: coupon.code,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value,
                discount
            }
        }
    });
});

exports.getAllCoupons = catchAsync(async (req, res, next) => {
    const coupons = await Coupon.find().sort('-created_at');
    res.status(200).json({ status: 'success', results: coupons.length, data: { coupons } });
});

exports.getCoupon = catchAsync(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new AppError('Coupon not found', 404));
    res.status(200).json({ status: 'success', data: { coupon } });
});

exports.createCoupon = catchAsync(async (req, res, next) => {
    try {
        req.body.code = req.body.code?.toUpperCase();
        req.body.created_by = req.user.id;
        const coupon = await Coupon.create(req.body);
        res.status(201).json({ status: 'success', data: { coupon } });
    } catch (error) {
        if (error.code === 11000) {
            return next(new AppError('Coupon code already exists', 400));
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return next(new AppError(`Validation failed: ${messages.join(', ')}`, 400));
        }
        throw error;
    }
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
    if (req.body.code) req.body.code = req.body.code.toUpperCase();
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return next(new AppError('Coupon not found', 404));
    res.status(200).json({ status: 'success', data: { coupon } });
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return next(new AppError('Coupon not found', 404));
    res.status(200).json({ status: 'success', message: 'Coupon deleted' });
});
