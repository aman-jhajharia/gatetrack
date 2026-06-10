import mongoose, { Document } from 'mongoose';
export interface ISubject extends Document {
    name: string;
    code: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISubject, {}, {}, {}, mongoose.Document<unknown, {}, ISubject, {}, mongoose.DefaultSchemaOptions> & ISubject & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISubject>;
export default _default;
//# sourceMappingURL=Subject.d.ts.map