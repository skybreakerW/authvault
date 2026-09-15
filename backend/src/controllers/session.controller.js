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

        return res.status(200).json({
            sessions
        })

    } catch (error) {
        console.log("Get sessions error:", error)

        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}

export {
    getMySessions
}