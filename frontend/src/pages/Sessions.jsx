import { useEffect, useState } from "react"
import getCSRFToken from "../services/csrf.js"
import api from "../services/api.js"
import PageLoader from "../components/PageLoader.jsx"
import { useAuth } from "../context/AuthContext.jsx"

/* ---------- User-agent parsing (tiny, no library) ---------- */

const parseUserAgent = (ua = "") => {
    const browser =
        /Edg\//.test(ua) ? "Edge"
        : /Chrome\//.test(ua) ? "Chrome"
        : /Firefox\//.test(ua) ? "Firefox"
        : /Safari\//.test(ua) ? "Safari"
        : "Unknown browser"

    const os =
        /Windows/.test(ua) ? "Windows"
        : /Mac OS X/.test(ua) ? "macOS"
        : /Android/.test(ua) ? "Android"
        : /iPhone|iPad/.test(ua) ? "iOS"
        : /Linux/.test(ua) ? "Linux"
        : "Unknown OS"

    return { browser, os }
}

const formatRelativeTime = (dateString) => {
    if (!dateString) return "—"

    const date = new Date(dateString)
    const diffMs = Date.now() - date.getTime()
    const mins = Math.round(diffMs / 60000)

    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`

    const hours = Math.round(mins / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.round(hours / 24)
    return `${days}d ago`
}

/* ---------- Page ---------- */

const Sessions = () => {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [revokingId, setRevokingId] = useState(null)

    const fetchSessions = async () => {
        try {
            const response = await api.get("/api/auth/sessions")
            setSessions(response.data.sessions)
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load sessions."
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSessions()
    }, [])
    const { logoutAll, logoutOtherDevices } = useAuth()
    const handleLogoutOtherDevices = async () => {
        try {
            await logoutOtherDevices()
            await fetchSessions() // refresh the list
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to log out other devices."
            )
        }
    }

    const handleLogoutAll = async () => {
        try {
            await logoutAll()
            // logoutAll() sets user to null in context → ProtectedRoute
            // will redirect to /login automatically. No manual nav needed.
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to log out all devices."
            )
        }
    }

    const handleRevoke = async (sessionId) => {
        setRevokingId(sessionId)

        try {
            const csrfToken = await getCSRFToken()

            await api.delete(`/api/auth/sessions/${sessionId}`, {
                headers: { "X-CSRF-Token": csrfToken },
            })

            setSessions((prev) =>
                prev.filter((s) => s._id !== sessionId)
            )
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to revoke session."
            )
        } finally {
            setRevokingId(null)
        }
    }

    if (loading) return <PageLoader label="Loading sessions…" />

    return (
        <main className="mx-auto max-w-4xl px-4 py-10">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-400">Security</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
                        Active sessions
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Devices currently signed in to your account.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleLogoutOtherDevices}
                        className="rounded-lg border border-slate-800 px-3.5 py-2 text-sm
                            text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
                    >
                        Log out other devices
                    </button>
                    <button
                        onClick={handleLogoutAll}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-sm
                            text-rose-300 transition hover:bg-rose-500/15 hover:border-rose-500/50"
                    >
                        Log out all
                    </button>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div
                    role="alert"
                    className="mt-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
                >
                    {error}
                </div>
            )}

            {/* Sessions list */}
            {sessions.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
                    <p className="text-slate-300">No active sessions</p>
                    <p className="mt-1 text-sm text-slate-500">
                        You'll see your signed-in devices here.
                    </p>
                </div>
            ) : (
                <ul className="mt-6 space-y-3">
                    {sessions.map((session) => (
                        <SessionCard
                            key={session._id}
                            session={session}
                            onRevoke={handleRevoke}
                            revoking={revokingId === session._id}
                        />
                    ))}
                </ul>
            )}
        </main>
    )
}

/* ---------- Session card ---------- */

const SessionCard = ({ session, onRevoke, revoking }) => {
    const { browser, os } = parseUserAgent(session.userAgent)
    const isCurrent = session.isCurrent

    return (
        <li
            className={`rounded-xl border bg-slate-900 p-5 transition
                ${
                    isCurrent
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-slate-800 hover:border-slate-700"
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg
                            ${
                                isCurrent
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : "bg-slate-800 text-slate-300"
                            }`}
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <path d="M8 21h8M12 17v4" />
                        </svg>
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-slate-100 truncate">
                                {os} · {browser}
                            </p>
                            {isCurrent && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    This device
                                </span>
                            )}
                        </div>

                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span className="font-mono">
                                {session.ipAddress || "Unknown IP"}
                            </span>
                            <span>
                                Last used {formatRelativeTime(session.lastUsedAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {!isCurrent && (
                    <button
                        onClick={() => onRevoke(session._id)}
                        disabled={revoking}
                        className="shrink-0 rounded-lg border border-slate-800 px-3 py-1.5 text-xs
                            text-slate-300 transition
                            hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300
                            disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {revoking ? "Revoking…" : "Revoke"}
                    </button>
                )}
            </div>
        </li>
    )
}

export default Sessions