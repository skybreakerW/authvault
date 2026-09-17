import { Routes, Route, Link } from "react-router-dom"

import { useAuth } from "./context/AuthContext.jsx"

import Signup from "./pages/Signup.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"
import Login from "./pages/Login.jsx"

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

const App = () => {
    return (
        
    <Routes>
        <Route
            path="/"
            element={<Home />}
        />

        <Route
            path="/signup"
            element={<Signup />}
        />

        <Route
            path="/verify-email"
            element={<VerifyEmail />}
        />

        <Route
            path="/login"
            element={<Login />}
        />
    </Routes>
        
    )
}

export default App