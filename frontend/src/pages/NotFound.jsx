import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const NotFound = () => {
    const { user } = useAuth()

    // Send authenticated users somewhere useful; unauthenticated to Home
    const homeLink = user ? "/dashboard" : "/"
    const homeLabel = user ? "Back to dashboard" : "Back to home"

    return (
        <main className="mx-auto max-w-2xl px-4 py-24 text-center">
            <p className="text-sm font-medium text-emerald-400">404</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-100">
                Page not found
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-slate-400">
                The page you're looking for doesn't exist, or you may not have
                permission to view it.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                    to={homeLink}
                    className="w-full sm:w-auto rounded-lg bg-emerald-500 px-5 py-2.5
                        font-medium text-slate-950 transition hover:bg-emerald-400"
                >
                    {homeLabel}
                </Link>
                <Link
                    to="/login"
                    className="w-full sm:w-auto rounded-lg border border-slate-800
                        px-5 py-2.5 font-medium text-slate-200 transition
                        hover:border-slate-700 hover:bg-slate-900"
                >
                    Sign in
                </Link>
            </div>
        </main>
    )
}

export default NotFound