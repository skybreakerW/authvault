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

export {
    refreshAccessToken,
}