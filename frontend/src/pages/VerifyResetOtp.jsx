import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"

const VerifyResetOtp = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const email = searchParams.get("email")

    const [otp, setOtp] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setMessage("")
        setError("")
        setLoading(true)

        try {
            const csrfToken = await getCSRFToken()

            const response = await api.post(
                "/api/auth/verify-reset-otp",
                {
                    email,
                    otp,
                },
                {
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            )

            setMessage(response.data.message)

            navigate(
                `/reset-password?token=${encodeURIComponent(
                    response.data.resetToken
                )}`
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
            <h1>Verify Reset OTP</h1>

            <p>
                Enter the OTP sent to your email.
            </p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="otp">
                        OTP
                    </label>

                    <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(event) =>
                            setOtp(event.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Verifying..."
                        : "Verify OTP"}
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

export default VerifyResetOtp