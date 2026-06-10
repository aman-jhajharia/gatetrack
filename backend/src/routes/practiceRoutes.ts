import { Router } from 'express';
import { updatePracticeUnit, deletePracticeUnit } from '../controllers/practiceController';
import { getQuestionProgress, upsertQuestionProgress } from '../controllers/questionProgressController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.put('/:id', protect, adminOnly, updatePracticeUnit);
router.delete('/:id', protect, adminOnly, deletePracticeUnit);

// Question progress
router.get('/:practiceUnitId/progress', protect, getQuestionProgress);
router.put('/:practiceUnitId/progress', protect, upsertQuestionProgress);

export default router;
