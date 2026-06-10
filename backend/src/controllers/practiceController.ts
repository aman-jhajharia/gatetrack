import { Request, Response } from 'express';
import PracticeUnit from '../models/PracticeUnit';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getPracticeUnits = async (req: Request, res: Response): Promise<void> => {
  const units = await PracticeUnit.find({ subjectId: String(req.params.subjectId) }).sort({ unitName: 1 });
  res.json({ success: true, data: units });
};

export const createPracticeUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  const { unitName, totalQuestions } = req.body;
  if (!unitName || !totalQuestions) throw new AppError('Unit name and total questions are required', 400);
  const unit = await PracticeUnit.create({ subjectId: String(req.params.subjectId), unitName, totalQuestions });
  res.status(201).json({ success: true, data: unit });
};

export const updatePracticeUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  const unit = await PracticeUnit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!unit) throw new AppError('Practice unit not found', 404);
  res.json({ success: true, data: unit });
};

export const deletePracticeUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  const unit = await PracticeUnit.findById(req.params.id);
  if (!unit) throw new AppError('Practice unit not found', 404);
  await unit.deleteOne();
  res.json({ success: true, message: 'Practice unit deleted' });
};
