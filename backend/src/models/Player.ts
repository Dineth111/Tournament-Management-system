import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  beltRank: string;
  weight: number;
  dojo: string;
  coach: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema: Schema = new Schema(
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
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    beltRank: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    dojo: {
      type: String,
      required: true,
    },
    coach: {
      type: String,
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
    medicalInfo: {
      type: String,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPlayer>('Player', PlayerSchema);