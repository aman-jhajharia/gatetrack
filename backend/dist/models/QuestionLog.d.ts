import mongoose, { Document, Types } from 'mongoose';
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
declare const _default: mongoose.Model<IQuestionLog, {}, {}, {}, mongoose.Document<unknown, {}, IQuestionLog, {}, mongoose.DefaultSchemaOptions> & IQuestionLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IQuestionLog>;
export default _default;
//# sourceMappingURL=QuestionLog.d.ts.map