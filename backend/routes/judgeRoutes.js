const express = require('express');
const router = express.Router();
const judgeController = require('../controllers/judgeController');
const { createJudgeValidation, updateJudgeValidation } = require('../middleware/judgeValidation');
const { auth, authorize } = require('../middleware/authMiddleware');

// All judge routes require authentication
router.use(auth);

// Get all judges (admin can access)
router.get('/', authorize('admin'), judgeController.getJudges);

// Get judge by ID (admin can access)
router.get('/:id', authorize('admin'), judgeController.getJudgeById);

// Create new judge (admin can create)
router.post('/', authorize('admin'), createJudgeValidation, judgeController.createJudge);

// Update judge (admin can update)
router.put('/:id', authorize('admin'), updateJudgeValidation, judgeController.updateJudge);

// Delete judge (admin can delete)
router.delete('/:id', authorize('admin'), judgeController.deleteJudge);

module.exports = router;