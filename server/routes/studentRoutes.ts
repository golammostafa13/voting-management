import { Router } from "express";
import { deleteStudent, login, logout, verify } from "../controllers/studentController";

const router = Router();

router.post("/login", login);
router.delete("/:studentId", deleteStudent);
router.post("/verify-otp", verify);
router.post("/logout", logout);

export default router;
