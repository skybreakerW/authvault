import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api.js"

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const checkAuth = async () => {
            try {
                const response = await api.get("/api/auth/me")

                setUser(response.data.user)
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext)
}

export {
    AuthProvider,
    useAuth,
}