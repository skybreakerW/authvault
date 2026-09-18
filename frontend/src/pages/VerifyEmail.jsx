import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"
import AuthLayout from "../components/AuthLayout.jsx"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const email = searchParams.get("email") || ""

    const [csrfToken, setCsrfToken] = useState("")
    const [otp, setOtp] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCSRFToken = async () => {
            try {
                const token = await getCSRFToken()
                setCsrfToken(token)
            } catch (error) {
                console.error("Failed to get CSRF token:", error)
            }
        }

        fetchCSRFToken()   // ✅ actually invokes the async fn
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()

        setMessage("")
        setError("")
        setLoading(true)

        try {
            const response = await api.post(
                "/api/auth/verify-email",
                { email, otp },
                { headers: { "X-CSRF-Token": csrfToken } }
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

    // No email in URL? The user shouldn't be here.
    if (!email) {
        return (
            <AuthLayout
                title="Missing email"
                subtitle="We couldn't find an email to verify."
                footer={
                    <Link to="/signup" className="text-emerald-400 hover:text-emerald-300">
                        Back to signup
                    </Link>
                }
            >
                <p className="text-sm text-slate-400">
                    Please sign up again to receive a new verification code.
                </p>
            </AuthLayout>
        )
    }

    // Success state — swap the form for a confirmation
    if (message) {
        return (
            <AuthLayout
                title="Email verified"
                subtitle="Your account is ready to go."
                footer={
                    <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
                        Continue to sign in →
                    </Link>
                }
            >
                <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-slate-950">
                        <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                    <p className="text-sm text-emerald-300">{message}</p>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="Verify your email"
            subtitle="Enter the 6-digit code we sent to your inbox."
            footer={
                <>
                    Wrong email?{" "}
                    <Link
                        to="/signup"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Start over
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Email pill — read-only context */}
                <div className="rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                        Sent to
                    </p>
                    <p className="mt-0.5 text-sm text-slate-200 break-all">
                        {email}
                    </p>
                </div>

                <Input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    label="Verification code"
                    placeholder="123456"
                    value={otp}
                    onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, ""))
                    }
                    className="tracking-[0.4em] text-center text-lg font-mono"
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

                <Button
                    type="submit"
                    loading={loading}
                    disabled={loading || !csrfToken || otp.length < 6}
                >
                    {loading ? "Verifying..." : "Verify email"}
                </Button>
            </form>
        </AuthLayout>
    )
}

export default VerifyEmail