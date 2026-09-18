import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"

const VerifyEmail = () => {

    const [csrfToken, setCsrfToken] = useState("")
    const [searchParams] = useSearchParams()

    const email = searchParams.get("email") || ""

    const [otp, setOtp] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setMessage("")
        setError("")
        setLoading(true)

        console.log("Email:", email)
        console.log("OTP:", otp)
        console.log("CSRF token:", csrfToken)

        try {
            const response = await api.post(
                "/api/auth/verify-email",
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
            setOtp("")
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something went wrong."
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
    const fetchCSRFToken = async () => {
        try {
            const token = await getCSRFToken()

            setCsrfToken(token)

        } catch (error) {
            console.error(
                "Failed to get CSRF token:",
                error
            )
        }
    }

    getCSRFToken()
    }, [])

    return (
        <div>
            <h1>Verify your email</h1>

            <p>
                Enter the verification code sent to:
            </p>

            <p>{email}</p>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="otp">
                        Verification code
                    </label>

                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength="6"
                        value={otp}
                        onChange={(event) =>
                            setOtp(event.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !csrfToken}
                >
                    {loading 
                        ? "Verifying..."
                        : "Verify email"
                    }
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

export default VerifyEmail