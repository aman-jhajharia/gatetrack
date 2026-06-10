import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import subjectRoutes from './routes/subjectRoutes';
import unitRoutes from './routes/unitRoutes';
import lectureRoutes from './routes/lectureRoutes';
import practiceRoutes from './routes/practiceRoutes';
import revisionRoutes from './routes/revisionRoutes';
import mockTestRoutes from './routes/mockTestRoutes';
import vocabularyRoutes from './routes/vocabularyRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'https://*.vercel.app'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Seed endpoint (since Render free tier has no shell access)
app.get('/api/seed', async (_req, res) => {
  try {
    const User = (await import('./models/User')).default;
    const Subject = (await import('./models/Subject')).default;

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
      error: error.message,
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/revisions', revisionRoutes);
app.use('/api/mock-tests', mockTestRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 GPMS Backend running on port ${PORT}`);
});

export default app;
