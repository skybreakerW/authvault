import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

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