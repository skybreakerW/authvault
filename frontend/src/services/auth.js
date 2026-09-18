import api from "./api.js"
import getCSRFToken from "./csrf.js"

const refreshAccessToken = async () => {
    const csrfToken = await getCSRFToken()

    return api.post(
        "/api/auth/refresh",
        {},
        {
            headers: {
                "X-CSRF-Token": csrfToken,
            },
        }
    )
}

const logout = async () => {
    const csrfToken = await getCSRFToken()

    return api.post(
        "/api/auth/logout",
        {},
        {
            headers: {
                "X-CSRF-Token": csrfToken,
            },
        }
    )
}

const logoutAll = async () => {
    const csrfToken = await getCSRFToken()

    return api.post(
        "/api/auth/logout-all",
        {},
        {
            headers: {
                "X-CSRF-Token": csrfToken,
            },
        }
    )
}

const logoutOtherDevices = async () => {
    const csrfToken = await getCSRFToken()

    return api.post(
        "/api/auth/logout-other-devices",
        {},
        {
            headers: {
                "X-CSRF-Token": csrfToken,
            },
        }
    )
}

export {
    refreshAccessToken,
    logout,
    logoutAll,
    logoutOtherDevices
}