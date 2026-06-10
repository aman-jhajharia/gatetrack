import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IQuestionProgress extends Document {
  userId: Types.ObjectId;
  practiceUnitId: Types.ObjectId;
  solvedQuestions: number;
  timesSolved: number;
  confidenceLevel: number;
  notes: string;
  updatedAt: Date;
}

const QuestionProgressSchema = new Schema<IQuestionProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    practiceUnitId: { type: Schema.Types.ObjectId, ref: 'PracticeUnit', required: true },
    solvedQuestions: { type: Number, default: 0, min: 0 },
    timesSolved: { type: Number, default: 0, min: 0 },
    confidenceLevel: { type: Number, default: 1, min: 1, max: 5 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

QuestionProgressSchema.index({ userId: 1, practiceUnitId: 1 }, { unique: true });

export default mongoose.model<IQuestionProgress>('QuestionProgress', QuestionProgressSchema);
