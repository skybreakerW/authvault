import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"
import AuthLayout from "../components/AuthLayout.jsx"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"
import StepIndicator from "../components/StepIndicator.jsx"

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const resetToken = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const errors = {}

        if (!password) {
            errors.password = "Enter a new password."
        } else if (password.length < 8) {
            errors.password = "Must be at least 8 characters."
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match."
        }

        return errors
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError("")

        const errors = validate()
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors)
            return
        }

        setFieldErrors({})
        setLoading(true)

        try {
            const csrfToken = await getCSRFToken()

            await api.post(
                "/api/auth/reset-password",
                { resetToken, newPassword: password },
                { headers: { "X-CSRF-Token": csrfToken } }
            )

            setSuccess(true)
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something went wrong."
            )
        } finally {
            setLoading(false)
        }
    }

    // Guard: no token in URL
    if (!resetToken) {
        return (
            <AuthLayout
                title="Invalid reset link"
                subtitle="This link is missing or has expired."
                footer={
                    <Link
                        to="/forgot-password"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Request a new code
                    </Link>
                }
            >
                <p className="text-sm text-slate-400">
                    Reset links expire quickly for security. Please start over.
                </p>
            </AuthLayout>
        )
    }

    // Success state
    if (success) {
        return (
            <AuthLayout
                title="Password reset"
                subtitle="You can now sign in with your new password."
                footer={
                    <Link
                        to="/login"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Sign in →
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
                    <p className="text-sm text-emerald-300">
                        Your password has been updated. All prior sessions have been signed out.
                    </p>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="Set a new password"
            subtitle="Choose a strong password you haven't used before."
            footer={
                <Link
                    to="/login"
                    className="text-emerald-400 hover:text-emerald-300"
                >
                    ← Back to sign in
                </Link>
            }
        >
            <StepIndicator step={3} total={3} label="New password" />

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                    id="password"
                    type="password"
                    label="New password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={fieldErrors.password}
                    required
                />

                <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirm new password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={fieldErrors.confirmPassword}
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
                    {loading ? "Resetting..." : "Reset password"}
                </Button>
            </form>
        </AuthLayout>
    )
}

export default ResetPassword