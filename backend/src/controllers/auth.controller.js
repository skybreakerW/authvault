import User from  "../models/user.model.js"
import bcrypt from "bcrypt"
import { isValidEmail, isValidPassword, isValidName, } from "../utils/validators.js"
import EmailVerification from "../models/emailVerification.model.js "
import { createEmailVerification } from "../services/otp.service.js"

const signup = async(req, res) => {

    try {
            const { name, email, password} = req.body
        
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

            const { otp, expiresAt} = createEmailVerification()

            const verifyEmail = await EmailVerification.create({
                user: user._id,
                otp,
                expiresAt,
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






export { signup }