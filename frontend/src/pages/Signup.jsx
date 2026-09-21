import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api.js"
import AuthLayout from "../components/AuthLayout.jsx"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"

import { User, Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate()
    const [viewPassword, setViewPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [fieldErrors, setFieldErrors] = useState({})
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const showPassword = () => {
        setViewPassword((prev) => (!prev))
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        
        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }))

        // Clear that field's error as soon as the user edits it
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const validate = () => {
        const errors = {}

        if (!formData.name.trim()) {
            errors.name = "Name is required."
        } else if (formData.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters."
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required."
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            errors.email = "Enter a valid email address."
        }

        if (!formData.password) {
            errors.password = "Password is required."
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters."
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
            await api.post("/api/auth/signup", formData)

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
        <AuthLayout
            title="Create your account"
            subtitle="Start securing your vault in seconds"
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-emerald-400 hover:text-emerald-300"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="relative">
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        label="Name"
                        placeholder="Ada Lovelace"
                        value={formData.name}
                        onChange={handleChange}
                        error={fieldErrors.name}
                        autoComplete="name"
                        className="px-12"
                    />
                    <User size={20} strokeWidth={1.5} className="absolute top-9 left-4" />
                </div>
                <div className="relative">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                        className="px-12"
                        
                    />
                    <Mail size={20} strokeWidth={1} className="absolute top-1/2 left-4"/>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={viewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg bg-slate-950 px-12 py-2.5 text-slate-100
                            placeholder-slate-500 border border-slate-800 transition
                            focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                    />
                    <LockKeyhole size={20} strokeWidth={1} className="absolute top-1/4 left-4" />
                    <button 
                    className="absolute right-4 top-1/4 cursor-pointer"
                    onClick={showPassword}
                    >
                        {viewPassword ? <Eye size={20} strokeWidth={1}/> : <EyeOff size={20} strokeWidth={1}/>}
                    </button>
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
                    {loading ? "Creating account..." : "Create account"}
                </Button>
            </form>
        </AuthLayout>
    )
}

export default Signup