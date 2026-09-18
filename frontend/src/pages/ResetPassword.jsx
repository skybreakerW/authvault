import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const resetToken = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setMessage("")
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setLoading(true)

        try {
            const csrfToken = await getCSRFToken()

            const response = await api.post(
                "/api/auth/reset-password",
                {
                    resetToken,
                    newPassword: password,
                },
                {
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            )

            setMessage(response.data.message)

            setTimeout(() => {
                navigate("/login")
            }, 1500)
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
            <h1>Reset Password</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">
                        New Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Resetting..."
                        : "Reset Password"}
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

export default ResetPassword