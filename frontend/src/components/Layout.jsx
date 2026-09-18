import { useLocation } from "react-router-dom"
import Navbar from "./Navbar.jsx"

const AUTH_ROUTES = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/verify-reset-otp",
    "/reset-password",
]

const Layout = ({ children }) => {
    const { pathname } = useLocation()
    const hideNav = AUTH_ROUTES.includes(pathname)
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
            {!hideNav && <Navbar />}
            {children}
        </div>
    )
}

export default Layout