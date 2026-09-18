import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"
import { useAuth } from "../context/AuthContext.jsx"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"

const ChangePassword = () => {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const errors = {}

        if (!currentPassword) {
            errors.currentPassword = "Enter your current password."
        }

        if (!newPassword) {
            errors.newPassword = "Enter a new password."
        } else if (newPassword.length < 8) {
            errors.newPassword = "Must be at least 8 characters."
        } else if (newPassword === currentPassword) {
            errors.newPassword = "New password must differ from current."
        }

        if (newPassword !== confirmPassword) {
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
                "/api/auth/change-password",
                { currentPassword, newPassword },
                { headers: { "X-CSRF-Token": csrfToken } }
            )

            // Backend invalidated all sessions — kill client-side auth state
            // so ProtectedRoute doesn't keep us on a page we can't use.
            setUser(null)
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

    // Success state — user is now logged out
    if (success) {
        return (
            <main className="mx-auto max-w-2xl px-4 py-10">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-slate-950">
                            <svg
                                className="h-4 w-4"
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
                        <div>
                            <h1 className="text-lg font-semibold text-emerald-300">
                                Password updated
                            </h1>
                            <p className="mt-1 text-sm text-emerald-200/80">
                                For your security, all sessions have been signed out.
                                Please sign in again with your new password.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <Link
                            to="/login"
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium
                                text-slate-950 transition hover:bg-emerald-400"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/"
                            className="rounded-lg border border-slate-700 px-4 py-2 text-sm
                                text-slate-300 transition hover:border-slate-600 hover:text-slate-100"
                        >
                            Back to home
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <div>
                <p className="text-sm text-slate-400">Settings</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                    Change password
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                    You'll be signed out of all devices after updating.
                </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <Input
                        id="currentPassword"
                        type="password"
                        label="Current password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        error={fieldErrors.currentPassword}
                        required
                    />

                    <div className="border-t border-slate-800 pt-4">
                        <Input
                            id="newPassword"
                            type="password"
                            label="New password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            error={fieldErrors.newPassword}
                            required
                        />
                        {!fieldErrors.newPassword && (
                            <p className="mt-1.5 text-xs text-slate-500">
                                At least 8 characters, different from your current password.
                            </p>
                        )}
                    </div>

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

                    <div className="flex items-center justify-between gap-2 pt-2">
                        <p className="text-xs text-slate-500">
                            All devices will be signed out.
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="rounded-lg border border-slate-800 px-4 py-2.5 text-sm
                                    text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
                            >
                                Cancel
                            </button>
                            <Button type="submit" loading={loading}>
                                {loading ? "Updating..." : "Update password"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default ChangePassword