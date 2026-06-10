"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertQuestionProgress = exports.getQuestionProgress = void 0;
const QuestionProgress_1 = __importDefault(require("../models/QuestionProgress"));
const PracticeUnit_1 = __importDefault(require("../models/PracticeUnit"));
const errorHandler_1 = require("../middleware/errorHandler");
const getQuestionProgress = async (req, res) => {
    const progress = await QuestionProgress_1.default.findOne({
        userId: req.user._id,
        practiceUnitId: req.params.practiceUnitId,
    });
    res.json({ success: true, data: progress || null });
};
exports.getQuestionProgress = getQuestionProgress;
const upsertQuestionProgress = async (req, res) => {
    const { solvedQuestions, timesSolved, confidenceLevel, notes } = req.body;
    const practiceUnit = await PracticeUnit_1.default.findById(req.params.practiceUnitId);
    if (!practiceUnit)
        throw new errorHandler_1.AppError('Practice unit not found', 404);
    const updateData = {};
    if (typeof solvedQuestions === 'number')
        updateData.solvedQuestions = Math.min(solvedQuestions, practiceUnit.totalQuestions);
    if (typeof timesSolved === 'number')
        updateData.timesSolved = timesSolved;
    if (typeof confidenceLevel === 'number')
        updateData.confidenceLevel = Math.min(5, Math.max(1, confidenceLevel));
    if (notes !== undefined)
        updateData.notes = notes;
    const progress = await QuestionProgress_1.default.findOneAndUpdate({ userId: req.user._id, practiceUnitId: req.params.practiceUnitId }, { $set: updateData }, { upsert: true, new: true });
    res.json({ success: true, data: progress });
};
exports.upsertQuestionProgress = upsertQuestionProgress;
//# sourceMappingURL=questionProgressController.js.map