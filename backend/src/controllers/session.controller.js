import Session from "../models/session.model.js"

const getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            user: req.user._id,
            revokedAt: null,
            expiresAt: { $gt: new Date() }
        })
            .select("-refreshTokenHash")
            .sort({ createdAt: -1 })

        const sessionsWithCurrentStatus = sessions.map((session) => ({
            ...session.toObject(),
            isCurrent:
            session._id.toString() === req.sessionId
        }))

        return res.status(200).json({
            sessions: sessionsWithCurrentStatus
        })

    } catch (error) {
        console.log("Get sessions error:", error)

        return res.status(500).json({
            message: "Something went wrong."
        })
    }
        }

const revokeSession = async (req, res) => {
    try {
        const { sessionId } = req.params

        if (!sessionId) {
            return res.status(400).json({
                message: "Session ID is required."
            })
        }

        const session = await Session.findOne({
            _id: sessionId,
            user: req.user._id,
            revokedAt: null
        })

        if (!session) {
            return res.status(404).json({
                message: "Session not found."
            })
        }

        session.revokedAt = new Date()

        await session.save()

        return res.status(200).json({
            message: "Session revoked successfully."
        })

    } catch (error) {
        console.log("Revoke session error:", error)

        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}

export {
    getMySessions,
    revokeSession
}