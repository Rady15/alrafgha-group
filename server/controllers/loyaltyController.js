const mongoose = require('mongoose');
const LoyaltyPoint = require('../models/LoyaltyPoint');
const LoyaltyTier = require('../models/LoyaltyTier');
const Referral = require('../models/Referral');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateCode = (userId) => {
    const str = userId.toString().slice(-6);
    return `RAF${str.toUpperCase()}`;
};

exports.getMyPoints = catchAsync(async (req, res, next) => {
    console.log('LOYALTY CALLED', JSON.stringify(req.user), 'id type:', typeof req.user.id);
    const points = await LoyaltyPoint.find({ user_id: new mongoose.Types.ObjectId(req.user.id) })
        .sort('-created_at')
        .limit(50);

    const total = await LoyaltyPoint.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(req.user.id), is_expired: false } },
        {
            $group: {
                _id: null,
                total: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'redeemed'] }, { $multiply: ['$points', -1] }, '$points']
                    }
                }
            }
        }
    ]);
    console.log('AGG RESULT:', JSON.stringify(total));
    const balance = total.length > 0 ? total[0].total : 0;
    console.log('BALANCE:', balance);

    res.status(200).json({
        status: 'success',
        data: { balance, points }
    });
});

exports.getMyTier = catchAsync(async (req, res, next) => {
    const spending = await LoyaltyPoint.aggregate([
        { $match: { user_id: req.user._id, type: { $in: ['earned', 'redeemed'] } } },
        {
            $group: {
                _id: null,
                total: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'redeemed'] }, { $multiply: ['$points', -1] }, '$points']
                    }
                }
            }
        }
    ]);
    const totalSpending = spending.length > 0 ? spending[0].total : 0;

    const tier = await LoyaltyTier.findOne({
        min_spending: { $lte: totalSpending },
        is_active: true
    }).sort('-min_spending');

    const nextTier = await LoyaltyTier.findOne({
        min_spending: { $gt: totalSpending },
        is_active: true
    }).sort('min_spending');

    res.status(200).json({
        status: 'success',
        data: {
            tier: tier || null,
            totalSpending,
            nextTier: nextTier || null,
            progress: nextTier ? Math.round((totalSpending / nextTier.min_spending) * 100) : 100
        }
    });
});

exports.getReferralCode = catchAsync(async (req, res, next) => {
    const code = generateCode(req.user.id);

    await Referral.findOneAndUpdate(
        { referrer_id: req.user.id, status: 'pending' },
        { referrer_id: req.user.id, referral_code: code },
        { upsert: true, new: true }
    );

    const referrals = await Referral.find({ referrer_id: req.user.id, status: 'completed' });

    res.status(200).json({
        status: 'success',
        data: {
            referral_code: code,
            total_referrals: referrals.length,
            points_earned: referrals.reduce((s, r) => s + r.points_awarded, 0)
        }
    });
});

exports.redeemPoints = catchAsync(async (req, res, next) => {
    const { points } = req.body;
    if (!points || points <= 0) return next(new AppError('Points must be positive', 400));

    const total = await LoyaltyPoint.aggregate([
        { $match: { user_id: req.user._id, is_expired: false } },
        {
            $group: {
                _id: null,
                total: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'redeemed'] }, { $multiply: ['$points', -1] }, '$points']
                    }
                }
            }
        }
    ]);
    const balance = total.length > 0 ? total[0].total : 0;

    if (points > balance) return next(new AppError('Insufficient points', 400));

    await LoyaltyPoint.create({
        user_id: req.user.id,
        points,
        type: 'redeemed',
        description: 'Redeemed for booking discount'
    });

    res.status(200).json({
        status: 'success',
        message: `${points} points redeemed`,
        data: { remaining_balance: balance - points }
    });
});

exports.getAllUsersLoyalty = catchAsync(async (req, res, next) => {
    const users = await User.find({ role: 'user' }).select('name email created_at');

    const results = await Promise.all(users.map(async (user) => {
    const total = await LoyaltyPoint.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(req.user.id), is_expired: false } },
        {
            $group: {
                _id: null,
                total: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'redeemed'] }, { $multiply: ['$points', -1] }, '$points']
                    }
                }
            }
        }
    ]);
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            points: total.length > 0 ? total[0].balance : 0,
            joined: user.created_at
        };
    }));

    results.sort((a, b) => b.points - a.points);

    res.status(200).json({ status: 'success', results: results.length, data: { users: results } });
});

exports.getTiers = catchAsync(async (req, res, next) => {
    const tiers = await LoyaltyTier.find().sort('level');
    res.status(200).json({ status: 'success', results: tiers.length, data: { tiers } });
});

exports.createTier = catchAsync(async (req, res, next) => {
    const tier = await LoyaltyTier.create(req.body);
    res.status(201).json({ status: 'success', data: { tier } });
});

exports.updateTier = catchAsync(async (req, res, next) => {
    const tier = await LoyaltyTier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tier) return next(new AppError('Tier not found', 404));
    res.status(200).json({ status: 'success', data: { tier } });
});

exports.adjustPoints = catchAsync(async (req, res, next) => {
    const { user_id, points, description } = req.body;
    if (!user_id || !points) return next(new AppError('User ID and points required', 400));

    const point = await LoyaltyPoint.create({
        user_id,
        points: Math.abs(points),
        type: points > 0 ? 'bonus' : 'expired',
        description: description || `Admin adjustment: ${points > 0 ? '+' : ''}${points}`
    });

    res.status(200).json({ status: 'success', data: { point } });
});
