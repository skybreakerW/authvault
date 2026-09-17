import { useAuth } from "./context/AuthContext.jsx"

function App() {

    const { user, loading } = useAuth()

    return (
        <div>
            <h1>AuthVault</h1>

            <p>
                User: {user ? user.name : "Not authenticated"}
            </p>

            <p>
                Loading: {loading ? "Yes" : "No"}
            </p>
        </div>
    )
}

export default App