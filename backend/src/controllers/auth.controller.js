import User from  "../models/user.model.js"
import bcrypt from "bcrypt"
import { isValidEmail, isValidPassword, isValidName, } from "../utils/validators.js"
import EmailVerification from "../models/emailVerification.model.js "
import { createEmailVerification } from "../services/otp.service.js"
import { sendVerificationEmail } from "../services/email.service.js"
import Session from "../models/session.model.js"
import { generateAccessToken, generateRefreshToken } from "../utils/token.js"
import jwt from "jsonwebtoken"
import PasswordReset from "../models/passwordReset.model.js"

const signup = async(req, res) => {

    try {
            const { name, email, password } = req.body
        
            if(!name || !email || !password){
                return res.status(400).json({
                    message: "All fields are required."
                })
            }

            if (!isValidName(name)) {
                return res.status(400).json({
                    message: "Name must be between 3 and 50 characters."
                })
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({
                    message: "Please provide a valid email address."
                })
            }

            if (!isValidPassword(password)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters."
                })
            }
        
            const userExists = await User.findOne({email})
            if(userExists){
                return res.status(409).json({
                    message: "Email is already registered."
                })
            }
        
            const hashPassword = await bcrypt.hash(password, 10)
            const normalizedEmail = email.trim().toLowerCase()
        
            const user = await User.create({
                name,
                email: normalizedEmail,
                password: hashPassword,
            })

            const { otp, expiresAt } = createEmailVerification()

            const verifyEmail = await EmailVerification.create({
                user: user._id,
                otp,
                expiresAt,
            })

            try {
                await sendVerificationEmail(user.email, otp)
            } catch (error) {
                console.error("Verification email failed:", error)
                await EmailVerification.deleteOne({
                    user: user._id,
                })

                await User.deleteOne({
                    _id: user._id,
                })
            }

            return res.status(201).json({
                message: "User registered successfully.",
                user: {
                    id: user._id,
                    name: user.name, 
                    email: user.email, 
                    role: user.role, 
                    isEmailVerified: user.isEmailVerified,
                }
            })

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Something went wrong."
        });
    }
   
}

const verifyEmail = async(req, res) => {
    try {
            const { email, otp } = req.body
        
            if (!email || !otp) {
                return res.status(400).json({
                    message: "Email and OTP are required."
            })
            }
            const normalizedEmail = email.trim().toLowerCase()

            const user = await User.findOne({
                email: normalizedEmail
            })

            if (user.isEmailVerified) {
                return res.status(400).json({
                    message: "Email is already verified."
                })
            }

            if(!user){
               return res.status(404).json({
                message: "User not found."
            }) 
            }

            const verification = await EmailVerification.findOne({
                user: user._id
            })
            if(!verification){
                return res.status(404).json({
                message: "Verification record not found."
            })
            }

            if(verification.expiresAt < new Date()){
                return res.status(400).json({
                    message: "OTP has expired."
                })
            }

            if(verification.attempts >= 5){
                return res.status(400).json({
                    message: "Too many incorrect attempts. Try again later."
                })
            }

            if(otp !== verification.otp){
                verification.attempts += 1
                await verification.save()

                return res.status(400).json({
                    message: "Invalid OTP."
                })
            }

            user.isEmailVerified = true
            await user.save()

            await EmailVerification.deleteOne({
                _id: verification._id,
            })

            return res.status(200).json({
                message: "Email verified successfully."
            })

    } catch (error) {
        console.error("Email verification error:", error)
        return res.status(500).json({
            message: "Something went wrong."
        })
    }

}

const login = async(req, res) => {
    try {
        const { email, password } = req.body

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required."
            })
        }
        const normalizedEmail = email.trim().toLowerCase()
        
        const user = await User.findOne({ email: normalizedEmail })
        if(!user){
            return res.status(401).json({
            message: "Invalid email or password."
        }) 
        }

        if(!user.isEmailVerified){
            return res.status(403).json({
                message: "Please verify before logging in."
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid email or password."
            })
        }

        const session = await Session.create({
            user: user._id,
            refreshTokenHash: "temporary",
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        })

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(
            user,
            session._id,
        )

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

        session.refreshTokenHash = refreshTokenHash
        await session.save()

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })


        return res.status(200).json({
            message: "Logged in successfully.",
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })

    } catch (error) {
        console.log("Login error: ", error)

        return res.status(500).json({
            message: "Something went wrong."
        })
        
    }

}

const refreshToken = async(req, res) => {
    try {
        const token = req.cookies.refreshToken

        if(!token){
            return res.status(404).json({
                message: "Refresh token is required."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

        const session = await Session.findById(decoded.sessionId)
        if(!session){
            return res.status(401).json({
                message: "Invalid Session."
            })
        }

        if(session.revokedAt){
            return res.status(401).json({
                message: "Session has been revoked."
            })
        }

        if(session.expiresAt < new Date()){
            return res.status(401).json({
                message: "Session has expired."
            })
        }

        const isRefreshTokenValid = await bcrypt.compare(token, session.refreshTokenHash)
        if(!isRefreshTokenValid){
            return res.status(401).json({
                message: "Invalid refresh token."
            })
        }

        const user = await User.findById(decoded.userId)
        if(!user){
            return res.status(401).json({
                message: "User not found."
            })
        }

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user, session._id)

        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10)

        session.refreshTokenHash = newRefreshToken

        await session.save()

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, 
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: "Tokens refreshed successfully."
        })

    } catch (error) {
        console.log("Refresh token error:", error)

        return res.status(401).json({
            message: "Invalid or expired refresh token."
        })
    }
}

const logout = async(req, res) => {
    try {
        const token = req.cookies.refreshToken
        if(token){
            try {
                const decoded = jwt.verify(
                    token,
                    process.env.JWT_REFRESH_SECRET
                )

                const session = await Session.findById(decoded.sessionId)

                if(session && !session.revokedAt){
                    session.revokedAt = new Date()
                    await session.save()
                }
            } catch (error) {
                console.log("Logout token error:", error)
            }
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })

        return res.status(200).json({
            message: "Logged out successfully."
        })

    } catch (error) {
        console.log("Logout error:", error)

        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}

const logoutAll = async(req, res) => {
    try {
        const token = req.cookies.refreshToken

        if(!token){
            return res.status(401).json({
                message: "Refresh token is required."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        await Session.updateMany({
            user: decoded.userId,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: new Date()
            }
        }
        )

        res.clearCookie("accesToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        })

        return res.status(200).json({
            message: "Logged out from all devices successfully."
        })

    } catch (error) {
        console.log("Logout all error:", error)

        return res.status(401).json({
            message: "Invalid or expired refresh token."
        })
    }   
}

const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body
        if(!email){
            return res.status(400).json({
                message: "Email is required."
            })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const user = await User.findOne({
            email: normalizedEmail
        })
        if(!user){
            return res.status(404).json({
                message: "If an account exists, a reset code has been sent."
            })
        }

        if(!user.isEmailVerified){
            return res.status(403).json({
                message: "Please verify your email first."
            })
        }

        const { otp, expiresAt } = createEmailVerification()

        await PasswordReset.deleteMany({
            user: user._id
        })

        await PasswordReset.create({
            user: user._id,
            otp,
            expiresAt,
        })

        try {
            await sendVerificationEmail(
                user.email,
                otp
            )
        } catch (error) {
            console.error(
                "Password reset email failed:",
                error
            )

            await PasswordReset.deleteMany({
                user: user._id
            })

            return res.status(500).json({
                message: "Unable to send password reset email."
            })
        }

        return res.status(200).json({
            message: "Password reset OTP sent successfully."
        })
        
    } catch (error) {
    console.log("Forgot password error:", error)

    return res.status(500).json({
        message: "Something went wrong."
    })
    }
}

const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required."
            })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const user = await User.findOne({
            email: normalizedEmail
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid reset request."
            })
        }

        const resetRequest = await PasswordReset.findOne({
            user: user._id
        })

        if (!resetRequest) {
            return res.status(400).json({
                message: "Invalid or expired OTP."
            })
        }

        if (resetRequest.expiresAt < new Date()) {
            await PasswordReset.deleteOne({
                _id: resetRequest._id
            })

            return res.status(400).json({
                message: "OTP has expired."
            })
        }

        if (resetRequest.attempts >= 5) {
            await PasswordReset.deleteOne({
                _id: resetRequest._id
            })

            return res.status(429).json({
                message: "Too many OTP attempts."
            })
        }

        resetRequest.attempts += 1
        await resetRequest.save()

        if (otp !== resetRequest.otp) {
            return res.status(400).json({
                message: "Invalid OTP."
            })
        }

        const resetToken = jwt.sign(
            {
                userId: user._id,
                purpose: "password-reset",
            },
            process.env.JWT_RESET_SECRET,
            {
                expiresIn: "10m",
            }
        )

        await PasswordReset.deleteOne({
            _id: resetRequest._id
        })

        return res.status(200).json({
            message: "OTP verified successfully.",
            resetToken
        })

    } catch (error) {
        console.log("Verify reset OTP error:", error)

        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}

const resetPassword = async(req, res) => {
    try {
        const { resetToken, newPassword } = req.body

        if (!resetToken || !newPassword) {
            return res.status(400).json({
                message: "Reset token and new password are required."
            })
        }

        if (!isValidPassword(newPassword)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters."
            })
        }

        const decoded = jwt.verify(
            resetToken,
            process.env.JWT_RESET_SECRET
        )

        if (decoded.purpose !== "password-reset") {
            return res.status(401).json({
                message: "Invalid reset token."
            })
        }

        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        )

        user.password = hashedPassword

        await user.save()

        await Session.updateMany(
            {
                user: user._id,
                revokedAt: null
            },
            {
                $set: {
                    revokedAt: new Date()
                }
            }
        )

        return res.status(200).json({
            message: "Password reset successfully."
        })

    } catch (error) {
        console.log("Reset password error:", error)

        return res.status(401).json({
            message: "Invalid or expired reset token."
        })
    }
}

const logoutOtherDevices = async (req, res) => {
    try {
        const token = req.cookies.refreshToken

        if (!token) {
            return res.status(401).json({
                message: "Refresh token is required."
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        )

        await Session.updateMany(
            {
                user: decoded.userId,
                _id: { $ne: decoded.sessionId },
                revokedAt: null
            },
            {
                $set: {
                    revokedAt: new Date()
                }
            }
        )

        return res.status(200).json({
            message: "Logged out from all other devices successfully."
        })

    } catch (error) {
        console.log("Logout other devices error:", error)

        return res.status(401).json({
            message: "Invalid or expired refresh token."
        })
    }
}


export { signup, verifyEmail, login, refreshToken, logout, logoutAll, forgotPassword, verifyResetOTP, resetPassword, logoutOtherDevices }