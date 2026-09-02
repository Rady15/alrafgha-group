const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    actor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    actor_role: {
        type: String,
        enum: ['user', 'admin', 'vendor', 'office_staff']
    },
    actor_email: {
        type: String
    },
    action: {
        type: String,
        required: true,
        enum: [
            'create', 'update', 'delete', 'cancel', 'approve', 'reject',
            'pickup', 'return', 'login', 'logout', 'verify', 'payment',
            'status_change', 'adjust_points', 'publish'
        ]
    },
    entity_type: {
        type: String,
        required: true,
        enum: ['booking', 'vehicle', 'user', 'vendor', 'offer', 'coupon', 'blog', 'loyalty', 'payment', 'setting']
    },
    entity_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    description: {
        type: String
    },
    before_value: {
        type: mongoose.Schema.Types.Mixed
    },
    after_value: {
        type: mongoose.Schema.Types.Mixed
    },
    ip_address: {
        type: String
    },
    user_agent: {
        type: String
    }
}, {
    timestamps: true
});

auditLogSchema.index({ actor_id: 1, created_at: -1 });
auditLogSchema.index({ entity_type: 1, entity_id: 1 });
auditLogSchema.index({ action: 1, created_at: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
