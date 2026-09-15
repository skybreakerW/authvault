import mongoose from "mongoose"

const passwordResetSchema = new mongoose.Schema(
    {
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
            required: true,
        },

        attempts: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

const PasswordReset = mongoose.model(
    "PasswordReset",
    passwordResetSchema
)

export default PasswordReset