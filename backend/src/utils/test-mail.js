import "../../load-env.js"
import transporter from "../configs/mail.js"

const testConnection = async () => {
    try {
        await transporter.verify()
        console.log("SMTP connection is ready")
    } catch (error) {
        console.error("SMTP connection failed:", error)
    }
}

testConnection()

