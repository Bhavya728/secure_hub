import mongoose from "mongoose";


const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true
        },
        actor:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        target:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        ip: String,
        userAgent: String,
        metadata : Object
    },
    {
        timestamps: true
    }
);
export default mongoose.model("AuditLog", auditLogSchema);