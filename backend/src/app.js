import express from "express"
import helmet from "helmet"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import adminRouter from "./routes/admin.route.js"
import cors from "cors"


const app = express()
app.set("trust proxy", 1)
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    })
)

app.use("/api/admin", adminRouter)
app.use("/api/auth", authRouter)

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "AuthVault API is running"
    })
})


export default app