import mongoose from "mongoose"

const DB_NAME = "AuthVault"

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
        console.log(`Connected to DB. Host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Connection failed to DB!", error)
        throw error
    }

}    


export default connectDB