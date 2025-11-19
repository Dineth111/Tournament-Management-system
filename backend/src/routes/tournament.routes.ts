import { Router } from 'express';
import { 
  getTournaments, 
  getTournamentById, 
  createTournament, 
  updateTournament, 
  deleteTournament 
} from '../controllers/tournament.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getTournaments);
router.get('/:id', authenticate, getTournamentById);
router.post('/', authenticate, createTournament);
router.put('/:id', authenticate, updateTournament);
router.delete('/:id', authenticate, deleteTournament);

export default router;