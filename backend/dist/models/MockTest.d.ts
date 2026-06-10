import mongoose, { Document, Types } from 'mongoose';
export interface IMockTest extends Document {
    userId: Types.ObjectId;
    testName: string;
    date: Date;
    score: number;
    maxScore: number;
    accuracy: number;
    rank: number | null;
    attemptedQuestions: number;
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMockTest, {}, {}, {}, mongoose.Document<unknown, {}, IMockTest, {}, mongoose.DefaultSchemaOptions> & IMockTest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMockTest>;
export default _default;
//# sourceMappingURL=MockTest.d.ts.map