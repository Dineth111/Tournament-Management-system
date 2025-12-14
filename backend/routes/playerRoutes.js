const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { createPlayerValidation, updatePlayerValidation } = require('../middleware/playerValidation');
const { auth, authorize } = require('../middleware/authMiddleware');

// All player routes require authentication
router.use(auth);

// Get all players (admin, organizer, coach can access)
router.get('/', authorize('admin', 'organizer', 'coach'), playerController.getPlayers);

// Get player by ID (admin, organizer, coach, player can access their own data)
router.get('/:id', authorize('admin', 'organizer', 'coach'), playerController.getPlayerById);

// Create new player (admin, organizer can create)
router.post('/', authorize('admin', 'organizer'), createPlayerValidation, playerController.createPlayer);

// Update player (admin, organizer can update)
router.put('/:id', authorize('admin', 'organizer'), updatePlayerValidation, playerController.updatePlayer);

// Delete player (admin, organizer can delete)
router.delete('/:id', authorize('admin', 'organizer'), playerController.deletePlayer);

module.exports = router;