const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { createTournamentValidation, updateTournamentValidation } = require('../middleware/tournamentValidation');
const { auth, authorize } = require('../middleware/authMiddleware');

// All tournament routes require authentication
router.use(auth);

// Get all tournaments (admin, organizer can access)
router.get('/', authorize('admin', 'organizer'), tournamentController.getTournaments);

// Get tournament by ID (admin, organizer can access)
router.get('/:id', authorize('admin', 'organizer'), tournamentController.getTournamentById);

// Create new tournament (admin, organizer can create)
router.post('/', authorize('admin', 'organizer'), createTournamentValidation, tournamentController.createTournament);

// Update tournament (admin, organizer can update)
router.put('/:id', authorize('admin', 'organizer'), updateTournamentValidation, tournamentController.updateTournament);

// Delete tournament (admin, organizer can delete)
router.delete('/:id', authorize('admin', 'organizer'), tournamentController.deleteTournament);

module.exports = router;