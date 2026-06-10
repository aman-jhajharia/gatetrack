import { Request, Response } from 'express';
import Vocabulary from '../models/Vocabulary';
import VocabularyProgress from '../models/VocabularyProgress';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getVocabulary = async (_req: Request, res: Response): Promise<void> => {
  const words = await Vocabulary.find().sort({ word: 1 }).populate('createdBy', 'name');
  res.json({ success: true, data: words });
};

export const createVocabulary = async (req: AuthRequest, res: Response): Promise<void> => {
  const { word, meaning, synonyms, antonyms, exampleSentence } = req.body;
  if (!word || !meaning) throw new AppError('Word and meaning are required', 400);

  const vocab = await Vocabulary.create({
    word,
    meaning,
    synonyms: synonyms || [],
    antonyms: antonyms || [],
    exampleSentence: exampleSentence || '',
    createdBy: req.user!._id,
  });
  res.status(201).json({ success: true, data: vocab });
};

export const updateVocabulary = async (req: AuthRequest, res: Response): Promise<void> => {
  const vocab = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!vocab) throw new AppError('Word not found', 404);
  res.json({ success: true, data: vocab });
};

export const deleteVocabulary = async (req: AuthRequest, res: Response): Promise<void> => {
  const vocab = await Vocabulary.findById(req.params.id);
  if (!vocab) throw new AppError('Word not found', 404);
  await vocab.deleteOne();
  res.json({ success: true, message: 'Word deleted' });
};

export const getVocabularyProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  const progress = await VocabularyProgress.find({ userId: req.user!._id });
  const progressMap = Object.fromEntries(progress.map((p) => [p.wordId.toString(), p.status]));

  const total = await Vocabulary.countDocuments();
  const known = progress.filter((p) => p.status === 'known').length;
  const unknown = progress.filter((p) => p.status === 'unknown').length;
  const needsRevision = progress.filter((p) => p.status === 'needs_revision').length;

  res.json({
    success: true,
    data: { progressMap, stats: { total, known, unknown, needsRevision, notSeen: total - progress.length } },
  });
};

export const updateWordProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  if (!['unknown', 'needs_revision', 'known'].includes(status)) throw new AppError('Invalid status', 400);

  const vocab = await Vocabulary.findById(req.params.wordId);
  if (!vocab) throw new AppError('Word not found', 404);

  const progress = await VocabularyProgress.findOneAndUpdate(
    { userId: req.user!._id, wordId: req.params.wordId },
    { status },
    { upsert: true, new: true }
  );
  res.json({ success: true, data: progress });
};
