import mongoose, { Document, Schema, Types } from 'mongoose';

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

const RevisionSchema = new Schema<IRevision>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    rev1Done: { type: Boolean, default: false },
    rev1Date: { type: Date, default: null },
    rev2Done: { type: Boolean, default: false },
    rev2Date: { type: Date, default: null },
    rev3Done: { type: Boolean, default: false },
    rev3Date: { type: Date, default: null },
    rev4Done: { type: Boolean, default: false },
    rev4Date: { type: Date, default: null },
  },
  { timestamps: true }
);

RevisionSchema.index({ userId: 1, unitId: 1 }, { unique: true });

export default mongoose.model<IRevision>('Revision', RevisionSchema);
