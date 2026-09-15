import express from "express"
import authenticateUser from "../middlewares/auth.middleware.js"
import requireAdmin from "../middlewares/admin.middleware.js"
import { getAllUsers } from "../controllers/admin.controller.js"

const router = express.Router()

router.get(
    "/users",
    authenticateUser,
    requireAdmin,
    getAllUsers
)

export default router