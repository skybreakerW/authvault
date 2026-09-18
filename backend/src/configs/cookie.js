const isProduction = process.env.NODE_ENV === "production"

const authCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
}

const csrfCookieOptions = {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
}

export {
    authCookieOptions,
    csrfCookieOptions,
}