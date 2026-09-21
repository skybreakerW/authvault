import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"
import AuthLayout from "../components/AuthLayout.jsx"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"
import StepIndicator from "../components/StepIndicator.jsx"

import { Mail } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const errors = {}
        if (!email.trim()) {
            errors.email = "Email is required."
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Enter a valid email address."
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
                "/api/auth/forgot-password",
                { email },
                { headers: { "X-CSRF-Token": csrfToken } }
            )

            navigate(
                `/verify-reset-otp?email=${encodeURIComponent(email)}`
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
        <AuthLayout
            title="Reset your password"
            subtitle="Enter the email on your account and we'll send a reset code."
            footer={
                <>
                    Remembered it?{" "}
                    <Link
                        to="/login"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Back to sign in
                    </Link>
                </>
            }
        >
            <StepIndicator step={1} total={3} label="Request code" />

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="relative">
                    <Input
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={fieldErrors.email}
                        required
                        className="px-12"
                    />
                    <Mail color="#ffffff" strokeWidth={1} className="absolute top-9 left-3" />
                </div>

                {error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-300"
                    >
                        {error}
                    </div>
                )}

                <Button type="submit" loading={loading}>
                    {loading ? "Sending..." : "Send reset code"}
                </Button>
            </form>
        </AuthLayout>
    )
}


export default ForgotPassword