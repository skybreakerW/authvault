import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import api from "../services/api.js"
import { useAuth } from "../context/AuthContext.jsx"
import AuthLayout from "../components/AuthLayout.jsx"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"

const Login = () => {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError("")
        setLoading(true)

        try {
            const response = await api.post(
                "/api/auth/login",
                formData
            )

            setUser({
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role,
            })

            navigate("/dashboard")
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something went wrong."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to access your vault"
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Create one
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />

                <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                />

                {error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-300"
                    >
                        {error}
                    </div>
                )}

                <Button type="submit" loading={loading}>
                    {loading ? "Logging in..." : "Sign in"}
                </Button>
            </form>
        </AuthLayout>
    )
}

export default Login