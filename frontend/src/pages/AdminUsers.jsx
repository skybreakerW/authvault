import { useEffect, useMemo, useState } from "react"
import api from "../services/api.js"
import PageLoader from "../components/PageLoader.jsx"
import Input from "../components/Input.jsx"

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [query, setQuery] = useState("")

    const fetchUsers = async () => {
        setLoading(true)
        setError("")

        try {
            const response = await api.get("/api/admin/users")
            setUsers(response.data.users)
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load users."
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return users

        return users.filter(
            (u) =>
                u.name?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q) ||
                u.role?.toLowerCase().includes(q)
        )
    }, [users, query])

    const stats = useMemo(() => {
        const admins = users.filter((u) => u.role === "admin").length
        const verified = users.filter((u) => u.isEmailVerified).length
        return { total: users.length, admins, verified }
    }, [users])

    if (loading) return <PageLoader label="Loading users…" />

    if (error) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <PageHeader />
                <div className="mt-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
                    <p className="text-sm text-rose-300">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="mt-4 rounded-lg border border-rose-500/40 px-3.5 py-2 text-sm
                            text-rose-200 transition hover:bg-rose-500/15"
                    >
                        Try again
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-10">
            <PageHeader />

            {/* Stat strip */}
            <section className="mt-8 grid gap-4 sm:grid-cols-3">
                <Stat label="Total users" value={stats.total} />
                <Stat label="Admins" value={stats.admins} tone="emerald" />
                <Stat label="Email verified" value={stats.verified} />
            </section>

            {/* Search */}
            {users.length > 0 && (
                <div className="mt-8 max-w-sm">
                    <Input
                        id="search"
                        type="search"
                        placeholder="Search by name, email, or role…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            )}

            {/* Empty states */}
            {users.length === 0 ? (
                <EmptyState
                    title="No users yet"
                    body="New signups will appear here."
                />
            ) : filteredUsers.length === 0 ? (
                <EmptyState
                    title="No matches"
                    body={`No users match "${query}".`}
                />
            ) : (
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-800 bg-slate-950/50">
                            <tr className="text-xs uppercase tracking-wider text-slate-500">
                                <th className="px-5 py-3 font-medium">Name</th>
                                <th className="px-5 py-3 font-medium">Email</th>
                                <th className="px-5 py-3 font-medium">Role</th>
                                <th className="px-5 py-3 font-medium">Verified</th>
                                <th className="px-5 py-3 font-medium">Created</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800">
                            {filteredUsers.map((user) => (
                                <UserRow key={user._id} user={user} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    )
}

/* ---------- Presentational pieces ---------- */

const PageHeader = () => (
    <div>
        <p className="text-sm text-emerald-400">Admin</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
            Users
        </h1>
        <p className="mt-1 text-sm text-slate-400">
            All registered accounts. Only visible to admins.
        </p>
    </div>
)

const Stat = ({ label, value, tone }) => (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-xs uppercase tracking-wider text-slate-500">
            {label}
        </p>
        <p
            className={`mt-2 text-2xl font-semibold ${
                tone === "emerald" ? "text-emerald-400" : "text-slate-100"
            }`}
        >
            {value}
        </p>
    </div>
)

const EmptyState = ({ title, body }) => (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
        <p className="text-slate-300">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{body}</p>
    </div>
)

const UserRow = ({ user }) => {
    const isAdmin = user.role === "admin"
    const isVerified = user.isEmailVerified

    return (
        <tr className="transition hover:bg-slate-800/30">
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <Avatar name={user.name} />
                    <span className="font-medium text-slate-100 truncate">
                        {user.name}
                    </span>
                </div>
            </td>

            <td className="px-5 py-3.5 text-slate-300 break-all">
                {user.email}
            </td>

            <td className="px-5 py-3.5">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium
                        ${
                            isAdmin
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border-slate-700 bg-slate-800/60 text-slate-300"
                        }`}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {user.role}
                </span>
            </td>

            <td className="px-5 py-3.5">
                {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
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
                        Verified
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                        Pending
                    </span>
                )}
            </td>

            <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
            </td>
        </tr>
    )
}

const Avatar = ({ name = "" }) => {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("")

    return (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-800 text-xs font-medium text-slate-300">
            {initials || "?"}
        </div>
    )
}

export default AdminUsers