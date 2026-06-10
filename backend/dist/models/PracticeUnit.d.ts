import mongoose, { Document, Types } from 'mongoose';
export interface IPracticeUnit extends Document {
    subjectId: Types.ObjectId;
    unitName: string;
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IPracticeUnit, {}, {}, {}, mongoose.Document<unknown, {}, IPracticeUnit, {}, mongoose.DefaultSchemaOptions> & IPracticeUnit & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPracticeUnit>;
export default _default;
//# sourceMappingURL=PracticeUnit.d.ts.map