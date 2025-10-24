import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path : "./.env"})

export const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB successfully "+ conn.connection.host);
    } catch (error) {
        console.log("Error while connecting to DB " + error.message);
        process.exit(1);
    }
}