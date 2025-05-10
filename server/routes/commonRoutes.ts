import { Router } from "express";
import { getDepartments } from "../controllers/commonController";

const router = Router();

router.get("/departments", getDepartments);

export default router;
