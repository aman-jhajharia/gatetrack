import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IQuestionLog extends Document {
  userId: Types.ObjectId;
  practiceUnitId: Types.ObjectId;
  questionIdentifier: string;
  timesPracticed: number;
  toughness: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionLogSchema = new Schema<IQuestionLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    practiceUnitId: { type: Schema.Types.ObjectId, ref: 'PracticeUnit', required: true },
    questionIdentifier: { type: String, required: true, trim: true },
    timesPracticed: { type: Number, default: 1, min: 1 },
    toughness: { type: Number, default: 3, min: 1, max: 5 },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

// Unique combination of user, practice unit, and question number
QuestionLogSchema.index({ userId: 1, practiceUnitId: 1, questionIdentifier: 1 }, { unique: true });

export default mongoose.model<IQuestionLog>('QuestionLog', QuestionLogSchema);
