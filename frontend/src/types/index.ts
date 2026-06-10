export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'student';
  isActive: boolean;
  createdAt: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  order: number;
}

export interface Unit {
  _id: string;
  subjectId: string;
  name: string;
  order: number;
}

export interface Lecture {
  _id: string;
  unitId: string;
  subjectId: string;
  title: string;
  durationMinutes: number;
  sequenceNumber: number;
}

export interface LectureProgress {
  _id: string;
  userId: string;
  lectureId: string;
  watched: boolean;
  watchedAt: string | null;
  notesMade: boolean;
  shortNotesMade: boolean;
  revisionCount: number;
  notes: string;
}

export interface PracticeUnit {
  _id: string;
  subjectId: string;
  unitName: string;
  totalQuestions: number;
}

export interface QuestionProgress {
  _id: string;
  userId: string;
  practiceUnitId: string;
  solvedQuestions: number;
  timesSolved: number;
  confidenceLevel: number;
  notes: string;
}

export interface Revision {
  _id: string;
  userId: string;
  unitId: { _id: string; name: string; subjectId: string } | string;
  rev1Done: boolean;
  rev1Date: string | null;
  rev2Done: boolean;
  rev2Date: string | null;
  rev3Done: boolean;
  rev3Date: string | null;
  rev4Done: boolean;
  rev4Date: string | null;
}

export interface MockTest {
  _id: string;
  userId: string;
  testName: string;
  date: string;
  score: number;
  maxScore: number;
  accuracy: number;
  rank: number | null;
  attemptedQuestions: number;
  totalQuestions: number;
  createdAt: string;
}

export interface Vocabulary {
  _id: string;
  word: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence: string;
  createdBy: { name: string } | string;
  createdAt: string;
}

export interface VocabularyProgress {
  _id: string;
  userId: string;
  wordId: string;
  status: 'unknown' | 'needs_revision' | 'known';
}

export interface DashboardData {
  readinessScore: number;
  lecturePct: number;
  practicePct: number;
  revisionPct: number;
  mockAvgScore: number;
  vocabPct: number;
  totalVocab: number;
  knownVocab: number;
  totalMockTests: number;
  subjectProgress: {
    _id: string;
    name: string;
    code: string;
    lecturePct: number;
    practicePct: number;
    lectureCount: number;
    practiceCount: number;
  }[];
}

export interface MockAnalytics {
  totalTests: number;
  avgScore: number;
  highestScore: number;
  avgAccuracy: number;
  trend: { date: string; testName: string; scorePct: number; accuracy: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
