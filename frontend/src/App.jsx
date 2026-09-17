import { Routes, Route } from "react-router-dom"

import Signup from "./pages/Signup.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"

const App = () => {
    return (
        
    <Routes>
        <Route
            path="/"
            element={<h1>AuthVault</h1>}
        />

        <Route
            path="/signup"
            element={<Signup />}
        />

        <Route
            path="/verify-email"
            element={<VerifyEmail />}
        />
    </Routes>
        
    )
}

export default App