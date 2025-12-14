const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { createMatchValidation, updateMatchValidation } = require('../middleware/matchValidation');
const { auth, authorize } = require('../middleware/authMiddleware');

// All match routes require authentication
router.use(auth);

// Get all matches (admin, organizer, judge can access)
router.get('/', authorize('admin', 'organizer', 'judge'), matchController.getMatches);

// Get match by ID (admin, organizer, judge can access)
router.get('/:id', authorize('admin', 'organizer', 'judge'), matchController.getMatchById);

// Create new match (admin, organizer can create)
router.post('/', authorize('admin', 'organizer'), createMatchValidation, matchController.createMatch);

// Update match (admin, organizer, judge can update)
router.put('/:id', authorize('admin', 'organizer', 'judge'), updateMatchValidation, matchController.updateMatch);

// Delete match (admin, organizer can delete)
router.delete('/:id', authorize('admin', 'organizer'), matchController.deleteMatch);

module.exports = router;