import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

const requiredEnv = [
    "DB_URI",
    "JWT_SECRET",
    "FRONTEND_URL",
    "NODE_ENV"
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}