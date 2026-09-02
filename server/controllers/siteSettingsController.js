const SiteSettings = require('../models/SiteSettings');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getSettings = catchAsync(async (req, res, next) => {
    const { group } = req.query;
    const filter = group ? { group } : {};
    const settings = await SiteSettings.find(filter);

    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });

    res.status(200).json({ status: 'success', data: { settings: result, raw: settings } });
});

exports.getSetting = catchAsync(async (req, res, next) => {
    const setting = await SiteSettings.findOne({ key: req.params.key });
    if (!setting) return next(new AppError('Setting not found', 404));
    res.status(200).json({ status: 'success', data: { setting } });
});

exports.createSetting = catchAsync(async (req, res, next) => {
    const setting = await SiteSettings.create(req.body);
    res.status(201).json({ status: 'success', data: { setting } });
});

exports.updateSetting = catchAsync(async (req, res, next) => {
    const setting = await SiteSettings.findOneAndUpdate(
        { key: req.params.key },
        { value: req.body.value, label: req.body.label, label_ar: req.body.label_ar },
        { new: true, runValidators: true }
    );
    if (!setting) return next(new AppError('Setting not found', 404));
    res.status(200).json({ status: 'success', data: { setting } });
});

exports.deleteSetting = catchAsync(async (req, res, next) => {
    const setting = await SiteSettings.findOneAndDelete({ key: req.params.key });
    if (!setting) return next(new AppError('Setting not found', 404));
    res.status(200).json({ status: 'success', message: 'Setting deleted' });
});
