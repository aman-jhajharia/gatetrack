"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLecture = exports.updateLecture = exports.createLecture = exports.getLectures = void 0;
const Lecture_1 = __importDefault(require("../models/Lecture"));
const Unit_1 = __importDefault(require("../models/Unit"));
const errorHandler_1 = require("../middleware/errorHandler");
const getLectures = async (req, res) => {
    const lectures = await Lecture_1.default.find({ unitId: String(req.params.unitId) }).sort({ sequenceNumber: 1 });
    res.json({ success: true, data: lectures });
};
exports.getLectures = getLectures;
const createLecture = async (req, res) => {
    const { title, durationMinutes, sequenceNumber } = req.body;
    if (!title || sequenceNumber === undefined)
        throw new errorHandler_1.AppError('Title and sequence number are required', 400);
    const unit = await Unit_1.default.findById(req.params.unitId);
    if (!unit)
        throw new errorHandler_1.AppError('Unit not found', 404);
    const lecture = await Lecture_1.default.create({
        unitId: String(req.params.unitId),
        subjectId: unit.subjectId,
        title,
        durationMinutes: durationMinutes || 0,
        sequenceNumber,
    });
    res.status(201).json({ success: true, data: lecture });
};
exports.createLecture = createLecture;
const updateLecture = async (req, res) => {
    const lecture = await Lecture_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lecture)
        throw new errorHandler_1.AppError('Lecture not found', 404);
    res.json({ success: true, data: lecture });
};
exports.updateLecture = updateLecture;
const deleteLecture = async (req, res) => {
    const lecture = await Lecture_1.default.findById(req.params.id);
    if (!lecture)
        throw new errorHandler_1.AppError('Lecture not found', 404);
    await lecture.deleteOne();
    res.json({ success: true, message: 'Lecture deleted' });
};
exports.deleteLecture = deleteLecture;
//# sourceMappingURL=lectureController.js.map