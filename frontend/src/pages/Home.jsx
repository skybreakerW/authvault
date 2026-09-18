import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import Navbar from "../components/Navbar.jsx"

const Home = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <>
                <div className="min-h-[60vh] grid place-items-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-500" />
                </div>
            </>
        )
    }

    if (!user) {
        return (
                <main className="mx-auto max-w-6xl px-4">
                    {/* Hero */}
                    <section className="py-20 sm:py-28 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-400 mb-6">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Secure by default
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-100">
                            Authentication you can{" "}
                            <span className="text-emerald-400">trust</span>.
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-slate-400">
                            AuthVault is a full-stack authentication service with
                            JWT sessions, email verification, and role-based
                            access control — built to be dropped into any app.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                to="/signup"
                                className="w-full sm:w-auto rounded-lg bg-emerald-500 px-5 py-2.5
                                    font-medium text-slate-950 transition hover:bg-emerald-400"
                            >
                                Get started
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
                    </section>

                    {/* Feature grid */}
                    <section className="pb-24 grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                title: "JWT Sessions",
                                body: "Access tokens with refresh, stored safely and validated on every request.",
                            },
                            {
                                title: "Email Verification",
                                body: "Signup flow confirms email ownership before granting full access.",
                            },
                            {
                                title: "Role-based Access",
                                body: "User and admin roles with protected routes on both client and server.",
                            },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
                            >
                                <h3 className="text-sm font-semibold text-slate-100">
                                    {f.title}
                                </h3>
                                <p className="mt-1.5 text-sm text-slate-400">
                                    {f.body}
                                </p>
                            </div>
                        ))}
                    </section>
                </main>
        )
    }

    // Logged-in view
    return (
            <main className="mx-auto max-w-3xl px-4 py-16">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
                    <p className="text-sm text-emerald-400 font-medium">
                        Signed in
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold text-slate-100">
                        Welcome back, {user.name}
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        You&apos;re authenticated. Head to your dashboard to
                        manage your vault.
                    </p>

                    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                            <dt className="text-xs uppercase tracking-wider text-slate-500">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm text-slate-200 break-all">
                                {user.email}
                            </dd>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                            <dt className="text-xs uppercase tracking-wider text-slate-500">
                                Role
                            </dt>
                            <dd className="mt-1">
                                <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                                    {user.role}
                                </span>
                            </dd>
                        </div>
                    </dl>

                    <Link
                        to="/dashboard"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-500
                            px-5 py-2.5 font-medium text-slate-950 transition hover:bg-emerald-400"
                    >
                        Go to dashboard
                        <span aria-hidden>→</span>
                    </Link>
                </div>
            </main>
    )
}

export default Home