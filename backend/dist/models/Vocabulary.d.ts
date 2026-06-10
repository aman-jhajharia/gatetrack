import mongoose, { Document, Types } from 'mongoose';
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
declare const _default: mongoose.Model<IVocabulary, {}, {}, {}, mongoose.Document<unknown, {}, IVocabulary, {}, mongoose.DefaultSchemaOptions> & IVocabulary & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IVocabulary>;
export default _default;
//# sourceMappingURL=Vocabulary.d.ts.map