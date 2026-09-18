import { useState } from "react"
import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"
import { useNavigate } from "react-router-dom"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()

        setMessage("")
        setError("")
        setLoading(true)

        try {
            const csrfToken = await getCSRFToken()

            const response = await api.post(
                "/api/auth/forgot-password",
                { email },
                {
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            )

            setMessage(response.data.message)
            navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`)

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
            <h1>Forgot Password</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Sending..."
                        : "Send Reset OTP"}
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

export default ForgotPassword