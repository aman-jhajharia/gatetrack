"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWordProgress = exports.getVocabularyProgress = exports.deleteVocabulary = exports.updateVocabulary = exports.createVocabulary = exports.getVocabulary = void 0;
const Vocabulary_1 = __importDefault(require("../models/Vocabulary"));
const VocabularyProgress_1 = __importDefault(require("../models/VocabularyProgress"));
const errorHandler_1 = require("../middleware/errorHandler");
const getVocabulary = async (_req, res) => {
    const words = await Vocabulary_1.default.find().sort({ word: 1 }).populate('createdBy', 'name');
    res.json({ success: true, data: words });
};
exports.getVocabulary = getVocabulary;
const createVocabulary = async (req, res) => {
    const { word, meaning, synonyms, antonyms, exampleSentence } = req.body;
    if (!word || !meaning)
        throw new errorHandler_1.AppError('Word and meaning are required', 400);
    const vocab = await Vocabulary_1.default.create({
        word,
        meaning,
        synonyms: synonyms || [],
        antonyms: antonyms || [],
        exampleSentence: exampleSentence || '',
        createdBy: req.user._id,
    });
    res.status(201).json({ success: true, data: vocab });
};
exports.createVocabulary = createVocabulary;
const updateVocabulary = async (req, res) => {
    const vocab = await Vocabulary_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vocab)
        throw new errorHandler_1.AppError('Word not found', 404);
    res.json({ success: true, data: vocab });
};
exports.updateVocabulary = updateVocabulary;
const deleteVocabulary = async (req, res) => {
    const vocab = await Vocabulary_1.default.findById(req.params.id);
    if (!vocab)
        throw new errorHandler_1.AppError('Word not found', 404);
    await vocab.deleteOne();
    res.json({ success: true, message: 'Word deleted' });
};
exports.deleteVocabulary = deleteVocabulary;
const getVocabularyProgress = async (req, res) => {
    const progress = await VocabularyProgress_1.default.find({ userId: req.user._id });
    const progressMap = Object.fromEntries(progress.map((p) => [p.wordId.toString(), p.status]));
    const total = await Vocabulary_1.default.countDocuments();
    const known = progress.filter((p) => p.status === 'known').length;
    const unknown = progress.filter((p) => p.status === 'unknown').length;
    const needsRevision = progress.filter((p) => p.status === 'needs_revision').length;
    res.json({
        success: true,
        data: { progressMap, stats: { total, known, unknown, needsRevision, notSeen: total - progress.length } },
    });
};
exports.getVocabularyProgress = getVocabularyProgress;
const updateWordProgress = async (req, res) => {
    const { status } = req.body;
    if (!['unknown', 'needs_revision', 'known'].includes(status))
        throw new errorHandler_1.AppError('Invalid status', 400);
    const vocab = await Vocabulary_1.default.findById(req.params.wordId);
    if (!vocab)
        throw new errorHandler_1.AppError('Word not found', 404);
    const progress = await VocabularyProgress_1.default.findOneAndUpdate({ userId: req.user._id, wordId: req.params.wordId }, { status }, { upsert: true, new: true });
    res.json({ success: true, data: progress });
};
exports.updateWordProgress = updateWordProgress;
//# sourceMappingURL=vocabularyController.js.map