import bcrypt from "bcrypt"

const isPasswordReused = async (password, passwordHistory) => {
    for (const oldHash of passwordHistory) {
        const isMatch = await bcrypt.compare(
            password,
            oldHash
        )

        if (isMatch) {
            return true
        }
    }

    return false
}

export { isPasswordReused }