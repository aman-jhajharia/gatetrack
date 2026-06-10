import mongoose, { Document, Types } from 'mongoose';
export interface IRevision extends Document {
    userId: Types.ObjectId;
    unitId: Types.ObjectId;
    rev1Done: boolean;
    rev1Date: Date | null;
    rev2Done: boolean;
    rev2Date: Date | null;
    rev3Done: boolean;
    rev3Date: Date | null;
    rev4Done: boolean;
    rev4Date: Date | null;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IRevision, {}, {}, {}, mongoose.Document<unknown, {}, IRevision, {}, mongoose.DefaultSchemaOptions> & IRevision & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRevision>;
export default _default;
//# sourceMappingURL=Revision.d.ts.map