"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestionLog = exports.createOrUpdateQuestionLog = exports.getQuestionLogs = void 0;
const QuestionLog_1 = __importDefault(require("../models/QuestionLog"));
const PracticeUnit_1 = __importDefault(require("../models/PracticeUnit"));
const errorHandler_1 = require("../middleware/errorHandler");
const getQuestionLogs = async (req, res) => {
    const { practiceUnitId } = req.params;
    const logs = await QuestionLog_1.default.find({
        userId: req.user._id,
        practiceUnitId,
    }).sort({ createdAt: 1 });
    res.json({ success: true, data: logs });
};
exports.getQuestionLogs = getQuestionLogs;
const createOrUpdateQuestionLog = async (req, res) => {
    const { practiceUnitId } = req.params;
    const { questionIdentifier, timesPracticed, toughness, notes } = req.body;
    if (!questionIdentifier)
        throw new errorHandler_1.AppError('Question identifier is required', 400);
    const practiceUnit = await PracticeUnit_1.default.findById(practiceUnitId);
    if (!practiceUnit)
        throw new errorHandler_1.AppError('Practice unit not found', 404);
    const updateData = {};
    if (typeof timesPracticed === 'number')
        updateData.timesPracticed = Math.max(1, timesPracticed);
    if (typeof toughness === 'number')
        updateData.toughness = Math.min(5, Math.max(1, toughness));
    if (notes !== undefined)
        updateData.notes = notes;
    const log = await QuestionLog_1.default.findOneAndUpdate({
        userId: req.user._id,
        practiceUnitId,
        questionIdentifier: questionIdentifier.trim(),
    }, {
        $set: updateData,
    }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
    });
    res.json({ success: true, data: log });
};
exports.createOrUpdateQuestionLog = createOrUpdateQuestionLog;
const deleteQuestionLog = async (req, res) => {
    const { id } = req.params;
    const log = await QuestionLog_1.default.findOneAndDelete({
        _id: id,
        userId: req.user._id,
    });
    if (!log)
        throw new errorHandler_1.AppError('Question log not found', 404);
    res.json({ success: true, message: 'Question log deleted successfully' });
};
exports.deleteQuestionLog = deleteQuestionLog;
//# sourceMappingURL=questionLogController.js.map