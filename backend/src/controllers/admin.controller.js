import User from "../models/user.model.js"

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")

        return res.status(200).json({
            users
        })

    } catch (error) {
        console.log("Get all users error:", error)

        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}

export {
    getAllUsers
}