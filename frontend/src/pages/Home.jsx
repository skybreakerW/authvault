import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Home = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <p>Loading...</p>
    }

    if (!user) {
        return (
            <div>
                <h1>Welcome to AuthVault</h1>

                <p>
                    Secure authentication for your application.
                </p>

                <Link to="/signup">
                    Sign up
                </Link>

                {" | "}

                <Link to="/login">
                    Login
                </Link>
            </div>
        )
    }

    return (
        <div>
            <h1>Welcome, {user.name}</h1>

            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            <Link to="/dashboard">
                Dashboard
            </Link>
        </div>
    )
}

export default Home