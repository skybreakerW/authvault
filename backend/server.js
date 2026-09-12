import "./load-env.js"
import app from "./src/app.js"
import connectDB from "./src/configs/db.js"

const port = process.env.PORT || 8080


const startServer = async() => {
    try {
        await connectDB()
        app.listen(port, () => {
            console.log(`Server listening on ${port}`)
        })
    } catch (error) {
        console.error("Failed to start server: ", error)
        process.exit(1)
    }
}

startServer()