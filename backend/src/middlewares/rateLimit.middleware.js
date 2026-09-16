import rateLimit from "express-rate-limit"

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,

    message: {
        message: "Too many login attempts. Please try again later."
    }
})

const otpRequestRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,

    message: {
        message: "Too many OTP requests. Please try again later."
    }
})

const otpVerificationRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,

    message: {
        message: "Too many OTP verification attempts. Please try again later."
    }
})

export {
    loginRateLimiter,
    otpRequestRateLimiter,
    otpVerificationRateLimiter
}