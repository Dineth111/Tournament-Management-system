const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { createOrganizerValidation, updateOrganizerValidation } = require('../middleware/organizerValidation');
const { auth, authorize } = require('../middleware/authMiddleware');

// All organizer routes require authentication
router.use(auth);

// Get all organizers (admin can access)
router.get('/', authorize('admin'), organizerController.getOrganizers);

// Get organizer by ID (admin can access)
router.get('/:id', authorize('admin'), organizerController.getOrganizerById);

// Create new organizer (admin can create)
router.post('/', authorize('admin'), createOrganizerValidation, organizerController.createOrganizer);

// Update organizer (admin can update)
router.put('/:id', authorize('admin'), updateOrganizerValidation, organizerController.updateOrganizer);

// Delete organizer (admin can delete)
router.delete('/:id', authorize('admin'), organizerController.deleteOrganizer);

module.exports = router;