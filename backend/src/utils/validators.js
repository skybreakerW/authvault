const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 128

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isValidPassword = (password) => {
    return (
        typeof password === "string" &&
        password.length >= PASSWORD_MIN_LENGTH &&
        password.length <= PASSWORD_MAX_LENGTH
    )
}

const isValidName = (name) => {
    return name.length >= 3 && name.length <= 50
}

export {
    isValidEmail,
    isValidPassword,
    isValidName,
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
}