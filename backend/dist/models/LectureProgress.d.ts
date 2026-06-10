import mongoose, { Document, Types } from 'mongoose';
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
declare const _default: mongoose.Model<ILectureProgress, {}, {}, {}, mongoose.Document<unknown, {}, ILectureProgress, {}, mongoose.DefaultSchemaOptions> & ILectureProgress & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILectureProgress>;
export default _default;
//# sourceMappingURL=LectureProgress.d.ts.map