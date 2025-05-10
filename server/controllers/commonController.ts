import { Request, Response } from "express";
import * as DepartmentService from "../services/commonService";

export const getDepartments = async (req: Request, res: Response) => {
    try {
        const data = await DepartmentService.getDepartments();
        res.status(200).json(data);
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}