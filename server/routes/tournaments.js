const express = require('express');
const { body } = require('express-validator');
const {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
  addJudge,
  removeJudge,
  generateMatches,
  updateTournamentStatus
} = require('../controllers/tournamentController');
const { protect, authorize, authorizeResource } = require('../middleware/auth');

const router = express.Router();

// Validation rules for tournament creation and updates
const tournamentValidation = [
  body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Tournament name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('type')
    .isIn(['individual', 'team', 'mixed'])
    .withMessage('Tournament type must be individual, team, or mixed'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid tournament date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  body('venue')
    .isLength({ min: 3, max: 200 })
    .withMessage('Venue must be between 3 and 200 characters'),
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('registrationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid registration deadline'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 2 })
    .withMessage('Maximum participants must be at least 2'),
  body('entryFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Entry fee must be a positive number'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code'),
  body('categories.*.name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('categories.*.ageGroup.min')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('Minimum age must be between 0 and 120'),
  body('categories.*.ageGroup.max')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('Maximum age must be between 0 and 120'),
  body('categories.*.weightClass.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum weight must be a positive number'),
  body('categories.*.weightClass.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum weight must be a positive number'),
  body('categories.*.beltRequirements.*')
    .optional()
    .isIn(['white', 'yellow', 'orange', 'green', 'blue', 'purple', 'brown', 'black'])
    .withMessage('Invalid belt rank'),
  body('categories.*.gender')
    .optional()
    .isIn(['male', 'female', 'mixed'])
    .withMessage('Gender must be male, female, or mixed'),
  body('categories.*.maxParticipants')
    .optional()
    .isInt({ min: 2 })
    .withMessage('Category max participants must be at least 2'),
  body('categories.*.entryFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Category entry fee must be a positive number')
];

const judgeValidation = [
  body('judgeId')
    .isMongoId()
    .withMessage('Please provide a valid judge ID'),
  body('role')
    .optional()
    .isIn(['head', 'senior', 'judge', 'assistant'])
    .withMessage('Judge role must be head, senior, judge, or assistant')
];

const statusValidation = [
  body('status')
    .isIn(['upcoming', 'active', 'completed', 'cancelled'])
    .withMessage('Status must be upcoming, active, completed, or cancelled')
];

// Public routes
router.get('/', getTournaments);
router.get('/:id', getTournament);

// Protected routes - require authentication
router.use(protect);

// Tournament management routes (Organizer and Admin)
router.post('/', 
  authorize('organizer', 'admin'), 
  tournamentValidation, 
  createTournament
);

router.put('/:id', 
  authorize('organizer', 'admin'), 
  authorizeResource('tournament'), 
  tournamentValidation, 
  updateTournament
);

router.delete('/:id', 
  authorize('admin'), 
  deleteTournament
);

// Judge management routes
router.post('/:id/judges', 
  authorize('organizer', 'admin'), 
  authorizeResource('tournament'), 
  judgeValidation, 
  addJudge
);

router.delete('/:id/judges/:judgeId', 
  authorize('organizer', 'admin'), 
  authorizeResource('tournament'), 
  removeJudge
);

// Match generation route
router.post('/:id/generate-matches', 
  authorize('organizer', 'admin'), 
  authorizeResource('tournament'), 
  generateMatches
);

// Status update route
router.put('/:id/status', 
  authorize('organizer', 'admin'), 
  authorizeResource('tournament'), 
  statusValidation, 
  updateTournamentStatus
);

module.exports = router;