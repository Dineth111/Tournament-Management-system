const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coachController');
const { createCoachValidation, updateCoachValidation } = require('../middleware/coachValidation');
const { auth, authorize } = require('../middleware/authMiddleware');

// All coach routes require authentication
router.use(auth);

// Get all coaches (admin can access)
router.get('/', authorize('admin'), coachController.getCoaches);

// Get coach by ID (admin can access)
router.get('/:id', authorize('admin'), coachController.getCoachById);

// Create new coach (admin can create)
router.post('/', authorize('admin'), createCoachValidation, coachController.createCoach);

// Update coach (admin can update)
router.put('/:id', authorize('admin'), updateCoachValidation, coachController.updateCoach);

// Delete coach (admin can delete)
router.delete('/:id', authorize('admin'), coachController.deleteCoach);

module.exports = router;