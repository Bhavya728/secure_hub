import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true},
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: 'user'
    },
    refreshToken: {
  type: String
},
permissions:{
    type: [String],
    default: []
}
,
failedLoginAttempts: {
  type: Number,
  default: 0
},
lockUntil: {
  type: Date,
  default: null
}
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);