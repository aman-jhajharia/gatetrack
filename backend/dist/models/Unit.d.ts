import mongoose, { Document, Types } from 'mongoose';
export interface IUnit extends Document {
    subjectId: Types.ObjectId;
    name: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUnit, {}, {}, {}, mongoose.Document<unknown, {}, IUnit, {}, mongoose.DefaultSchemaOptions> & IUnit & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUnit>;
export default _default;
//# sourceMappingURL=Unit.d.ts.map