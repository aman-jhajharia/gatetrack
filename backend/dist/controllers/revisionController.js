"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertRevision = exports.getAllRevisions = exports.getRevision = void 0;
const Revision_1 = __importDefault(require("../models/Revision"));
const Unit_1 = __importDefault(require("../models/Unit"));
const errorHandler_1 = require("../middleware/errorHandler");
const getRevision = async (req, res) => {
    const revision = await Revision_1.default.findOne({ userId: req.user._id, unitId: req.params.unitId });
    res.json({ success: true, data: revision || null });
};
exports.getRevision = getRevision;
const getAllRevisions = async (req, res) => {
    const revisions = await Revision_1.default.find({ userId: req.user._id }).populate('unitId', 'name subjectId');
    res.json({ success: true, data: revisions });
};
exports.getAllRevisions = getAllRevisions;
const upsertRevision = async (req, res) => {
    const { rev1Done, rev1Date, rev2Done, rev2Date, rev3Done, rev3Date, rev4Done, rev4Date } = req.body;
    const unit = await Unit_1.default.findById(req.params.unitId);
    if (!unit)
        throw new errorHandler_1.AppError('Unit not found', 404);
    const updateData = {};
    if (typeof rev1Done === 'boolean') {
        updateData.rev1Done = rev1Done;
        if (rev1Done && !rev1Date)
            updateData.rev1Date = new Date();
    }
    if (rev1Date)
        updateData.rev1Date = rev1Date;
    if (typeof rev2Done === 'boolean') {
        updateData.rev2Done = rev2Done;
        if (rev2Done && !rev2Date)
            updateData.rev2Date = new Date();
    }
    if (rev2Date)
        updateData.rev2Date = rev2Date;
    if (typeof rev3Done === 'boolean') {
        updateData.rev3Done = rev3Done;
        if (rev3Done && !rev3Date)
            updateData.rev3Date = new Date();
    }
    if (rev3Date)
        updateData.rev3Date = rev3Date;
    if (typeof rev4Done === 'boolean') {
        updateData.rev4Done = rev4Done;
        if (rev4Done && !rev4Date)
            updateData.rev4Date = new Date();
    }
    if (rev4Date)
        updateData.rev4Date = rev4Date;
    const revision = await Revision_1.default.findOneAndUpdate({ userId: req.user._id, unitId: req.params.unitId }, { $set: updateData }, { upsert: true, new: true });
    res.json({ success: true, data: revision });
};
exports.upsertRevision = upsertRevision;
//# sourceMappingURL=revisionController.js.map