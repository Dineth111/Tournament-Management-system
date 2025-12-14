const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { createTeamValidation, updateTeamValidation } = require('../middleware/teamValidation');
const { auth, authorize } = require('../middleware/authMiddleware');

// All team routes require authentication
router.use(auth);

// Get all teams (admin, organizer, coach can access)
router.get('/', authorize('admin', 'organizer', 'coach'), teamController.getTeams);

// Get team by ID (admin, organizer, coach can access)
router.get('/:id', authorize('admin', 'organizer', 'coach'), teamController.getTeamById);

// Create new team (admin, organizer can create)
router.post('/', authorize('admin', 'organizer'), createTeamValidation, teamController.createTeam);

// Update team (admin, organizer, coach can update)
router.put('/:id', authorize('admin', 'organizer', 'coach'), updateTeamValidation, teamController.updateTeam);

// Delete team (admin, organizer can delete)
router.delete('/:id', authorize('admin', 'organizer'), teamController.deleteTeam);

module.exports = router;