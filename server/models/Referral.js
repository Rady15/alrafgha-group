const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referred_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    referral_code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'expired'],
        default: 'pending'
    },
    points_awarded: {
        type: Number,
        default: 0
    },
    completed_at: {
        type: Date
    }
}, { timestamps: true });

referralSchema.index({ referrer_id: 1 });
referralSchema.index({ referral_code: 1 });

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;
