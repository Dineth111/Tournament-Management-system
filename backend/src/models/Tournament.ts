import mongoose, { Document, Schema } from 'mongoose';

export interface ITournament extends Document {
  name: string;
  description: string;
  eventType: 'kata' | 'kumite' | 'team';
  startDate: Date;
  endDate: Date;
  location: string;
  registrationDeadline: Date;
  registrationFee: number;
  maxParticipants: number;
  rules: string;
  status: 'Registration Open' | 'Ongoing' | 'Upcoming' | 'Completed';
  participants: number;
  createdAt: Date;
  updatedAt: Date;
}

const TournamentSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['kata', 'kumite', 'team'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    registrationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },
    rules: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Registration Open', 'Ongoing', 'Upcoming', 'Completed'],
      default: 'Upcoming',
    },
    participants: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITournament>('Tournament', TournamentSchema);