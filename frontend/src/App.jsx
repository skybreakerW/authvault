import { useEffect } from "react"
import api from "./services/api.js"

function App() {

    useEffect(() => {
        const testBackend = async () => {
            try {
                const response = await api.get("/api/health")

                console.log("Backend response:", response.data)
            } catch (error) {
                console.error("Backend connection failed:", error)
            }
        }

        testBackend()
    }, [])

    return (
        <div>
            <h1>AuthVault</h1>
            <p>Secure authentication platform</p>
        </div>
    )
}

export default App