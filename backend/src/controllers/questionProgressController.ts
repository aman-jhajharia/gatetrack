import { Response } from 'express';
import QuestionProgress from '../models/QuestionProgress';
import PracticeUnit from '../models/PracticeUnit';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getQuestionProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  const progress = await QuestionProgress.findOne({
    userId: req.user!._id,
    practiceUnitId: req.params.practiceUnitId,
  });
  res.json({ success: true, data: progress || null });
};

export const upsertQuestionProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  const { solvedQuestions, timesSolved, confidenceLevel, notes } = req.body;

  const practiceUnit = await PracticeUnit.findById(req.params.practiceUnitId);
  if (!practiceUnit) throw new AppError('Practice unit not found', 404);

  const updateData: Record<string, unknown> = {};
  if (typeof solvedQuestions === 'number') updateData.solvedQuestions = Math.min(solvedQuestions, practiceUnit.totalQuestions);
  if (typeof timesSolved === 'number') updateData.timesSolved = timesSolved;
  if (typeof confidenceLevel === 'number') updateData.confidenceLevel = Math.min(5, Math.max(1, confidenceLevel));
  if (notes !== undefined) updateData.notes = notes;

  const progress = await QuestionProgress.findOneAndUpdate(
    { userId: req.user!._id, practiceUnitId: req.params.practiceUnitId },
    { $set: updateData },
    { upsert: true, new: true }
  );

  res.json({ success: true, data: progress });
};
