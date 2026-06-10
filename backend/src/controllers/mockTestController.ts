import { Response } from 'express';
import MockTest from '../models/MockTest';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getMockTests = async (req: AuthRequest, res: Response): Promise<void> => {
  const tests = await MockTest.find({ userId: req.user!._id }).sort({ date: -1 });
  res.json({ success: true, data: tests });
};

export const createMockTest = async (req: AuthRequest, res: Response): Promise<void> => {
  const { testName, date, score, maxScore, accuracy, rank, attemptedQuestions, totalQuestions } = req.body;
  if (!testName || !date || score === undefined || !maxScore || accuracy === undefined || !attemptedQuestions || !totalQuestions) {
    throw new AppError('All required fields must be provided', 400);
  }
  const test = await MockTest.create({
    userId: req.user!._id,
    testName,
    date,
    score,
    maxScore,
    accuracy,
    rank: rank || null,
    attemptedQuestions,
    totalQuestions,
  });
  res.status(201).json({ success: true, data: test });
};

export const updateMockTest = async (req: AuthRequest, res: Response): Promise<void> => {
  const test = await MockTest.findOne({ _id: req.params.id, userId: req.user!._id });
  if (!test) throw new AppError('Test not found', 404);
  const updated = await MockTest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: updated });
};

export const deleteMockTest = async (req: AuthRequest, res: Response): Promise<void> => {
  const test = await MockTest.findOne({ _id: req.params.id, userId: req.user!._id });
  if (!test) throw new AppError('Test not found', 404);
  await test.deleteOne();
  res.json({ success: true, message: 'Test deleted' });
};

export const getMockTestAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  const tests = await MockTest.find({ userId: req.user!._id }).sort({ date: 1 });
  if (!tests.length) {
    res.json({ success: true, data: { totalTests: 0, avgScore: 0, highestScore: 0, avgAccuracy: 0, trend: [] } });
    return;
  }

  const totalTests = tests.length;
  const avgScore = Math.round(tests.reduce((sum, t) => sum + (t.score / t.maxScore) * 100, 0) / totalTests);
  const highestScore = Math.round(Math.max(...tests.map((t) => (t.score / t.maxScore) * 100)));
  const avgAccuracy = Math.round(tests.reduce((sum, t) => sum + t.accuracy, 0) / totalTests);

  const trend = tests.map((t) => ({
    date: t.date,
    testName: t.testName,
    scorePct: Math.round((t.score / t.maxScore) * 100),
    accuracy: t.accuracy,
  }));

  res.json({ success: true, data: { totalTests, avgScore, highestScore, avgAccuracy, trend } });
};
