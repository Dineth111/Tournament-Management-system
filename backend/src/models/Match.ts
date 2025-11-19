import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  matchNumber: string;
  tournament: mongoose.Types.ObjectId;
  player1: mongoose.Types.ObjectId;
  player2: mongoose.Types.ObjectId;
  category: string;
  round: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  scheduledTime: Date;
  arena: string;
  winner?: mongoose.Types.ObjectId;
  player1Score: number;
  player2Score: number;
  judges: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema(
  {
    matchNumber: {
      type: String,
      required: true,
      unique: true,
    },
    tournament: {
      type: Schema.Types.ObjectId,
      ref: 'Tournament',
      required: true,
    },
    player1: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    player2: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    round: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
    arena: {
      type: String,
      required: true,
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
    player1Score: {
      type: Number,
      default: 0,
    },
    player2Score: {
      type: Number,
      default: 0,
    },
    judges: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Judge',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMatch>('Match', MatchSchema);