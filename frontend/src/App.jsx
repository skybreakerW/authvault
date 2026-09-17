import { Routes, Route } from "react-router-dom"

import Signup from "./pages/Signup.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"
import Login from "./pages/Login.jsx"

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

        <Route
            path="/login"
            element={<Login />}
        />
    </Routes>
        
    )
}

export default App