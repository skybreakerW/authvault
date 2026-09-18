import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api.js"
import {
    logout as logoutUser,
    logoutAll as logoutAllUser,
    logoutOtherDevices as logoutOtherDevicesUser,
} from "../services/auth.js"

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

    const logout = async () => {
    await logoutUser()

    setUser(null)
    }

    const logoutAll = async () => {
    await logoutAllUser()

    setUser(null)
    }

    const logoutOtherDevices = async () => {
    await logoutOtherDevicesUser()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                setUser,
                logout,
                logoutAll,
                logoutOtherDevices,
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