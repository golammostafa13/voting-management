import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string; // Replace with your env secret

interface AuthenticatedRequest extends Request {
    student?: {
        studentId: string;
    };
}

export const verifyToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    const token = req.cookies.accessToken;
    console.log(token)

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
        if (!decoded.studentId) {
            throw new Error("Not valid token")
        }
        req.student = {
            studentId: decoded.studentId
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid access token" });
    }
};
