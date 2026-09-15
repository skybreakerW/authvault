import express from "express";
import { signup, verifyEmail, login, refreshToken, logout, logoutAll, forgotPassword, verifyResetOTP, resetPassword } from "../controllers/auth.controller.js";

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

export default router