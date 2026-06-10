import { Router } from 'express';
import { getRevision, getAllRevisions, upsertRevision } from '../controllers/revisionController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getAllRevisions);
router.get('/:unitId', protect, getRevision);
router.put('/:unitId', protect, upsertRevision);

export default router;
