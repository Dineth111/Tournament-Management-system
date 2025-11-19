import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Placeholder routes - will be implemented later
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'Users route' });
});

export default router;