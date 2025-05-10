import { Request, Response } from "express";
import { Attachment } from "../models/Attachments";
import Student, { IStudent } from "../models/Student";
import { sendEmail } from "../utils/email";
import { createAccessToken, createRefreshToken } from "../utils/jwt";
import { SUCCESS_MESSAGES_CODE } from "../utils/messages";
import { generateOTP } from "../utils/otp";
import { otpTemplate } from "../utils/templates";

export const loginStudent = async (data: {
    studentId: string;
    email: string;
    phone: string;
}): Promise<{ message: string, otpExpires: Date, studentId: string }> => {
    const { studentId, email, phone } = data;

    try {
        const existing = await Student.findOne({
            $and: [{ studentId }, { email }, { phone }]
        });
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + Number(process.env.OTP_TIME_OUT)); // 5 minutes
        if (existing) {
            if (existing.loginCount > 100) {
                throw new Error("Login limit exceeded");
            }
            if (existing.otpExpires && existing.otpExpires > new Date()) {
                return {
                    message: SUCCESS_MESSAGES_CODE.SUC_OTP_STILL_VALID,
                    otpExpires: existing.otpExpires,
                    studentId: existing.studentId,
                }
            } else {
                await existing.updateOne({
                    $set: {
                        otp,
                        otpExpires,
                        verified: false,
                    }
                });

                // send OTP to the student via email or SMS
                await sendEmail({ to: existing.email, subject: 'Verify your OTP', html: otpTemplate(otp) });
                // or
                // await sendOtpToStudent(existing.phone, otp);

                return {
                    message: SUCCESS_MESSAGES_CODE.SUC_LOGIN_OK,
                    otpExpires,
                    studentId: existing.studentId,
                }
            }
        } else {
            throw new Error("Student not found");
        }
    } catch (error) {
        throw error;
    }
};

export const registerStudent = async (req: Request, res: Response): Promise<{ message: string }> => {
    const {
        studentId,
        email,
        phone,
        name,
        department,
        year,
        address,
        admittedDate } = req.body;
    if (!req.file) {
        throw new Error("Photo is required.");
    }
    const existing = await Student.findOne({
        $or: [{ studentId }, { email }, { phone }]
    });

    if (existing) {
        throw new Error("Student already exists");
    }

    try {
        const student = await Student.create({
            studentId,
            email,
            phone,
            name,
            department,
            year,
            address,
            admittedDate,
        });

        await Attachment.create({
            studentId: student._id,
            type: "profile-photo",
            url: `/uploads/photos/${req.file.filename}`,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        // send credentials to the student via email
    } catch (error: any) {
        console.log(error)
        throw new Error("Account information is corrupted");
    }

    return { message: SUCCESS_MESSAGES_CODE.SUC_REGISTER_OK };
};

export const verifyOTP = async (req: Request, res: Response): Promise<{
    message: string;
    studentId: string;
    otpExpires?: Date;
}> => {
    const { studentId, otp } = req.body;

    const student = await Student.findOne({ studentId });

    if (!student) throw new Error("Student not found");
    if (student.verified) throw new Error("Already verified");

    if (!student.otp || !student.otpExpires || student.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    if (student.otpExpires < new Date()) {
        throw new Error("OTP expired");
    }

    // ✅ OTP is valid, now verify and update the login count
    await Student.updateOne(
        { studentId },
        {
            $set: { verified: true },
            $unset: { otp: "", otpExpires: "" },
            $inc: { loginCount: 1 }
        }
    );

    const accessToken = createAccessToken({ studentId });
    const refreshToken = createRefreshToken({ studentId });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.ACCESS_TOKEN_TIMEOUT), // 5 min
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.REFRESH_TOKEN_TIMEOUT), // 20 min
    });


    return {
        message: SUCCESS_MESSAGES_CODE.SUC_VERRIFIED_SUCCESSFULLY,
        studentId: student.studentId
    };
};

export const deleteStudent = async (studentId: string) => {
    const deleted = await Student.findOneAndDelete({ studentId }); // ✅ Correct filter

    if (!deleted) {
        throw new Error("Student not found");
    }

};

export const logout = async (studentId: string) => {
    if (!studentId) {
        throw new Error("Student ID is required");
    }
    await Student.updateOne(
        { studentId },
        {
            $set: { verified: false },
            $unset: { otp: "", otpExpires: "" },
        }
    )
}

interface StudentWithPhoto {
    photoUrl?: string;
    joinDate: Date;
    name: string;
    email: string;
    department: string;
    year: number;
    address: string;
    phone: string;
    studentId: string;
    isVerified: boolean
}

export const getStudent = async (studentId: string): Promise<StudentWithPhoto | null> => {
    console.log({ studentId });
    const student = await Student.findOne({ studentId }) as IStudent;
    if (!student) return null;

    const photo = await Attachment.findOne({ studentId: student._id, type: "profile-photo" });
    return {
        name: student.name,
        email: student.email,
        department: student.department,
        year: student.year,
        photoUrl: photo?.url,
        // isCandidate: student.i,
        address: student.address,
        phone: student.phone,
        joinDate: student.admittedDate,
        isVerified: student.verified && student.verifiedByAdmin,
        studentId: student.studentId,
    };
};
