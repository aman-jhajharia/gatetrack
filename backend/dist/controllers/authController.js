"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.login = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        throw new errorHandler_1.AppError('Please provide username and password', 400);
    const user = await User_1.default.findOne({ username: username.toLowerCase() });
    if (!user || !user.isActive)
        throw new errorHandler_1.AppError('Invalid credentials', 401);
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
        throw new errorHandler_1.AppError('Invalid credentials', 401);
    const token = (0, auth_1.generateToken)(user._id.toString());
    const refreshToken = (0, auth_1.generateRefreshToken)(user._id.toString());
    res.json({
        success: true,
        token,
        refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
        },
    });
};
exports.login = login;
const getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};
exports.getMe = getMe;
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
        throw new errorHandler_1.AppError('Please provide current and new password', 400);
    const user = await User_1.default.findById(req.user._id);
    if (!user)
        throw new errorHandler_1.AppError('User not found', 404);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
        throw new errorHandler_1.AppError('Current password is incorrect', 401);
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
};
exports.changePassword = changePassword;
//# sourceMappingURL=authController.js.map