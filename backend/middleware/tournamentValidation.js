const { body } = require('express-validator');

exports.createTournamentValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date (YYYY-MM-DD)'),
  
  body('endDate')
    .isISO8601()
    .withMessage('Please provide a valid end date (YYYY-MM-DD)'),
  
  body('category')
    .isMongoId()
    .withMessage('Please provide a valid category ID'),
  
  body('maxTeams')
    .isInt({ min: 2, max: 100 })
    .withMessage('Maximum teams must be between 2 and 100'),
  
  body('registrationFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Registration fee must be a positive number')
];

exports.updateTournamentValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid start date (YYYY-MM-DD)'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date (YYYY-MM-DD)'),
  
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid category ID'),
  
  body('maxTeams')
    .optional()
    .isInt({ min: 2, max: 100 })
    .withMessage('Maximum teams must be between 2 and 100'),
  
  body('registrationFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Registration fee must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['Upcoming', 'Ongoing', 'Completed', 'Cancelled'])
    .withMessage('Invalid status')
];