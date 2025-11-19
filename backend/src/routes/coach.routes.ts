import { Router } from 'express';
import { 
  getCoaches, 
  getCoachById, 
  createCoach, 
  updateCoach, 
  deleteCoach 
} from '../controllers/coach.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getCoaches);
router.get('/:id', authenticate, getCoachById);
router.post('/', authenticate, createCoach);
router.put('/:id', authenticate, updateCoach);
router.delete('/:id', authenticate, deleteCoach);

export default router;