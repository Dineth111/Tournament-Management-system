const { body } = require('express-validator');

exports.createMatchValidation = [
  body('tournament')
    .isMongoId()
    .withMessage('Please provide a valid tournament ID'),
  
  body('team1')
    .isMongoId()
    .withMessage('Please provide a valid team1 ID'),
  
  body('team2')
    .isMongoId()
    .withMessage('Please provide a valid team2 ID'),
  
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date (YYYY-MM-DD)'),
  
  body('venue')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Venue must be between 2 and 100 characters')
];

exports.updateMatchValidation = [
  body('tournament')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid tournament ID'),
  
  body('team1')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid team1 ID'),
  
  body('team2')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid team2 ID'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date (YYYY-MM-DD)'),
  
  body('venue')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Venue must be between 2 and 100 characters'),
  
  body('status')
    .optional()
    .isIn(['Scheduled', 'Ongoing', 'Completed', 'Postponed', 'Cancelled'])
    .withMessage('Invalid status'),
  
  body('scoreTeam1')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Score must be a positive number'),
  
  body('scoreTeam2')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Score must be a positive number'),
  
  body('winner')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid winner ID'),
  
  body('judge')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid judge ID')
];