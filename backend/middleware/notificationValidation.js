const { body } = require('express-validator');

exports.createNotificationValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message is required and must be less than 500 characters'),
  body('recipient')
    .isMongoId()
    .withMessage('Please provide a valid recipient ID'),
  body('type')
    .optional()
    .isIn(['info', 'warning', 'success', 'error'])
    .withMessage('Invalid notification type'),
  body('relatedEntity')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid related entity ID'),
  body('entityType')
    .optional()
    .isIn(['tournament', 'match', 'team', 'player', 'payment'])
    .withMessage('Invalid entity type')
];

exports.updateNotificationValidation = [
  body('isRead')
    .optional()
    .isBoolean()
    .withMessage('isRead must be a boolean value')
];