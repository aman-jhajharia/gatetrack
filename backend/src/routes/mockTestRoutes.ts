import { Router } from 'express';
import { getMockTests, createMockTest, updateMockTest, deleteMockTest, getMockTestAnalytics } from '../controllers/mockTestController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getMockTests);
router.post('/', createMockTest);
router.get('/analytics', getMockTestAnalytics);
router.put('/:id', updateMockTest);
router.delete('/:id', deleteMockTest);

export default router;
