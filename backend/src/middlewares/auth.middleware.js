import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken

        if (!token) {
            return res.status(401).json({
                message: "Authentication required."
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        )

        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            })
        }

        req.user = user

        next()

    } catch (error) {
        console.log("Authentication error:", error)

        return res.status(401).json({
            message: "Invalid or expired access token."
        })
    }
}

export default authenticateUser