import transporter from "../configs/mail.js"

const sendVerificationEmail = async (email, otp) => {

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Verify your AuthVault account",
        text: `Your AuthVault verification code is ${otp}. This code will expire in 15 minutes.`,
    }

    await transporter.sendMail(mailOptions)
}

export { sendVerificationEmail }

