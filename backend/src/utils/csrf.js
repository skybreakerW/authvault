import crypto from "crypto"

const generateCSRFToken = () => {
    return crypto.randomBytes(32).toString("hex")
}

const createCSRFSignature = (token) => {
    return crypto
        .createHmac(
            "sha256",
            process.env.CSRF_SECRET
        )
        .update(token)
        .digest("hex")
}

const createSignedCSRFToken = () => {
    const token = generateCSRFToken()
    const signature = createCSRFSignature(token)

    return `${token}.${signature}`
}

const verifySignedCSRFToken = (signedToken) => {
    if (!signedToken) {
        return false
    }

    const separatorIndex = signedToken.lastIndexOf(".")

    if (separatorIndex === -1) {
        return false
    }

    const token = signedToken.slice(
        0,
        separatorIndex
    )

    const signature = signedToken.slice(
        separatorIndex + 1
    )

    const expectedSignature = createCSRFSignature(token)

    if (signature.length !== expectedSignature.length) {
        return false
    }

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    )
}

export {
    createSignedCSRFToken,
    verifySignedCSRFToken
}