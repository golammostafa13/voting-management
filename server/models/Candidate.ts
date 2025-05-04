import mongoose, { Document, Schema, model } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  department: string;
  year: number;
  studentId: string;
  photoUrl?: string;
  manifesto?: string;
  votes: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    studentId: { type: String, required: true, unique: true },
    photoUrl: { type: String },
    manifesto: { type: String },
    votes: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Candidate =  mongoose.models.candidates || model<ICandidate>('candidates', CandidateSchema);
