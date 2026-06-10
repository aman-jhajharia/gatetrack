import { Router } from 'express';
import { getDashboard, getAdminAnalytics } from '../controllers/analyticsController';
import { getProgressSummary } from '../controllers/lectureProgressController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/dashboard', protect, getDashboard);
router.get('/lecture-summary', protect, getProgressSummary);
router.get('/admin', protect, adminOnly, getAdminAnalytics);

export default router;
