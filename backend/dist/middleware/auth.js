"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Access denied: Admin only' });
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '15m'),
    });
};
exports.generateToken = generateToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
    });
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=auth.js.map