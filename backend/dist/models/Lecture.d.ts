import mongoose, { Document, Types } from 'mongoose';
export interface ILecture extends Document {
    unitId: Types.ObjectId;
    subjectId: Types.ObjectId;
    title: string;
    durationMinutes: number;
    sequenceNumber: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILecture, {}, {}, {}, mongoose.Document<unknown, {}, ILecture, {}, mongoose.DefaultSchemaOptions> & ILecture & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILecture>;
export default _default;
//# sourceMappingURL=Lecture.d.ts.map