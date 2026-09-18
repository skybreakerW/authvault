import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
        } finally {
            navigate("/login")
        }
    }

    return (
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500 grid place-items-center">
                        <svg
                            className="h-4 w-4 text-slate-950"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                    </div>
                    <span className="font-semibold tracking-tight text-slate-100">
                        AuthVault
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-sm text-slate-300 transition hover:text-slate-100"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/sessions"
                                className="hidden text-sm text-slate-300 transition hover:text-slate-100 sm:inline"
                            >
                                Sessions
                            </Link>

                            {/* Admin-only link — shows off RBAC in the UI */}
                            {user.role === "admin" && (
                                <Link
                                    to="/admin/users"
                                    className="hidden text-sm text-emerald-400 transition hover:text-emerald-300 sm:inline"
                                >
                                    Admin
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-slate-800 px-3 py-1.5 text-sm
                                    text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-slate-300 transition hover:text-slate-100"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-sm font-medium
                                    text-slate-950 transition hover:bg-emerald-400"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar