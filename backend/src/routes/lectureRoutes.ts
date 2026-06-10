import { Router } from 'express';
import { updateLecture, deleteLecture } from '../controllers/lectureController';
import { getLectureProgress, upsertLectureProgress } from '../controllers/lectureProgressController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.put('/:id', protect, adminOnly, updateLecture);
router.delete('/:id', protect, adminOnly, deleteLecture);

// Progress
router.get('/:lectureId/progress', protect, getLectureProgress);
router.put('/:lectureId/progress', protect, upsertLectureProgress);

export default router;
