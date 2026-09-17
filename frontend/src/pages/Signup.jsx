import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api.js"

const Signup = () => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [message, setMessage] = useState("")
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

        setMessage("")
        setError("")
        setLoading(true)

        try {
            const response = await api.post(
                "/api/auth/signup",
                formData
            )

            navigate(
            `/verify-email?email=${encodeURIComponent(formData.email)}`
            )

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
            <h1>Create your AuthVault account</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">
                        Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                    {loading ? "Creating account..." : "Sign up"}
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}

            {error && (
                <p>{error}</p>
            )}
        </div>
    )
}

export default Signup