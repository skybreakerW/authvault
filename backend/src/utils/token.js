import jwt from "jsonwebtoken"

const ACCESS_TOKEN_EXPIRY = "15m"
const REFRESH_TOKEN_EXPIRY = "7d"

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        }
    )
}

const generateRefreshToken = (user, sessionId) => {
    return jwt.sign(
        {
            userId: user._id,
            sessionId,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        }
    )
}

export { generateAccessToken, generateRefreshToken }