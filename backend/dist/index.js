"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const db_1 = __importDefault(require("./config/db"));
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const subjectRoutes_1 = __importDefault(require("./routes/subjectRoutes"));
const unitRoutes_1 = __importDefault(require("./routes/unitRoutes"));
const lectureRoutes_1 = __importDefault(require("./routes/lectureRoutes"));
const practiceRoutes_1 = __importDefault(require("./routes/practiceRoutes"));
const revisionRoutes_1 = __importDefault(require("./routes/revisionRoutes"));
const mockTestRoutes_1 = __importDefault(require("./routes/mockTestRoutes"));
const vocabularyRoutes_1 = __importDefault(require("./routes/vocabularyRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect DB
(0, db_1.default)();
// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin)
            return callback(null, true);
        const isAllowed = allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.startsWith('http://localhost:');
        if (isAllowed) {
            callback(null, true);
        }
        else {
            callback(null, false); // Don't throw an error, just block CORS
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Seed endpoint (since Render free tier has no shell access)
app.get('/api/seed', async (_req, res) => {
    try {
        const User = (await Promise.resolve().then(() => __importStar(require('./models/User')))).default;
        const Subject = (await Promise.resolve().then(() => __importStar(require('./models/Subject')))).default;
        const SUBJECTS = [
            { name: 'Discrete Mathematics', code: 'DM', order: 1 },
            { name: 'Engineering Mathematics', code: 'EM', order: 2 },
            { name: 'Theory of Computation', code: 'TOC', order: 3 },
            { name: 'Digital Logic', code: 'DL', order: 4 },
            { name: 'Computer Organization and Architecture', code: 'COA', order: 5 },
            { name: 'C Programming', code: 'CP', order: 6 },
            { name: 'Data Structures', code: 'DS', order: 7 },
            { name: 'Algorithms', code: 'ALGO', order: 8 },
            { name: 'Compiler Design', code: 'CD', order: 9 },
            { name: 'Operating Systems', code: 'OS', order: 10 },
            { name: 'DBMS', code: 'DBMS', order: 11 },
            { name: 'Computer Networks', code: 'CN', order: 12 },
            { name: 'General Aptitude', code: 'GA', order: 13 },
        ];
        // Create admin
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@gpms.com';
        const adminName = process.env.ADMIN_NAME || 'System Admin';
        let adminCreated = false;
        const existingAdmin = await User.findOne({ username: adminUsername });
        if (!existingAdmin) {
            await User.create({
                name: adminName,
                email: adminEmail,
                username: adminUsername,
                password: adminPassword,
                role: 'admin',
            });
            adminCreated = true;
        }
        // Seed subjects
        const createdSubjects = [];
        for (const sub of SUBJECTS) {
            const existing = await Subject.findOne({ code: sub.code });
            if (!existing) {
                await Subject.create(sub);
                createdSubjects.push(sub.name);
            }
        }
        res.json({
            success: true,
            message: 'Seeding completed successfully!',
            adminCreated,
            adminUsername,
            subjectsAdded: createdSubjects,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Seeding failed',
            error: error.message,
        });
    }
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin/users', userRoutes_1.default);
app.use('/api/subjects', subjectRoutes_1.default);
app.use('/api/units', unitRoutes_1.default);
app.use('/api/lectures', lectureRoutes_1.default);
app.use('/api/practice', practiceRoutes_1.default);
app.use('/api/revisions', revisionRoutes_1.default);
app.use('/api/mock-tests', mockTestRoutes_1.default);
app.use('/api/vocabulary', vocabularyRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 GPMS Backend running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map