import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import PageLoader from "./PageLoader.jsx"

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) return <PageLoader />

    // Not logged in → login
    if (!user) return <Navigate to="/login" replace />

    // Logged in but not admin → kick to dashboard
    if (user.role !== "admin") return <Navigate to="/dashboard" replace />

    return children
}

export default AdminRoute