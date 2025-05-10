import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
    value: string;
    label: string;
}

const DepartmentSchema = new Schema<IDepartment>({
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true },
});

export const Department = mongoose.models.departments || mongoose.model<IDepartment>('departments', DepartmentSchema);
