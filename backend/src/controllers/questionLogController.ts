import { Response } from 'express';
import QuestionLog from '../models/QuestionLog';
import PracticeUnit from '../models/PracticeUnit';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getQuestionLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  const { practiceUnitId } = req.params;
  
  const logs = await QuestionLog.find({
    userId: req.user!._id,
    practiceUnitId,
  }).sort({ createdAt: 1 });
  
  res.json({ success: true, data: logs });
};

export const createOrUpdateQuestionLog = async (req: AuthRequest, res: Response): Promise<void> => {
  const { practiceUnitId } = req.params;
  const { questionIdentifier, timesPracticed, toughness, notes } = req.body;

  if (!questionIdentifier) throw new AppError('Question identifier is required', 400);

  const practiceUnit = await PracticeUnit.findById(practiceUnitId);
  if (!practiceUnit) throw new AppError('Practice unit not found', 404);

  const updateData: Record<string, any> = {};
  if (typeof timesPracticed === 'number') updateData.timesPracticed = Math.max(1, timesPracticed);
  if (typeof toughness === 'number') updateData.toughness = Math.min(5, Math.max(1, toughness));
  if (notes !== undefined) updateData.notes = notes;

  const log = await QuestionLog.findOneAndUpdate(
    {
      userId: req.user!._id,
      practiceUnitId,
      questionIdentifier: questionIdentifier.trim(),
    },
    {
      $set: updateData,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  res.json({ success: true, data: log });
};

export const deleteQuestionLog = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const log = await QuestionLog.findOneAndDelete({
    _id: id,
    userId: req.user!._id,
  });

  if (!log) throw new AppError('Question log not found', 404);

  res.json({ success: true, message: 'Question log deleted successfully' });
};
