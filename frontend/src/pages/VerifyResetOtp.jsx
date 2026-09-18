import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"

import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"
import AuthLayout from "../components/AuthLayout.jsx"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"
import StepIndicator from "../components/StepIndicator.jsx"

const VerifyResetOtp = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const email = searchParams.get("email") || ""

    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError("")
        setLoading(true)

        try {
            const csrfToken = await getCSRFToken()

            const response = await api.post(
                "/api/auth/verify-reset-otp",
                { email, otp },
                { headers: { "X-CSRF-Token": csrfToken } }
            )

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

    if (!email) {
        return (
            <AuthLayout
                title="Missing email"
                subtitle="We couldn't find an email to verify."
                footer={
                    <Link
                        to="/forgot-password"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Start over
                    </Link>
                }
            >
                <p className="text-sm text-slate-400">
                    Please enter your email again to receive a reset code.
                </p>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="Enter your reset code"
            subtitle="We sent a 6-digit code to your email."
            footer={
                <Link
                    to="/forgot-password"
                    className="text-emerald-400 hover:text-emerald-300"
                >
                    ← Use a different email
                </Link>
            }
        >
            <StepIndicator step={2} total={3} label="Verify code" />

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    label="Reset code"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
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
                    disabled={loading || otp.length < 6}
                >
                    {loading ? "Verifying..." : "Verify code"}
                </Button>
            </form>
        </AuthLayout>
    )
}

export default VerifyResetOtp