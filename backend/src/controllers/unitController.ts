import { Request, Response } from 'express';
import Unit from '../models/Unit';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getUnits = async (req: Request, res: Response): Promise<void> => {
  const units = await Unit.find({ subjectId: String(req.params.subjectId) }).sort({ order: 1, name: 1 });
  res.json({ success: true, data: units });
};

export const createUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, order } = req.body;
  if (!name) throw new AppError('Unit name is required', 400);
  const unit = await Unit.create({ subjectId: String(req.params.subjectId), name, order: order || 0 });
  res.status(201).json({ success: true, data: unit });
};

export const updateUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!unit) throw new AppError('Unit not found', 404);
  res.json({ success: true, data: unit });
};

export const deleteUnit = async (req: AuthRequest, res: Response): Promise<void> => {
  const unit = await Unit.findById(req.params.id);
  if (!unit) throw new AppError('Unit not found', 404);
  await unit.deleteOne();
  res.json({ success: true, message: 'Unit deleted' });
};
