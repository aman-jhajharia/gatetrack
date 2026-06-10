import { Router } from 'express';
import { updateUnit, deleteUnit } from '../controllers/unitController';
import { getLectures, createLecture, updateLecture, deleteLecture } from '../controllers/lectureController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.put('/:id', protect, adminOnly, updateUnit);
router.delete('/:id', protect, adminOnly, deleteUnit);

// Lectures nested under unit
router.get('/:unitId/lectures', protect, getLectures);
router.post('/:unitId/lectures', protect, adminOnly, createLecture);

export default router;
