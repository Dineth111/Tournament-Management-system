const { body } = require('express-validator');

exports.createCategoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters'),
  
  body('ageGroup')
    .isIn(['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'U21', 'Senior'])
    .withMessage('Invalid age group'),
  
  body('gender')
    .isIn(['Male', 'Female', 'Mixed'])
    .withMessage('Invalid gender')
];

exports.updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters'),
  
  body('ageGroup')
    .optional()
    .isIn(['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'U21', 'Senior'])
    .withMessage('Invalid age group'),
  
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Mixed'])
    .withMessage('Invalid gender')
];