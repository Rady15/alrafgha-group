const Offer = require('../models/Offer');
const Vehicle = require('../models/Vehicle');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sanitizeHtml = require('sanitize-html');

const sanitizeText = (text) => sanitizeHtml(text || '', { allowedTags: [], allowedAttributes: {} });

exports.getActiveOffers = catchAsync(async (req, res, next) => {
    const now = new Date();
    const offers = await Offer.find({
        is_active: true,
        start_date: { $lte: now },
        end_date: { $gte: now }
    });

    const offerIds = offers.map(o => o._id);
    let vehicleIds = [];
    offers.forEach(o => {
        if (o.applicable_all_vehicles) {
            vehicleIds = null;
            return;
        }
        if (o.applicable_vehicles) vehicleIds.push(...o.applicable_vehicles);
    });

    let discountedVehicles = [];
    if (vehicleIds !== null && vehicleIds.length > 0) {
        const uniqueIds = [...new Set(vehicleIds.map(String))];
        discountedVehicles = await Vehicle.find({ _id: { $in: uniqueIds } });
    } else if (vehicleIds === null) {
        discountedVehicles = await Vehicle.find({ availability_status: 'available' });
    }

    res.status(200).json({
        status: 'success',
        data: { offers, discountedVehicles }
    });
});

exports.getAllOffers = catchAsync(async (req, res, next) => {
    const offers = await Offer.find().sort('-created_at');
    res.status(200).json({ status: 'success', results: offers.length, data: { offers } });
});

exports.getOffer = catchAsync(async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return next(new AppError('Offer not found', 404));
    res.status(200).json({ status: 'success', data: { offer } });
});

exports.createOffer = catchAsync(async (req, res, next) => {
    req.body.created_by = req.user.id;
    // XSS FIX
    if (req.body.title) req.body.title = sanitizeText(req.body.title);
    if (req.body.description) req.body.description = sanitizeText(req.body.description);
    const offer = await Offer.create(req.body);
    res.status(201).json({ status: 'success', data: { offer } });
});

exports.updateOffer = catchAsync(async (req, res, next) => {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!offer) return next(new AppError('Offer not found', 404));
    res.status(200).json({ status: 'success', data: { offer } });
});

exports.deleteOffer = catchAsync(async (req, res, next) => {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return next(new AppError('Offer not found', 404));
    res.status(200).json({ status: 'success', message: 'Offer deleted' });
});

exports.toggleOffer = catchAsync(async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return next(new AppError('Offer not found', 404));
    offer.is_active = !offer.is_active;
    await offer.save();
    res.status(200).json({ status: 'success', data: { offer } });
});
