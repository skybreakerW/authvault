import express from "express";
import { signup, verifyEmail, login, refreshToken, logout, logoutAll, forgotPassword, verifyResetOTP, resetPassword } from "../controllers/auth.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js"
import requireAdmin from "../middlewares/admin.middleware.js"
import { getMySessions } from "../controllers/session.controller.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/verify-email", verifyEmail)
router.post("/login", login)
router.post("/refresh", refreshToken)
router.post("/logout", logout)
router.post("/logout-all", logoutAll)
router.post("/forgot-password", forgotPassword)
router.post("/verify-reset-otp", verifyResetOTP)
router.post("/reset-password", resetPassword)

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

router.get(
    "/sessions",
    authenticateUser,
    getMySessions
)

export default router