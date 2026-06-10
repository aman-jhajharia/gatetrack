"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgressSummary = exports.upsertLectureProgress = exports.getLectureProgress = void 0;
const LectureProgress_1 = __importDefault(require("../models/LectureProgress"));
const Lecture_1 = __importDefault(require("../models/Lecture"));
const errorHandler_1 = require("../middleware/errorHandler");
const getLectureProgress = async (req, res) => {
    const progress = await LectureProgress_1.default.findOne({
        userId: req.user._id,
        lectureId: req.params.lectureId,
    });
    res.json({ success: true, data: progress || null });
};
exports.getLectureProgress = getLectureProgress;
const upsertLectureProgress = async (req, res) => {
    const { watched, notesMade, shortNotesMade, revisionCount, notes } = req.body;
    const lecture = await Lecture_1.default.findById(req.params.lectureId);
    if (!lecture)
        throw new errorHandler_1.AppError('Lecture not found', 404);
    const updateData = {};
    if (typeof watched === 'boolean') {
        updateData.watched = watched;
        updateData.watchedAt = watched ? new Date() : null;
    }
    if (typeof notesMade === 'boolean')
        updateData.notesMade = notesMade;
    if (typeof shortNotesMade === 'boolean')
        updateData.shortNotesMade = shortNotesMade;
    if (typeof revisionCount === 'number')
        updateData.revisionCount = revisionCount;
    if (notes !== undefined)
        updateData.notes = notes;
    const progress = await LectureProgress_1.default.findOneAndUpdate({ userId: req.user._id, lectureId: req.params.lectureId }, { $set: updateData }, { upsert: true, new: true });
    res.json({ success: true, data: progress });
};
exports.upsertLectureProgress = upsertLectureProgress;
const getProgressSummary = async (req, res) => {
    const userId = req.user._id;
    const allLectures = await Lecture_1.default.find();
    const allProgress = await LectureProgress_1.default.find({ userId });
    const progressMap = new Map(allProgress.map((p) => [p.lectureId.toString(), p]));
    const subjectMap = {};
    let totalScore = 0;
    let totalMax = 0;
    for (const lecture of allLectures) {
        const sid = lecture.subjectId.toString();
        if (!subjectMap[sid])
            subjectMap[sid] = { total: 0, score: 0 };
        const prog = progressMap.get(lecture._id.toString());
        let score = 0;
        if (prog?.watched)
            score += 50;
        if (prog?.notesMade)
            score += 25;
        if (prog?.shortNotesMade)
            score += 25;
        subjectMap[sid].total += 100;
        subjectMap[sid].score += score;
        totalScore += score;
        totalMax += 100;
    }
    const overallPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    const subjectProgress = {};
    for (const [sid, val] of Object.entries(subjectMap)) {
        subjectProgress[sid] = val.total > 0 ? Math.round((val.score / val.total) * 100) : 0;
    }
    res.json({ success: true, data: { overallPct, subjectProgress } });
};
exports.getProgressSummary = getProgressSummary;
//# sourceMappingURL=lectureProgressController.js.map