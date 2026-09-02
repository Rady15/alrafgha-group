const mongoose = require('mongoose');

const loyaltyPointSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['earned', 'redeemed', 'expired', 'referral', 'bonus'],
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    expires_at: {
        type: Date
    },
    is_expired: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

loyaltyPointSchema.index({ user_id: 1, created_at: -1 });

const LoyaltyPoint = mongoose.model('LoyaltyPoint', loyaltyPointSchema);
module.exports = LoyaltyPoint;
