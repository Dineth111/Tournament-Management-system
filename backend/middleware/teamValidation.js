const { body } = require('express-validator');

exports.createTeamValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('coach')
    .isMongoId()
    .withMessage('Please provide a valid coach ID'),
  
  body('category')
    .isMongoId()
    .withMessage('Please provide a valid category ID')
];

exports.updateTeamValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('coach')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid coach ID'),
  
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid category ID')
];