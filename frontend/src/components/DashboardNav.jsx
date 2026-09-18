import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const DashboardNav = () => {
    const { logout, logoutAll, logoutOtherDevices } = useAuth()

    const handleLogout = async () => {
    try {
        await logout()
    } catch (error) {
        console.log(
            "Logout error:",
            error.response?.data
            )
        }
    }

    const handleLogoutAll = async () => {
        try {
            await logoutAll()
        } catch (error) {
            console.log(
                "Logout all error:",
                error.response?.data
            )
        }
    }

    const handleLogoutOtherDevices = async () => {
        try {
            await logoutOtherDevices()
        } catch (error) {
            console.log(
                "Logout other devices error:",
                error.response?.data
            )
        }
    }

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            {" | "}
            <Link to="/sessions">Sessions</Link>
            {" | "}
            <Link to="/change-password">
                Change Password
            </Link>
            {" | "}
            <button onClick={handleLogout}>
                Logout
            </button>
            {" | "}
            <button onClick={handleLogoutAll}>
                Logout All Devices
            </button>
            {" | "}
            <button onClick={handleLogoutOtherDevices}>
                Logout Other Devices
            </button>
        </nav>
    )
}

export default DashboardNav