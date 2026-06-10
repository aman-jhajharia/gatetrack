"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockTestAnalytics = exports.deleteMockTest = exports.updateMockTest = exports.createMockTest = exports.getMockTests = void 0;
const MockTest_1 = __importDefault(require("../models/MockTest"));
const errorHandler_1 = require("../middleware/errorHandler");
const getMockTests = async (req, res) => {
    const tests = await MockTest_1.default.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ success: true, data: tests });
};
exports.getMockTests = getMockTests;
const createMockTest = async (req, res) => {
    const { testName, date, score, maxScore, accuracy, rank, attemptedQuestions, totalQuestions } = req.body;
    if (!testName || !date || score === undefined || !maxScore || accuracy === undefined || !attemptedQuestions || !totalQuestions) {
        throw new errorHandler_1.AppError('All required fields must be provided', 400);
    }
    const test = await MockTest_1.default.create({
        userId: req.user._id,
        testName,
        date,
        score,
        maxScore,
        accuracy,
        rank: rank || null,
        attemptedQuestions,
        totalQuestions,
    });
    res.status(201).json({ success: true, data: test });
};
exports.createMockTest = createMockTest;
const updateMockTest = async (req, res) => {
    const test = await MockTest_1.default.findOne({ _id: req.params.id, userId: req.user._id });
    if (!test)
        throw new errorHandler_1.AppError('Test not found', 404);
    const updated = await MockTest_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
};
exports.updateMockTest = updateMockTest;
const deleteMockTest = async (req, res) => {
    const test = await MockTest_1.default.findOne({ _id: req.params.id, userId: req.user._id });
    if (!test)
        throw new errorHandler_1.AppError('Test not found', 404);
    await test.deleteOne();
    res.json({ success: true, message: 'Test deleted' });
};
exports.deleteMockTest = deleteMockTest;
const getMockTestAnalytics = async (req, res) => {
    const tests = await MockTest_1.default.find({ userId: req.user._id }).sort({ date: 1 });
    if (!tests.length) {
        res.json({ success: true, data: { totalTests: 0, avgScore: 0, highestScore: 0, avgAccuracy: 0, trend: [] } });
        return;
    }
    const totalTests = tests.length;
    const avgScore = Math.round(tests.reduce((sum, t) => sum + (t.score / t.maxScore) * 100, 0) / totalTests);
    const highestScore = Math.round(Math.max(...tests.map((t) => (t.score / t.maxScore) * 100)));
    const avgAccuracy = Math.round(tests.reduce((sum, t) => sum + t.accuracy, 0) / totalTests);
    const trend = tests.map((t) => ({
        date: t.date,
        testName: t.testName,
        scorePct: Math.round((t.score / t.maxScore) * 100),
        accuracy: t.accuracy,
    }));
    res.json({ success: true, data: { totalTests, avgScore, highestScore, avgAccuracy, trend } });
};
exports.getMockTestAnalytics = getMockTestAnalytics;
//# sourceMappingURL=mockTestController.js.map