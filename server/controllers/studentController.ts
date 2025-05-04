import { Request, Response } from "express";
import * as studentService from "../services/studentService";

export const login = async (req: Request, res: Response) => {
    try {
        const data = await studentService.loginStudent(req.body);
        res.status(200).json({
            ...data
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const verify = async (req: Request, res: Response) => {
    try {
        const data = await studentService.verifyOTP(req, res);
        res.status(200).json({
            ...data
        })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        await studentService.deleteStudent(studentId);
        res.json({ message: "Student deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.body;
        await studentService.logout(studentId);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
