"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubject = exports.updateSubject = exports.createSubject = exports.getSubjects = void 0;
const Subject_1 = __importDefault(require("../models/Subject"));
const errorHandler_1 = require("../middleware/errorHandler");
const getSubjects = async (_req, res) => {
    const subjects = await Subject_1.default.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: subjects });
};
exports.getSubjects = getSubjects;
const createSubject = async (req, res) => {
    const { name, code, order } = req.body;
    if (!name || !code)
        throw new errorHandler_1.AppError('Name and code are required', 400);
    const subject = await Subject_1.default.create({ name, code, order: order || 0 });
    res.status(201).json({ success: true, data: subject });
};
exports.createSubject = createSubject;
const updateSubject = async (req, res) => {
    const subject = await Subject_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject)
        throw new errorHandler_1.AppError('Subject not found', 404);
    res.json({ success: true, data: subject });
};
exports.updateSubject = updateSubject;
const deleteSubject = async (req, res) => {
    const subject = await Subject_1.default.findById(req.params.id);
    if (!subject)
        throw new errorHandler_1.AppError('Subject not found', 404);
    await subject.deleteOne();
    res.json({ success: true, message: 'Subject deleted' });
};
exports.deleteSubject = deleteSubject;
//# sourceMappingURL=subjectController.js.map