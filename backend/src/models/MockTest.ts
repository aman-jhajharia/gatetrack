import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMockTest extends Document {
  userId: Types.ObjectId;
  testName: string;
  date: Date;
  score: number;
  maxScore: number;
  accuracy: number;
  rank: number | null;
  attemptedQuestions: number;
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

const MockTestSchema = new Schema<IMockTest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    testName: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    score: { type: Number, required: true, min: 0 },
    maxScore: { type: Number, required: true, min: 1 },
    accuracy: { type: Number, required: true, min: 0, max: 100 },
    rank: { type: Number, default: null },
    attemptedQuestions: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<IMockTest>('MockTest', MockTestSchema);
