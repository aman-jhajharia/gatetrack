"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePracticeUnit = exports.updatePracticeUnit = exports.createPracticeUnit = exports.getPracticeUnits = void 0;
const PracticeUnit_1 = __importDefault(require("../models/PracticeUnit"));
const errorHandler_1 = require("../middleware/errorHandler");
const getPracticeUnits = async (req, res) => {
    const units = await PracticeUnit_1.default.find({ subjectId: String(req.params.subjectId) }).sort({ unitName: 1 });
    res.json({ success: true, data: units });
};
exports.getPracticeUnits = getPracticeUnits;
const createPracticeUnit = async (req, res) => {
    const { unitName, totalQuestions } = req.body;
    if (!unitName || !totalQuestions)
        throw new errorHandler_1.AppError('Unit name and total questions are required', 400);
    const unit = await PracticeUnit_1.default.create({ subjectId: String(req.params.subjectId), unitName, totalQuestions });
    res.status(201).json({ success: true, data: unit });
};
exports.createPracticeUnit = createPracticeUnit;
const updatePracticeUnit = async (req, res) => {
    const unit = await PracticeUnit_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!unit)
        throw new errorHandler_1.AppError('Practice unit not found', 404);
    res.json({ success: true, data: unit });
};
exports.updatePracticeUnit = updatePracticeUnit;
const deletePracticeUnit = async (req, res) => {
    const unit = await PracticeUnit_1.default.findById(req.params.id);
    if (!unit)
        throw new errorHandler_1.AppError('Practice unit not found', 404);
    await unit.deleteOne();
    res.json({ success: true, message: 'Practice unit deleted' });
};
exports.deletePracticeUnit = deletePracticeUnit;
//# sourceMappingURL=practiceController.js.map