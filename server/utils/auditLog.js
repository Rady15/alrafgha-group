const AuditLog = require('../models/AuditLog');

const logAudit = async ({
    actor_id,
    actor_role,
    actor_email,
    action,
    entity_type,
    entity_id,
    description,
    before_value,
    after_value,
    req = null
}) => {
    try {
        await AuditLog.create({
            actor_id,
            actor_role,
            actor_email,
            action,
            entity_type,
            entity_id,
            description,
            before_value,
            after_value,
            ip_address: req?.ip || null,
            user_agent: req?.headers?.['user-agent'] || null
        });
    } catch (error) {
        console.error('Audit log error:', error.message);
    }
};

module.exports = logAudit;
