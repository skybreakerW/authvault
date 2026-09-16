import express from "express";
import { signup, verifyEmail, login, refreshToken, logout, logoutAll, forgotPassword, verifyResetOTP, resetPassword, logoutOtherDevices, resendVerification, getCSRFToken } from "../controllers/auth.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js"
import requireAdmin from "../middlewares/admin.middleware.js"
import { getMySessions, revokeSession } from "../controllers/session.controller.js"
import { loginRateLimiter,otpRequestRateLimiter,otpVerificationRateLimiter, refreshTokenRateLimiter } from "../middlewares/rateLimit.middleware.js"
import csrfProtection from "../middlewares/csrf.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/verify-email", otpVerificationRateLimiter, csrfProtection, verifyEmail)
router.post("/login", loginRateLimiter, login)
router.post("/refresh", refreshTokenRateLimiter, refreshToken)
router.post("/logout", csrfProtection, logout)
router.post("/logout-all", csrfProtection, logoutAll)
router.post("/forgot-password", otpRequestRateLimiter, csrfProtection, forgotPassword)
router.post("/verify-reset-otp", otpVerificationRateLimiter, csrfProtection, verifyResetOTP)
router.post("/reset-password", csrfProtection, resetPassword)
router.post("/logout-other-devices", csrfProtection, logoutOtherDevices)
router.post("/resend-verification", otpRequestRateLimiter, csrfProtection, resendVerification)

router.get("/csrf-token", getCSRFToken)

router.get(
    "/me",
    authenticateUser,
    (req, res) => {
        return res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            }
        })
    })

router.get("/sessions", authenticateUser, getMySessions)

router.delete("/sessions/:sessionId", authenticateUser, csrfProtection, revokeSession)


export default router