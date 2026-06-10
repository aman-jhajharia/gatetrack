import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Lecture from '../models/Lecture';
import LectureProgress from '../models/LectureProgress';
import PracticeUnit from '../models/PracticeUnit';
import QuestionProgress from '../models/QuestionProgress';
import Revision from '../models/Revision';
import Unit from '../models/Unit';
import MockTest from '../models/MockTest';
import VocabularyProgress from '../models/VocabularyProgress';
import Vocabulary from '../models/Vocabulary';
import Subject from '../models/Subject';
import User from '../models/User';

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!._id;

  const [subjects, lectures, lectureProgresses, practiceUnits, questionProgresses, units, revisions, vocabProgress, totalVocab] =
    await Promise.all([
      Subject.find().sort({ order: 1 }),
      Lecture.find(),
      LectureProgress.find({ userId }),
      PracticeUnit.find(),
      QuestionProgress.find({ userId }),
      Unit.find(),
      Revision.find({ userId }),
      VocabularyProgress.find({ userId }),
      Vocabulary.countDocuments(),
    ]);

  // Lecture completion
  const lectureProgressMap = new Map(lectureProgresses.map((p) => [p.lectureId.toString(), p]));
  let lectureTotal = 0, lectureScore = 0;
  for (const lec of lectures) {
    const p = lectureProgressMap.get(lec._id.toString());
    lectureTotal += 100;
    if (p?.watched) lectureScore += 50;
    if (p?.notesMade) lectureScore += 25;
    if (p?.shortNotesMade) lectureScore += 25;
  }
  const lecturePct = lectureTotal > 0 ? Math.round((lectureScore / lectureTotal) * 100) : 0;

  // Practice completion
  const practiceProgressMap = new Map(questionProgresses.map((p) => [p.practiceUnitId.toString(), p]));
  let practiceTotal = 0, practiceScore = 0;
  for (const pu of practiceUnits) {
    const p = practiceProgressMap.get(pu._id.toString());
    practiceTotal += pu.totalQuestions;
    practiceScore += p?.solvedQuestions || 0;
  }
  const practicePct = practiceTotal > 0 ? Math.round((practiceScore / practiceTotal) * 100) : 0;

  // Revision completion
  const revisionMap = new Map(revisions.map((r) => [r.unitId.toString(), r]));
  let revTotal = 0, revScore = 0;
  for (const unit of units) {
    const r = revisionMap.get(unit._id.toString());
    revTotal += 4;
    if (r?.rev1Done) revScore++;
    if (r?.rev2Done) revScore++;
    if (r?.rev3Done) revScore++;
    if (r?.rev4Done) revScore++;
  }
  const revisionPct = revTotal > 0 ? Math.round((revScore / revTotal) * 100) : 0;

  // Mock test avg
  const mockTests = await MockTest.find({ userId });
  const mockAvgScore = mockTests.length > 0
    ? Math.round(mockTests.reduce((sum, t) => sum + (t.score / t.maxScore) * 100, 0) / mockTests.length)
    : 0;

  // Vocab progress
  const knownVocab = vocabProgress.filter((v) => v.status === 'known').length;
  const vocabPct = totalVocab > 0 ? Math.round((knownVocab / totalVocab) * 100) : 0;

  // GATE readiness score
  const readinessScore = Math.round(
    lecturePct * 0.30 + practicePct * 0.40 + revisionPct * 0.20 + mockAvgScore * 0.10
  );

  // Subject-wise progress
  const subjectProgress = subjects.map((sub) => {
    const subLectures = lectures.filter((l) => l.subjectId.toString() === sub._id.toString());
    let sLecTotal = 0, sLecScore = 0;
    for (const lec of subLectures) {
      const p = lectureProgressMap.get(lec._id.toString());
      sLecTotal += 100;
      if (p?.watched) sLecScore += 50;
      if (p?.notesMade) sLecScore += 25;
      if (p?.shortNotesMade) sLecScore += 25;
    }
    const subPractice = practiceUnits.filter((pu) => pu.subjectId.toString() === sub._id.toString());
    let sPracTotal = 0, sPracScore = 0;
    for (const pu of subPractice) {
      const p = practiceProgressMap.get(pu._id.toString());
      sPracTotal += pu.totalQuestions;
      sPracScore += p?.solvedQuestions || 0;
    }
    return {
      _id: sub._id,
      name: sub.name,
      code: sub.code,
      lecturePct: sLecTotal > 0 ? Math.round((sLecScore / sLecTotal) * 100) : 0,
      practicePct: sPracTotal > 0 ? Math.round((sPracScore / sPracTotal) * 100) : 0,
      lectureCount: subLectures.length,
      practiceCount: subPractice.length,
    };
  });

  res.json({
    success: true,
    data: {
      readinessScore,
      lecturePct,
      practicePct,
      revisionPct,
      mockAvgScore,
      vocabPct,
      totalVocab,
      knownVocab,
      subjectProgress,
      totalMockTests: mockTests.length,
    },
  });
};

export const getAdminAnalytics = async (_req: AuthRequest, res: Response): Promise<void> => {
  const students = await User.find({ role: 'student', isActive: true }).select('name username email createdAt');
  const totalStudents = students.length;
  const totalSubjects = await Subject.countDocuments();
  const totalLectures = await Lecture.countDocuments();
  const totalVocab = await Vocabulary.countDocuments();

  res.json({
    success: true,
    data: {
      totalStudents,
      totalSubjects,
      totalLectures,
      totalVocab,
      students,
    },
  });
};
