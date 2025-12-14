const { body } = require('express-validator');

exports.createPlayerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)'),
  
  body('team')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid team ID'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Position must be less than 30 characters'),
  
  body('jerseyNumber')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Jersey number must be between 1 and 99')
];

exports.updatePlayerValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth (YYYY-MM-DD)'),
  
  body('team')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid team ID'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Position must be less than 30 characters'),
  
  body('jerseyNumber')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Jersey number must be between 1 and 99')
];