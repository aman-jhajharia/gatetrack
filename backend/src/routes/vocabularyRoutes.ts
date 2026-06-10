import { Router } from 'express';
import {
  getVocabulary, createVocabulary, updateVocabulary, deleteVocabulary,
  getVocabularyProgress, updateWordProgress,
} from '../controllers/vocabularyController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', protect, getVocabulary);
router.post('/', protect, adminOnly, createVocabulary);
router.put('/:id', protect, adminOnly, updateVocabulary);
router.delete('/:id', protect, adminOnly, deleteVocabulary);

router.get('/progress', protect, getVocabularyProgress);
router.put('/:wordId/progress', protect, updateWordProgress);

export default router;
