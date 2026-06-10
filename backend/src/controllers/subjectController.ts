import { Request, Response } from 'express';
import Subject from '../models/Subject';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getSubjects = async (_req: Request, res: Response): Promise<void> => {
  const subjects = await Subject.find().sort({ order: 1, name: 1 });
  res.json({ success: true, data: subjects });
};

export const createSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, code, order } = req.body;
  if (!name || !code) throw new AppError('Name and code are required', 400);

  const subject = await Subject.create({ name, code, order: order || 0 });
  res.status(201).json({ success: true, data: subject });
};

export const updateSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!subject) throw new AppError('Subject not found', 404);
  res.json({ success: true, data: subject });
};

export const deleteSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) throw new AppError('Subject not found', 404);
  await subject.deleteOne();
  res.json({ success: true, message: 'Subject deleted' });
};
