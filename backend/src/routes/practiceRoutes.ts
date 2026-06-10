import { Router } from 'express';
import { updatePracticeUnit, deletePracticeUnit } from '../controllers/practiceController';
import { getQuestionProgress, upsertQuestionProgress } from '../controllers/questionProgressController';
import { getQuestionLogs, createOrUpdateQuestionLog, deleteQuestionLog } from '../controllers/questionLogController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.put('/:id', protect, adminOnly, updatePracticeUnit);
router.delete('/:id', protect, adminOnly, deletePracticeUnit);

// Question progress (aggregate unit stats)
router.get('/:practiceUnitId/progress', protect, getQuestionProgress);
router.put('/:practiceUnitId/progress', protect, upsertQuestionProgress);

// Granular Question Logs
router.get('/:practiceUnitId/question-logs', protect, getQuestionLogs);
router.post('/:practiceUnitId/question-logs', protect, createOrUpdateQuestionLog);
router.delete('/question-logs/:id', protect, deleteQuestionLog);

export default router;
