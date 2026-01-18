import AuditLog from '../models/auditLog.model.js';

export const logAudit= async ({
    action,
    actor = null,
    target = null,
    req,
    metadata={}
})=>{
    try{
        await AuditLog.create({
            action,
            actor,
            target,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            metadata
        });
    }catch(err){
        console.error('Audit log error:', err);
    }
};
