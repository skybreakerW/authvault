import { useAuth } from "../context/AuthContext.jsx"

const Dashboard = () => {
    const { user } = useAuth()

    return (
        <div>
            <h1>Dashboard</h1>

            <p>
                Welcome, {user.name}
            </p>

            <p>
                This is a protected page.
            </p>
        </div>
    )
}

export default Dashboard