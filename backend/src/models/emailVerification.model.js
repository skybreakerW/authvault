import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true
    },
    attempts: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
})


const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema)

export default EmailVerification