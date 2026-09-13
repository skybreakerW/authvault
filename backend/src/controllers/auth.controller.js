import User from  "../models/user.model.js"
import bcrypt from "bcrypt"
import { isValidEmail, isValidPassword, isValidName, } from "../utils/validators.js"
import EmailVerification from "../models/emailVerification.model.js "
import { createEmailVerification } from "../services/otp.service.js"
import { sendVerificationEmail } from "../services/email.service.js"

const signup = async(req, res) => {

    try {
            const { name, email, password } = req.body
        
            if(!name || !email || !password){
                return res.status(400).json({
                    message: "All fields are required."
                })
            }

            if (!isValidName(name)) {
                return res.status(400).json({
                    message: "Name must be between 3 and 50 characters."
                })
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({
                    message: "Please provide a valid email address."
                })
            }

            if (!isValidPassword(password)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters."
                })
            }
        
            const userExists = await User.findOne({email})
            if(userExists){
                return res.status(409).json({
                    message: "Email is already registered."
                })
            }
        
            const hashPassword = await bcrypt.hash(password, 10)
            const normalizedEmail = email.trim().toLowerCase()
        
            const user = await User.create({
                name,
                email: normalizedEmail,
                password: hashPassword,
            })

            const { otp, expiresAt } = createEmailVerification()

            const verifyEmail = await EmailVerification.create({
                user: user._id,
                otp,
                expiresAt,
            })

            try {
                await sendVerificationEmail(user.email, otp)
            } catch (error) {
                console.error("Verification email failed:", emailError)
            }

                await EmailVerification.deleteOne({
                    user: user._id,
                })

                await User.deleteOne({
                    _id: user._id,
                })

            return res.status(201).json({
                message: "User registered successfully.",
                user: {
                    id: user._id,
                    name: user.name, 
                    email: user.email, 
                    role: user.role, 
                    isEmailVerified: user.isEmailVerified,
                }
            })

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Something went wrong."
        });
    }
   
}

const verifyEmail = async(req,res) => {
    try {
            const { email, otp } = req.body
        
            if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required."
            })
            }
            const normalizedEmail = email.trim().toLowerCase()
            const user = await User.findOne({
                email: normalizedEmail
            })
            if(!user){
               return res.status(404).json({
                message: "User not found."
            }) 
            }

            const verification = await EmailVerification.findOne({
                user: user._id
            })
            if(!verification){
                return res.status(404).json({
                message: "Verification record not found."
            })
            }

            if(verification.expiresAt < new Date()){
                return res.status(400).json({
                    message: "OTP has expired."
                })
            }

            if(verification.attempts >= 5){
                return res.status(400).json({
                    message: "Too many incorrect attempts. Try again later."
                })
            }

            if(otp != verification.otp){
                verification.attempts += 1
                await verification.save()

                return res.status(400).json({
                    message: "Invalid OTP."
                })
            }

            if (user.isEmailVerified) {
                return res.status(400).json({
                    message: "Email is already verified."
                })
            }

            user.isEmailVerified = true
            await user.save()

            await EmailVerification.deleteOne({
                _id: verification._id,
            })

            return res.status(200).json({
                message: "Email verified successfully."
            })

    } catch (error) {
        console.error("Email verification error:", error)
        return res.status(500).json({
            message: "Something went wrong."
        })
    }

}

const login = async(req, res) => {
    try {
        const { email, password } = req.body

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required."
            })
        }
        const normalizedEmail = email.trim().toLowerCase()
        
        const user = await User.findOne({ email: normalizedEmail })
        if(!user){
            return res.status(401).json({
            message: "Invalid email or password."
        }) 
        }

        if(!user.isEmailVerified){
            return res.status(403).json({
                message: "Please verify before logging in."
            })
        }

        const isPasswordValid = bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid email or password."
            })
        }


        return res.status(200).json({
            message: "Logged in successfully."
        })

    } catch (error) {
        console.log("Login error: ", error)

        return res.status(500).json({
            message: "Something went wrong."
        })
        
    }

}





export { signup, verifyEmail, login }