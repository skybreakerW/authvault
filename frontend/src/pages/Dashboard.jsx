import { useAuth } from "../context/AuthContext.jsx"

const Dashboard = () => {
    const { user } = useAuth()

    return (
        <div>
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