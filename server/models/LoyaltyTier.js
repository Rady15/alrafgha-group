const mongoose = require('mongoose');

const loyaltyTierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    name_ar: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: Number,
        required: true,
        unique: true
    },
    min_spending: {
        type: Number,
        required: true,
        min: 0
    },
    min_bookings: {
        type: Number,
        default: 0
    },
    discount_percent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    color: {
        type: String,
        default: '#CD7F32'
    },
    icon: {
        type: String,
        default: '🥉'
    },
    benefits: [{
        type: String,
        trim: true
    }],
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const LoyaltyTier = mongoose.model('LoyaltyTier', loyaltyTierSchema);
module.exports = LoyaltyTier;
