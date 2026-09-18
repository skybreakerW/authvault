import { useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../services/api.js"
import getCSRFToken from "../services/csrf.js"

const ChangePassword = () => {
    const navigate = useNavigate()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setMessage("")
        setError("")

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setLoading(true)

        try {
            const csrfToken = await getCSRFToken()

            const response = await api.post(
                "/api/auth/change-password",
                {
                    currentPassword,
                    newPassword,
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
            <h1>Change Password</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="currentPassword">
                        Current Password
                    </label>

                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(event) =>
                            setCurrentPassword(
                                event.target.value
                            )
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="newPassword">
                        New Password
                    </label>

                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(event) =>
                            setNewPassword(
                                event.target.value
                            )
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">
                        Confirm New Password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Changing..."
                        : "Change Password"}
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

export default ChangePassword