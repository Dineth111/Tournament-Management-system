const express = require('express');
const { body } = require('express-validator');
const {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  addScore,
  determineWinner,
  addLiveUpdate,
  addIncident
} = require('../controllers/matchController');
const { protect, authorize, authorizeResource } = require('../middleware/auth');

const router = express.Router();

// Validation rules for match creation and updates
const matchValidation = [
  body('tournament')
    .isMongoId()
    .withMessage('Please provide a valid tournament ID'),
  body('category')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters'),
  body('round')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Round cannot exceed 50 characters'),
  body('participants')
    .isArray({ min: 2 })
    .withMessage('Match must have at least 2 participants'),
  body('participants.*.player')
    .isMongoId()
    .withMessage('Please provide valid player IDs'),
  body('judges')
    .isArray({ min: 1 })
    .withMessage('Match must have at least 1 judge'),
  body('judges.*.judge')
    .isMongoId()
    .withMessage('Please provide valid judge IDs'),
  body('judges.*.role')
    .isIn(['head', 'senior', 'judge', 'assistant'])
    .withMessage('Judge role must be head, senior, judge, or assistant'),
  body('schedule.startTime')
    .isISO8601()
    .withMessage('Please provide a valid start time'),
  body('schedule.endTime')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end time'),
  body('schedule.mat')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Mat designation cannot exceed 50 characters'),
  body('status')
    .isIn(['scheduled', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be scheduled, in_progress, completed, or cancelled')
];

const scoreValidation = [
  body('playerId')
    .isMongoId()
    .withMessage('Please provide a valid player ID'),
  body('scores')
    .isObject()
    .withMessage('Scores must be an object'),
  body('scores.*')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Individual scores must be between 0 and 10')
];

const winnerValidation = [
  body('winnerId')
    .isMongoId()
    .withMessage('Please provide a valid winner ID'),
  body('method')
    .isIn(['points', 'ippon', 'waza_ari', 'hansoku_make', 'kiken', 'walkover', 'disqualification'])
    .withMessage('Method must be a valid karate match result method'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const liveUpdateValidation = [
  body('type')
    .isIn(['score_update', 'incident', 'status_change', 'time_update', 'announcement'])
    .withMessage('Update type must be a valid type'),
  body('message')
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  body('data')
    .optional()
    .isObject()
    .withMessage('Data must be an object')
];

const incidentValidation = [
  body('type')
    .isIn(['warning', 'penalty', 'injury', 'timeout', 'disqualification', 'protest'])
    .withMessage('Incident type must be a valid type'),
  body('description')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Severity must be low, medium, high, or critical'),
  body('participantId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid participant ID')
];

// Public routes
router.get('/', getMatches);
router.get('/:id', getMatch);

// Protected routes - require authentication
router.use(protect);

// Match management routes (Organizer and Admin)
router.post('/', 
  authorize('organizer', 'admin'), 
  matchValidation, 
  createMatch
);

router.put('/:id', 
  authorize('organizer', 'admin', 'judge'), 
  authorizeResource('match'), 
  matchValidation, 
  updateMatch
);

// Scoring routes (Judge assigned to match, Organizer, Admin)
router.post('/:id/scores', 
  authorize('judge', 'organizer', 'admin'), 
  authorizeResource('match'), 
  scoreValidation, 
  addScore
);

router.post('/:id/determine-winner', 
  authorize('judge', 'organizer', 'admin'), 
  authorizeResource('match'), 
  winnerValidation, 
  determineWinner
);

// Live updates (Judge assigned to match, Organizer, Admin)
router.post('/:id/live-updates', 
  authorize('judge', 'organizer', 'admin'), 
  authorizeResource('match'), 
  liveUpdateValidation, 
  addLiveUpdate
);

// Incident reporting (Judge assigned to match, Organizer, Admin)
router.post('/:id/incidents', 
  authorize('judge', 'organizer', 'admin'), 
  authorizeResource('match'), 
  incidentValidation, 
  addIncident
);

module.exports = router;