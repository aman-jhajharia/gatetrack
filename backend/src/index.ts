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
