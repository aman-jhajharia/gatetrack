import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPracticeUnit extends Document {
  subjectId: Types.ObjectId;
  unitName: string;
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeUnitSchema = new Schema<IPracticeUnit>(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    unitName: { type: String, required: true, trim: true },
    totalQuestions: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<IPracticeUnit>('PracticeUnit', PracticeUnitSchema);
