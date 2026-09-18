import api from "./api.js"

const getCSRFToken = async () => {
    const response = await api.get("/api/auth/csrf-token")

    return response.data.csrfToken
}

export default getCSRFToken