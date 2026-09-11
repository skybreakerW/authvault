import "./load-env.js"
import app from "./src/app.js"



const port = process.env.PORT || 8080


const startServer = async() => {
    try {
        app.listen(port, () => {
            console.log(`Server listening on ${port}`)
        })
    } catch (error) {
        console.error("Failed to start server: ", error)
        process.exit(1)
    }
}

startServer()