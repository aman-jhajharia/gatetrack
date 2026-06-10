import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILecture extends Document {
  unitId: Types.ObjectId;
  subjectId: Types.ObjectId;
  title: string;
  durationMinutes: number;
  sequenceNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const LectureSchema = new Schema<ILecture>(
  {
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, default: 0 },
    sequenceNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILecture>('Lecture', LectureSchema);
