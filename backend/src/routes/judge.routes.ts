import { Router } from 'express';
import { 
  getJudges, 
  getJudgeById, 
  createJudge, 
  updateJudge, 
  deleteJudge 
} from '../controllers/judge.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getJudges);
router.get('/:id', authenticate, getJudgeById);
router.post('/', authenticate, createJudge);
router.put('/:id', authenticate, updateJudge);
router.delete('/:id', authenticate, deleteJudge);

export default router;