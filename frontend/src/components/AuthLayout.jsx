import { Link } from "react-router-dom"

const AuthLayout = ({ title, subtitle, children, footer }) => {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Brand */}
                <Link
                    to="/"
                    className="flex items-center justify-center gap-2 mb-8"
                >
                    <div className="h-9 w-9 rounded-lg bg-emerald-500 grid place-items-center">
                        <svg
                            className="h-5 w-5 text-slate-950"
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
                    <span className="text-xl font-semibold tracking-tight text-slate-100">
                        AuthVault
                    </span>
                </Link>

                {/* Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/40">
                    <h1 className="text-2xl font-semibold text-slate-100">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-1 mb-6 text-sm text-slate-400">
                            {subtitle}
                        </p>
                    )}

                    {children}
                </div>

                {footer && (
                    <p className="mt-6 text-center text-sm text-slate-500">
                        {footer}
                    </p>
                )}
            </div>
        </div>
    )
}

export default AuthLayout