import { Router } from "express";
import { deleteStudent, getStudent, getVerifiedStudent, login, logout, register, verify } from "../controllers/studentController";
import { uploadPhoto } from "../middleware/upload";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.post("/login", login);
router.post("/registration", uploadPhoto, register);
router.get("/verified-student", verifyToken, getVerifiedStudent);
router.get("/:studentId", verifyToken, getStudent);
router.delete("/:studentId", deleteStudent);
router.post("/verify-otp", verify);
router.post("/logout", logout);

export default router;
