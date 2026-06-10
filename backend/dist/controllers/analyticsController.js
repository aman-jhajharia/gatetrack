"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminAnalytics = exports.getDashboard = void 0;
const Lecture_1 = __importDefault(require("../models/Lecture"));
const LectureProgress_1 = __importDefault(require("../models/LectureProgress"));
const PracticeUnit_1 = __importDefault(require("../models/PracticeUnit"));
const QuestionProgress_1 = __importDefault(require("../models/QuestionProgress"));
const Revision_1 = __importDefault(require("../models/Revision"));
const Unit_1 = __importDefault(require("../models/Unit"));
const MockTest_1 = __importDefault(require("../models/MockTest"));
const VocabularyProgress_1 = __importDefault(require("../models/VocabularyProgress"));
const Vocabulary_1 = __importDefault(require("../models/Vocabulary"));
const Subject_1 = __importDefault(require("../models/Subject"));
const User_1 = __importDefault(require("../models/User"));
const getDashboard = async (req, res) => {
    const userId = req.user._id;
    const [subjects, lectures, lectureProgresses, practiceUnits, questionProgresses, units, revisions, vocabProgress, totalVocab] = await Promise.all([
        Subject_1.default.find().sort({ order: 1 }),
        Lecture_1.default.find(),
        LectureProgress_1.default.find({ userId }),
        PracticeUnit_1.default.find(),
        QuestionProgress_1.default.find({ userId }),
        Unit_1.default.find(),
        Revision_1.default.find({ userId }),
        VocabularyProgress_1.default.find({ userId }),
        Vocabulary_1.default.countDocuments(),
    ]);
    // Lecture completion
    const lectureProgressMap = new Map(lectureProgresses.map((p) => [p.lectureId.toString(), p]));
    let lectureTotal = 0, lectureScore = 0;
    for (const lec of lectures) {
        const p = lectureProgressMap.get(lec._id.toString());
        lectureTotal += 100;
        if (p?.watched)
            lectureScore += 50;
        if (p?.notesMade)
            lectureScore += 25;
        if (p?.shortNotesMade)
            lectureScore += 25;
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
        if (r?.rev1Done)
            revScore++;
        if (r?.rev2Done)
            revScore++;
        if (r?.rev3Done)
            revScore++;
        if (r?.rev4Done)
            revScore++;
    }
    const revisionPct = revTotal > 0 ? Math.round((revScore / revTotal) * 100) : 0;
    // Mock test avg
    const mockTests = await MockTest_1.default.find({ userId });
    const mockAvgScore = mockTests.length > 0
        ? Math.round(mockTests.reduce((sum, t) => sum + (t.score / t.maxScore) * 100, 0) / mockTests.length)
        : 0;
    // Vocab progress
    const knownVocab = vocabProgress.filter((v) => v.status === 'known').length;
    const vocabPct = totalVocab > 0 ? Math.round((knownVocab / totalVocab) * 100) : 0;
    // GATE readiness score
    const readinessScore = Math.round(lecturePct * 0.30 + practicePct * 0.40 + revisionPct * 0.20 + mockAvgScore * 0.10);
    // Subject-wise progress
    const subjectProgress = subjects.map((sub) => {
        const subLectures = lectures.filter((l) => l.subjectId.toString() === sub._id.toString());
        let sLecTotal = 0, sLecScore = 0;
        for (const lec of subLectures) {
            const p = lectureProgressMap.get(lec._id.toString());
            sLecTotal += 100;
            if (p?.watched)
                sLecScore += 50;
            if (p?.notesMade)
                sLecScore += 25;
            if (p?.shortNotesMade)
                sLecScore += 25;
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
exports.getDashboard = getDashboard;
const getAdminAnalytics = async (_req, res) => {
    const students = await User_1.default.find({ role: 'student', isActive: true }).select('name username email createdAt');
    const totalStudents = students.length;
    const totalSubjects = await Subject_1.default.countDocuments();
    const totalLectures = await Lecture_1.default.countDocuments();
    const totalVocab = await Vocabulary_1.default.countDocuments();
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
exports.getAdminAnalytics = getAdminAnalytics;
//# sourceMappingURL=analyticsController.js.map