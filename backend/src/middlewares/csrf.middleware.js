import { verifySignedCSRFToken } from "../utils/csrf.js"

const csrfProtection = (req, res, next) => {
    const csrfCookie = req.cookies.csrfToken
    const csrfHeader = req.get("X-CSRF-Token")

    console.log("========== CSRF DEBUG ==========")
    console.log("Cookie:", csrfCookie)
    console.log("Header:", csrfHeader)
    console.log("Cookie type:", typeof csrfCookie)
    console.log("Cookie length:", csrfCookie?.length)
    console.log("Contains dot:", csrfCookie?.includes("."))
    console.log("================================")

    if (!csrfCookie || !csrfHeader) {
        return res.status(403).json({
            message: "CSRF token required."
        })
    }

    if (csrfCookie !== csrfHeader) {
        return res.status(403).json({
            message: "Invalid CSRF token."
        })
    }

    if (!verifySignedCSRFToken(csrfCookie)) {
        return res.status(403).json({
            message: "Invalid CSRF token."
        })
    }

    next()
}

export default csrfProtection