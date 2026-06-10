import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVocabularyProgress extends Document {
  userId: Types.ObjectId;
  wordId: Types.ObjectId;
  status: 'unknown' | 'needs_revision' | 'known';
  updatedAt: Date;
}

const VocabularyProgressSchema = new Schema<IVocabularyProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    wordId: { type: Schema.Types.ObjectId, ref: 'Vocabulary', required: true },
    status: {
      type: String,
      enum: ['unknown', 'needs_revision', 'known'],
      default: 'unknown',
    },
  },
  { timestamps: true }
);

VocabularyProgressSchema.index({ userId: 1, wordId: 1 }, { unique: true });

export default mongoose.model<IVocabularyProgress>('VocabularyProgress', VocabularyProgressSchema);
