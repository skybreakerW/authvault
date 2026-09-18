import { Routes, Route } from "react-router-dom"

import AdminRoute from "./components/AdminRoute.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Layout from "./components/Layout.jsx"

import Home from "./pages/Home.jsx"
import Signup from "./pages/Signup.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Sessions from "./pages/Sessions.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"
import VerifyResetOtp from "./pages/VerifyResetOtp.jsx"
import ResetPassword from "./pages/ResetPassword.jsx"
import ChangePassword from "./pages/ChangePassword.jsx"
import AdminUsers from "./pages/AdminUsers.jsx"
import NotFound from "./pages/NotFound.jsx"



const App = () => {
    return (
    <Layout>
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

            <Route
                path="/sessions"
                element={
                <ProtectedRoute>
                    <Sessions />
                </ProtectedRoute>
                }
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/verify-reset-otp"
                element={<VerifyResetOtp />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            <Route
                path="/change-password"
                element={
                    <ProtectedRoute>
                        <ChangePassword />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute>
                        <AdminRoute>
                            <AdminUsers />
                        </AdminRoute>
                    </ProtectedRoute>
                }
            />
            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    </Layout>
        
    )
}

export default App