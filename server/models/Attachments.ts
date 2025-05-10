import mongoose, { Document, Schema } from "mongoose";

export interface IAttachment extends Document {
    studentId: mongoose.Types.ObjectId;
    type: "profile-photo" | "student-id" | "other";
    url: string; // File storage URL or path
    filename: string;
    mimetype: string;
    size: number; // In bytes
    uploadedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    type: {
        type: String,
        enum: ["profile-photo", "student-id", "other"],
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    mimetype: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

export const Attachment = mongoose.model<IAttachment>("Attachment", attachmentSchema);
