import { Response } from 'express';
import Revision from '../models/Revision';
import Unit from '../models/Unit';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getRevision = async (req: AuthRequest, res: Response): Promise<void> => {
  const revision = await Revision.findOne({ userId: req.user!._id, unitId: req.params.unitId });
  res.json({ success: true, data: revision || null });
};

export const getAllRevisions = async (req: AuthRequest, res: Response): Promise<void> => {
  const revisions = await Revision.find({ userId: req.user!._id }).populate('unitId', 'name subjectId');
  res.json({ success: true, data: revisions });
};

export const upsertRevision = async (req: AuthRequest, res: Response): Promise<void> => {
  const { rev1Done, rev1Date, rev2Done, rev2Date, rev3Done, rev3Date, rev4Done, rev4Date } = req.body;

  const unit = await Unit.findById(req.params.unitId);
  if (!unit) throw new AppError('Unit not found', 404);

  const updateData: Record<string, unknown> = {};
  if (typeof rev1Done === 'boolean') { updateData.rev1Done = rev1Done; if (rev1Done && !rev1Date) updateData.rev1Date = new Date(); }
  if (rev1Date) updateData.rev1Date = rev1Date;
  if (typeof rev2Done === 'boolean') { updateData.rev2Done = rev2Done; if (rev2Done && !rev2Date) updateData.rev2Date = new Date(); }
  if (rev2Date) updateData.rev2Date = rev2Date;
  if (typeof rev3Done === 'boolean') { updateData.rev3Done = rev3Done; if (rev3Done && !rev3Date) updateData.rev3Date = new Date(); }
  if (rev3Date) updateData.rev3Date = rev3Date;
  if (typeof rev4Done === 'boolean') { updateData.rev4Done = rev4Done; if (rev4Done && !rev4Date) updateData.rev4Date = new Date(); }
  if (rev4Date) updateData.rev4Date = rev4Date;

  const revision = await Revision.findOneAndUpdate(
    { userId: req.user!._id, unitId: req.params.unitId },
    { $set: updateData },
    { upsert: true, new: true }
  );

  res.json({ success: true, data: revision });
};
