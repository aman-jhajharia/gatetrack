import mongoose, { Document, Types } from 'mongoose';
export interface IQuestionProgress extends Document {
    userId: Types.ObjectId;
    practiceUnitId: Types.ObjectId;
    solvedQuestions: number;
    timesSolved: number;
    confidenceLevel: number;
    notes: string;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IQuestionProgress, {}, {}, {}, mongoose.Document<unknown, {}, IQuestionProgress, {}, mongoose.DefaultSchemaOptions> & IQuestionProgress & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IQuestionProgress>;
export default _default;
//# sourceMappingURL=QuestionProgress.d.ts.map