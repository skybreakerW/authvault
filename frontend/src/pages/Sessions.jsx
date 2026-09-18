import { useEffect, useState } from "react"
import getCSRFToken from "../services/csrf.js"
import api from "../services/api.js"

const Sessions = () => {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    const handleRevoke = async (sessionId) => {
        try {
            const csrfToken = await getCSRFToken()

            await api.delete(
                `/api/auth/sessions/${sessionId}`,
                {
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            )

            setSessions((previousSessions) =>
                previousSessions.filter(
                    (session) => session._id !== sessionId
                )
            )
        } catch (error) {
            console.log(
                "Revoke session error:",
                error.response?.data
            )

            setError(
                error.response?.data?.message ||
                "Failed to revoke session."
            )
        }
    }
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.get(
                    "/api/auth/sessions"
                )

                console.log(
                    "Sessions response:",
                    response.data
                )

                setSessions(response.data.sessions)
            } catch (error) {
                console.log(
                    "Sessions error:",
                    error.response?.data
                )

                setError(
                    error.response?.data?.message ||
                    "Failed to load sessions."
                )
            } finally {
                setLoading(false)
            }
        }

        fetchSessions()
    }, [])

    if (loading) {
        return <p>Loading sessions...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div>
            <h1>Sessions</h1>

            {sessions.length === 0 ? (
                <p>No active sessions found.</p>
            ) : (
                sessions.map((session) => (
                    <div key={session._id}>
                        <p>
                            Session ID: {session.id}
                        </p>

                        <p>
                            User Agent: {session.userAgent}
                        </p>

                        <p>
                            IP Address: {session.ipAddress}
                        </p>

                        <p>
                            Last Used: {session.lastUsedAt}
                        </p>
                        {session.isCurrent ? (
                            <p>Current session</p>
                        ) : (
                            <button
                                onClick={() => handleRevoke(session._id)}
                            >
                                Revoke
                            </button>
                        )}

                        <hr />
                    </div>
                ))
            )}
        </div>
    )
}

export default Sessions