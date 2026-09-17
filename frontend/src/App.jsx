import { Routes, Route } from "react-router-dom"

import { useAuth } from "./context/AuthContext.jsx"

import Home from "./pages/Home.jsx"
import Signup from "./pages/Signup.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"

import ProtectedRoute from "./components/ProtectedRoute.jsx"


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

        <Route
            path="/dashboard"
            element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
            }
        />
    </Routes>
        
    )
}

export default App