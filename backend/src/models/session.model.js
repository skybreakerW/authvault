import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        refreshTokenHash: {
            type: String,
            required: true,
        }, 
        userAgent: {
            type: String,
            default: null,
        },

        ipAddress: {
            type: String,
            default: null,
        },
        lastUsedAt: {
            type: Date,
            default: null,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        revokedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true
    })

sessionSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
)

const Session = mongoose.model("Session", sessionSchema)

export default Session