const { body } = require('express-validator');

exports.createJudgeValidation = [
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
    .withMessage('Experience must be less than 500 characters')
];

exports.updateJudgeValidation = [
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
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array')
];