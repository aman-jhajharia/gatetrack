import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVocabulary extends Document {
  word: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VocabularySchema = new Schema<IVocabulary>(
  {
    word: { type: String, required: true, trim: true, unique: true },
    meaning: { type: String, required: true, trim: true },
    synonyms: [{ type: String, trim: true }],
    antonyms: [{ type: String, trim: true }],
    exampleSentence: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IVocabulary>('Vocabulary', VocabularySchema);
