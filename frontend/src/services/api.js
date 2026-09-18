import axios from "axios"
import { refreshAccessToken } from "./auth.js"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/api/auth/refresh" &&
            originalRequest.url !== "/api/auth/login"
        ) {
            originalRequest._retry = true

            await refreshAccessToken()

            return api(originalRequest)
        }

        return Promise.reject(error)
    }
)

export default api