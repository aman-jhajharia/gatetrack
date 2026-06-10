import { Router } from 'express';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../controllers/subjectController';
import { getUnits, createUnit, updateUnit, deleteUnit } from '../controllers/unitController';
import { getLectures, createLecture, updateLecture, deleteLecture } from '../controllers/lectureController';
import { getPracticeUnits, createPracticeUnit, updatePracticeUnit, deletePracticeUnit } from '../controllers/practiceController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

// Subjects
router.get('/', protect, getSubjects);
router.post('/', protect, adminOnly, createSubject);
router.put('/:id', protect, adminOnly, updateSubject);
router.delete('/:id', protect, adminOnly, deleteSubject);

// Units nested under subject
router.get('/:subjectId/units', protect, getUnits);
router.post('/:subjectId/units', protect, adminOnly, createUnit);

// Practice units nested under subject
router.get('/:subjectId/practice', protect, getPracticeUnits);
router.post('/:subjectId/practice', protect, adminOnly, createPracticeUnit);

export default router;
