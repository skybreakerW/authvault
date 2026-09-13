
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isValidPassword = (password) => {
    return password.length >= 8
}

const isValidName = (name) => {
    return name.length >= 3 && name.length <= 50
}

export {
    isValidEmail,
    isValidPassword,
    isValidName,
}

