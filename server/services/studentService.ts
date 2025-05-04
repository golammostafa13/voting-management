import { Request, Response } from "express";
import Student from "../models/Student";
import { createAccessToken, createRefreshToken } from "../utils/jwt";
import { SUCCESS_MESSAGES_CODE } from "../utils/messages";
import { generateOTP } from "../utils/otp";

export const loginStudent = async (data: {
    studentId: string;
    email: string;
    phone: string;
}): Promise<{ message: string, otpExpires: Date, studentId: string }> => {
    const { studentId, email, phone } = data;

    const existing = await Student.findOne({
        $and: [{ studentId }, { email }, { phone }]
    });
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + Number(process.env.OTP_TIME_OUT)); // 5 minutes

    if (existing) {
        if (existing.loginCount > 10) {
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

            return {
                message: SUCCESS_MESSAGES_CODE.SUC_LOGIN_OK,
                otpExpires,
                studentId: existing.studentId,
            }
        }
    }

    try {
        await Student.create({
            studentId,
            email,
            phone,
            otp,
            otpExpires,
            loginCount: 1,
        });
    } catch (error: any) {
        console.log(error)
        throw new Error("Account information is corrupted");
    }

    return { message: SUCCESS_MESSAGES_CODE.SUC_LOGIN_OK, otpExpires, studentId };
};

export const verifyOTP = async (req: Request, res: Response): Promise<{
    message: string;
    studentId: string;
    otpExpires?: Date;
}> => {
    const { studentId, otp } = req.body;
    console.log({ studentId });

    const student = await Student.findOne({ studentId });

    console.log(student)
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
