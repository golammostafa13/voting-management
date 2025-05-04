import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
    studentId: string;
    email: string;
    phone: string;
    otp?: string;
    otpExpires?: Date;
    verified: boolean;
    loginCount: number;
}

const studentSchema = new Schema<IStudent>({
    studentId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    otp: String,
    otpExpires: Date,
    verified: { type: Boolean, default: false },
    loginCount: { type: Number, default: 0 },
});

const StudentModel = mongoose.models.students || mongoose.model<IStudent>("students", studentSchema);

export default StudentModel;