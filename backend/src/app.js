import express from "express"
import authRouter from "./routes/auth.route.js"


const app = express()


app.use(express.json())

app.use("/api/auth", authRouter)

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "AuthVault API is running"
    })
})


export default app