const isProduction = process.env.NODE_ENV === "production"

const authCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
}

const csrfCookieOptions = {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
}

export {
    authCookieOptions,
    csrfCookieOptions,
}