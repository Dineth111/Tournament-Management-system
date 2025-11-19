import mongoose, { Document, Schema } from 'mongoose';

export interface IJudge extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  certificationLevel: string;
  licenseNumber: string;
  yearsOfExperience: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  specialization: string[];
  rating: number;
  assignedMatches: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const JudgeSchema: Schema = new Schema(
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
    certificationLevel: {
      type: String,
      required: true,
      enum: ['International A', 'International B', 'National A', 'National B'],
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    emergencyContact: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
    },
    specialization: [
      {
        type: String,
        enum: ['Kata', 'Kumite', 'Team Events'],
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    assignedMatches: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IJudge>('Judge', JudgeSchema);