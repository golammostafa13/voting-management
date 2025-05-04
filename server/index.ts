import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import connectDB from './config/connectDb'
import corsOptions from './config/corseOption'
import studentRoutes from "./routes/studentRoutes"
import { createAccessToken } from './utils/jwt'

dotenv.config()
connectDB();
const app = express()
const SERVER_PORT = process.env.SERVER_PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'


// Initialize helmet with HSTS configuration
const helmetOptions = {
    hsts: {
        maxAge: 0, // 1 year
        includeSubDomains: true,
        preload: true
    }
};

app.disable("x-powered-by");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet(helmetOptions))
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
app.set('trust proxy', true);

app.use(cors(corsOptions))
app.use(cookieParser())

// app.use(
//     session({
//         secret: process.env.ACCESS_TOKEN_SECRET as string,
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'strict' }
//     })
// )
app.post("/auth/refresh", (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { studentId: string };
        const newAccessToken = createAccessToken({ studentId: decoded.studentId });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: Number(process.env.ACCESS_TOKEN_TIMEOUT),
        });

        res.json({ message: "Access token refreshed" });

    } catch (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
});

app.use("/api/student", studentRoutes);

// Catch-all route handler
app.get('*', (req, res) => {
    res.sendStatus(404);
});

const server = app.listen(SERVER_PORT, async () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});
