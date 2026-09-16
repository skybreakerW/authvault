import { verifySignedCSRFToken } from "../utils/csrf.js"

const csrfProtection = (req, res, next) => {
    const csrfCookie = req.cookies.csrfToken
    const csrfHeader = req.get("X-CSRF-Token")

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