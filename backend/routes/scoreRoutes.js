const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const { auth, authorize } = require('../middleware/authMiddleware');

// All score routes require authentication
router.use(auth);

// Get all scores (admin can access)
router.get('/', authorize('admin'), scoreController.getScores);

// Get score by ID (admin can access)
router.get('/:id', authorize('admin'), scoreController.getScoreById);

// Create new score (admin can create)
router.post('/', authorize('admin'), scoreController.createScore);

// Update score (admin can update)
router.put('/:id', authorize('admin'), scoreController.updateScore);

// Delete score (admin can delete)
router.delete('/:id', authorize('admin'), scoreController.deleteScore);

module.exports = router;