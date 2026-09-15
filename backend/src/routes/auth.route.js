import express from "express";
import { signup, verifyEmail, login, refreshToken } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/signup", signup)
router.post("/verify-email", verifyEmail)
router.post("/login", login)
router.post("/refresh", refreshToken)

export default router