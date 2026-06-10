"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("../middleware/errorHandler");
const getAllUsers = async (_req, res) => {
    const users = await User_1.default.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    const { name, email, username, password, role } = req.body;
    if (!name || !email || !username || !password)
        throw new errorHandler_1.AppError('All fields are required', 400);
    const existingUser = await User_1.default.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
        throw new errorHandler_1.AppError('Email or username already exists', 400);
    const user = await User_1.default.create({ name, email, username, password, role: role || 'student' });
    res.status(201).json({ success: true, data: user });
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const { name, email, isActive, password } = req.body;
    const user = await User_1.default.findById(req.params.id);
    if (!user)
        throw new errorHandler_1.AppError('User not found', 404);
    if (name)
        user.name = name;
    if (email)
        user.email = email;
    if (typeof isActive === 'boolean')
        user.isActive = isActive;
    if (password)
        user.password = password;
    await user.save();
    res.json({ success: true, data: user });
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const user = await User_1.default.findById(req.params.id);
    if (!user)
        throw new errorHandler_1.AppError('User not found', 404);
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map