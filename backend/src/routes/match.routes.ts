import { Router } from 'express';
import { 
  getMatches, 
  getMatchById, 
  createMatch, 
  updateMatch, 
  deleteMatch,
  generateMatchDraw
} from '../controllers/match.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getMatches);
router.get('/:id', authenticate, getMatchById);
router.post('/', authenticate, createMatch);
router.put('/:id', authenticate, updateMatch);
router.delete('/:id', authenticate, deleteMatch);
router.post('/generate-draw', authenticate, generateMatchDraw);

export default router;