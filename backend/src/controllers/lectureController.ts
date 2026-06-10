import { Request, Response } from 'express';
import Lecture from '../models/Lecture';
import Unit from '../models/Unit';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getLectures = async (req: Request, res: Response): Promise<void> => {
  const lectures = await Lecture.find({ unitId: String(req.params.unitId) }).sort({ sequenceNumber: 1 });
  res.json({ success: true, data: lectures });
};

export const createLecture = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, durationMinutes, sequenceNumber } = req.body;
  if (!title || sequenceNumber === undefined) throw new AppError('Title and sequence number are required', 400);

  const unit = await Unit.findById(req.params.unitId);
  if (!unit) throw new AppError('Unit not found', 404);

  const lecture = await Lecture.create({
    unitId: String(req.params.unitId),
    subjectId: unit.subjectId,
    title,
    durationMinutes: durationMinutes || 0,
    sequenceNumber,
  });
  res.status(201).json({ success: true, data: lecture });
};

export const updateLecture = async (req: AuthRequest, res: Response): Promise<void> => {
  const lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!lecture) throw new AppError('Lecture not found', 404);
  res.json({ success: true, data: lecture });
};

export const deleteLecture = async (req: AuthRequest, res: Response): Promise<void> => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) throw new AppError('Lecture not found', 404);
  await lecture.deleteOne();
  res.json({ success: true, message: 'Lecture deleted' });
};
