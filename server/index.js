import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";

const app = express();

// Load environment variables from .env file
dotenv.config();

const localURL = "http://localhost:5173";

const remoteURL = "https://mixvibe.vercel.app";

const corsOption = {
    origin: localURL,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());


// Connect the database
connectDb();


app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes)


app.get("/", (req, res) => {
    const message = `Server running on port ${process.env.PORT}`;
    return res.status(200).send({ status: "success", message });
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})