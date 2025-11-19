import { Router } from 'express';
import { 
  startMatch, 
  updateScore, 
  addMatchEvent, 
  endMatch 
} from '../controllers/liveScore.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Start a match for live scoring
router.post('/start', authenticate, startMatch);

// Update match score
router.post('/update-score', authenticate, updateScore);

// Add match event (warning, penalty, etc.)
router.post('/event', authenticate, addMatchEvent);

// End match
router.post('/end', authenticate, endMatch);

export default router;