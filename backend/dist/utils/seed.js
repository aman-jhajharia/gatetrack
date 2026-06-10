"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const db_1 = __importDefault(require("../config/db"));
const User_1 = __importDefault(require("../models/User"));
const Subject_1 = __importDefault(require("../models/Subject"));
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
const seed = async () => {
    await (0, db_1.default)();
    console.log('🌱 Starting seed...');
    // Create admin
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gpms.com';
    const adminName = process.env.ADMIN_NAME || 'System Admin';
    const existingAdmin = await User_1.default.findOne({ username: adminUsername });
    if (!existingAdmin) {
        await User_1.default.create({ name: adminName, email: adminEmail, username: adminUsername, password: adminPassword, role: 'admin' });
        console.log(`✅ Admin created: ${adminUsername} / ${adminPassword}`);
    }
    else {
        console.log(`ℹ️  Admin already exists: ${adminUsername}`);
    }
    // Seed subjects
    for (const sub of SUBJECTS) {
        const existing = await Subject_1.default.findOne({ code: sub.code });
        if (!existing) {
            await Subject_1.default.create(sub);
            console.log(`✅ Subject created: ${sub.name}`);
        }
        else {
            console.log(`ℹ️  Subject exists: ${sub.name}`);
        }
    }
    console.log('🎉 Seed complete!');
    process.exit(0);
};
seed().catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map