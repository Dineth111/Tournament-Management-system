const { body } = require('express-validator');

exports.createCoachValidation = [
  body('user')
    .isMongoId()
    .withMessage('Please provide a valid user ID'),
  body('specialization')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Specialization must be less than 100 characters'),
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Experience must be less than 500 characters'),
  body('team')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid team ID')
];

exports.updateCoachValidation = [
  body('specialization')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Specialization must be less than 100 characters'),
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Experience must be less than 500 characters'),
  body('team')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid team ID'),
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array')
];