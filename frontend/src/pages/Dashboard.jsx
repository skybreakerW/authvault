import { useAuth } from "../context/AuthContext.jsx"
import DashboardNav from "../components/DashboardNav.jsx"
import Sessions from "../pages/Sessions.jsx"

const Dashboard = () => {
    const { user } = useAuth()

    return (
        <div>
            <DashboardNav />

            <h1>Dashboard</h1>

            <p>
                Welcome, {user.name}
            </p>

            <h2>Account Information</h2>

            <p>
                Name: {user.name}
            </p>

            <p>
                Email: {user.email}
            </p>

            <p>
                Role: {user.role}
            </p>
        </div>
    )
}

export default Dashboard