import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js"
import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin : "http://localhost:5173", credentials : true}))

const Port = process.env.Port || 5000;

app.use("/api/auth", authRouter);

app.get('/',(req,res) => {
    res.send("Hi there");
    return;
})

app.listen(Port, async() => {
    await connectDB();
    console.log("server is running on 3000 ");
}) 