import { useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../services/api.js"
import { useAuth } from "../context/AuthContext.jsx"

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

            setUser(response.data.user)

            navigate("/")
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
        <div>
            <h1>Login to AuthVault</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"
                    }
                </button>
            </form>

            {error && <p>{error}</p>}
        </div>
    )
}

export default Login