"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnit = exports.updateUnit = exports.createUnit = exports.getUnits = void 0;
const Unit_1 = __importDefault(require("../models/Unit"));
const errorHandler_1 = require("../middleware/errorHandler");
const getUnits = async (req, res) => {
    const units = await Unit_1.default.find({ subjectId: String(req.params.subjectId) }).sort({ order: 1, name: 1 });
    res.json({ success: true, data: units });
};
exports.getUnits = getUnits;
const createUnit = async (req, res) => {
    const { name, order } = req.body;
    if (!name)
        throw new errorHandler_1.AppError('Unit name is required', 400);
    const unit = await Unit_1.default.create({ subjectId: String(req.params.subjectId), name, order: order || 0 });
    res.status(201).json({ success: true, data: unit });
};
exports.createUnit = createUnit;
const updateUnit = async (req, res) => {
    const unit = await Unit_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!unit)
        throw new errorHandler_1.AppError('Unit not found', 404);
    res.json({ success: true, data: unit });
};
exports.updateUnit = updateUnit;
const deleteUnit = async (req, res) => {
    const unit = await Unit_1.default.findById(req.params.id);
    if (!unit)
        throw new errorHandler_1.AppError('Unit not found', 404);
    await unit.deleteOne();
    res.json({ success: true, message: 'Unit deleted' });
};
exports.deleteUnit = deleteUnit;
//# sourceMappingURL=unitController.js.map