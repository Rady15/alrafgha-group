const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed
    },
    group: {
        type: String,
        default: 'general'
    },
    label: {
        type: String,
        default: ''
    },
    label_ar: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
module.exports = SiteSettings;
