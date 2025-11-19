import { Router } from 'express';
import { 
  getPlayers, 
  getPlayerById, 
  createPlayer, 
  updatePlayer, 
  deletePlayer 
} from '../controllers/player.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getPlayers);
router.get('/:id', authenticate, getPlayerById);
router.post('/', authenticate, createPlayer);
router.put('/:id', authenticate, updatePlayer);
router.delete('/:id', authenticate, deletePlayer);

export default router;