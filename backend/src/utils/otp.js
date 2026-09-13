import crypto from "crypto"


const generateOTP = () => {
    const randomNumber = crypto.randomInt(100000, 1000000)
    return randomNumber.toString()
}

export { generateOTP }