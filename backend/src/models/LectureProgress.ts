import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILectureProgress extends Document {
  userId: Types.ObjectId;
  lectureId: Types.ObjectId;
  watched: boolean;
  watchedAt: Date | null;
  notesMade: boolean;
  shortNotesMade: boolean;
  revisionCount: number;
  notes: string;
  updatedAt: Date;
}

const LectureProgressSchema = new Schema<ILectureProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lectureId: { type: Schema.Types.ObjectId, ref: 'Lecture', required: true },
    watched: { type: Boolean, default: false },
    watchedAt: { type: Date, default: null },
    notesMade: { type: Boolean, default: false },
    shortNotesMade: { type: Boolean, default: false },
    revisionCount: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

LectureProgressSchema.index({ userId: 1, lectureId: 1 }, { unique: true });

export default mongoose.model<ILectureProgress>('LectureProgress', LectureProgressSchema);
