import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },

        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
)


const User = mongoose.model("User", userSchema)


export default User