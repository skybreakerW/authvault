import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Dashboard = () => {
    const { user } = useAuth()

    const isAdmin = user.role === "admin"

    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-400">Dashboard</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                        Welcome back, {user.name.split(" ")[0]}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium
                            ${
                                isAdmin
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                    : "border-slate-700 bg-slate-800/60 text-slate-300"
                            }`}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {isAdmin ? "Admin" : "Member"}
                    </span>
                </div>
            </div>

            {/* Stat cards */}
            <section className="mt-8 grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Account status"
                    value="Active"
                    hint="Email verified"
                    tone="emerald"
                />
                <StatCard
                    label="Role"
                    value={user.role}
                    hint={isAdmin ? "Full access" : "Standard access"}
                />
                <StatCard
                    label="Security"
                    value="JWT"
                    hint="Session-based auth"
                />
            </section>

            {/* Account info + quick actions */}
            <section className="mt-8 grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Account information
                    </h2>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                        <InfoField label="Name" value={user.name} />
                        <InfoField label="Email" value={user.email} />
                        <InfoField label="Role" value={user.role} />
                        <InfoField label="User ID" value={`#${user.id}`} mono />
                    </dl>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Quick actions
                    </h2>

                    <div className="mt-5 flex flex-col gap-2">
                        <ActionLink to="/sessions">
                            Manage sessions
                        </ActionLink>
                        <ActionLink to="/change-password">
                            Change password
                        </ActionLink>
                        {isAdmin && (
                            <ActionLink to="/admin/users" accent>
                                Admin panel
                            </ActionLink>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

/* ---------- Small presentational helpers ---------- */

const StatCard = ({ label, value, hint, tone }) => {
    const toneClasses =
        tone === "emerald"
            ? "text-emerald-400"
            : "text-slate-100"

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
                {label}
            </p>
            <p className={`mt-2 text-2xl font-semibold capitalize ${toneClasses}`}>
                {value}
            </p>
            {hint && (
                <p className="mt-1 text-xs text-slate-500">{hint}</p>
            )}
        </div>
    )
}

const InfoField = ({ label, value, mono }) => (
    <div>
        <dt className="text-xs uppercase tracking-wider text-slate-500">
            {label}
        </dt>
        <dd
            className={`mt-1 text-sm text-slate-200 break-all ${
                mono ? "font-mono" : ""
            }`}
        >
            {value}
        </dd>
    </div>
)

const ActionLink = ({ to, children, accent }) => (
    <Link
        to={to}
        className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition
            ${
                accent
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
                    : "border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40 hover:text-slate-100"
            }`}
    >
        {children}
        <span aria-hidden>→</span>
    </Link>
)

export default Dashboard