import { Link } from "react-router-dom"

const DashboardNav = () => {
    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            {" | "}
            <Link to="/sessions">Sessions</Link>
            {" | "}
            <Link to="/change-password">
                Change Password
            </Link>
        </nav>
    )
}

export default DashboardNav