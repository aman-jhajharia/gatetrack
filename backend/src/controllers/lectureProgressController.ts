import { Response } from 'express';
import LectureProgress from '../models/LectureProgress';
import Lecture from '../models/Lecture';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getLectureProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  const progress = await LectureProgress.findOne({
    userId: req.user!._id,
    lectureId: req.params.lectureId,
  });
  res.json({ success: true, data: progress || null });
};

export const upsertLectureProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  const { watched, notesMade, shortNotesMade, revisionCount, notes } = req.body;

  const lecture = await Lecture.findById(req.params.lectureId);
  if (!lecture) throw new AppError('Lecture not found', 404);

  const updateData: Record<string, unknown> = {};
  if (typeof watched === 'boolean') {
    updateData.watched = watched;
    updateData.watchedAt = watched ? new Date() : null;
  }
  if (typeof notesMade === 'boolean') updateData.notesMade = notesMade;
  if (typeof shortNotesMade === 'boolean') updateData.shortNotesMade = shortNotesMade;
  if (typeof revisionCount === 'number') updateData.revisionCount = revisionCount;
  if (notes !== undefined) updateData.notes = notes;

  const progress = await LectureProgress.findOneAndUpdate(
    { userId: req.user!._id, lectureId: req.params.lectureId },
    { $set: updateData },
    { upsert: true, new: true }
  );

  res.json({ success: true, data: progress });
};

export const getProgressSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!._id;
  const allLectures = await Lecture.find();
  const allProgress = await LectureProgress.find({ userId });

  const progressMap = new Map(allProgress.map((p) => [p.lectureId.toString(), p]));

  type SubjectSummary = { total: number; score: number };
  const subjectMap: Record<string, SubjectSummary> = {};

  let totalScore = 0;
  let totalMax = 0;

  for (const lecture of allLectures) {
    const sid = lecture.subjectId.toString();
    if (!subjectMap[sid]) subjectMap[sid] = { total: 0, score: 0 };

    const prog = progressMap.get(lecture._id.toString());
    let score = 0;
    if (prog?.watched) score += 50;
    if (prog?.notesMade) score += 25;
    if (prog?.shortNotesMade) score += 25;

    subjectMap[sid].total += 100;
    subjectMap[sid].score += score;
    totalScore += score;
    totalMax += 100;
  }

  const overallPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const subjectProgress: Record<string, number> = {};
  for (const [sid, val] of Object.entries(subjectMap)) {
    subjectProgress[sid] = val.total > 0 ? Math.round((val.score / val.total) * 100) : 0;
  }

  res.json({ success: true, data: { overallPct, subjectProgress } });
};
