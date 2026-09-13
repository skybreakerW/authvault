import { generateOTP } from "../utils/otp.js";

const OTP_EXPIRY_MINUTES = 15

const createEmailVerification = () => {
    const otp = generateOTP()

    const expiresAt = new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    )

    return {
        otp,
        expiresAt
    }
}

export { createEmailVerification }