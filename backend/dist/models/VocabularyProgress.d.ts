import mongoose, { Document, Types } from 'mongoose';
export interface IVocabularyProgress extends Document {
    userId: Types.ObjectId;
    wordId: Types.ObjectId;
    status: 'unknown' | 'needs_revision' | 'known';
    updatedAt: Date;
}
declare const _default: mongoose.Model<IVocabularyProgress, {}, {}, {}, mongoose.Document<unknown, {}, IVocabularyProgress, {}, mongoose.DefaultSchemaOptions> & IVocabularyProgress & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IVocabularyProgress>;
export default _default;
//# sourceMappingURL=VocabularyProgress.d.ts.map