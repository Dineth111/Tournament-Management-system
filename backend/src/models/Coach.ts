import mongoose, { Document, Schema } from 'mongoose';

export interface ICoach extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dojo: string;
  specialization: string;
  yearsOfExperience: number;
  certifications: string;
  activeStudents: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dojo: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    certifications: {
      type: String,
    },
    activeStudents: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICoach>('Coach', CoachSchema);