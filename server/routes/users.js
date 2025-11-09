const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUser,
  updateUser,
  updateUserRole,
  deactivateUser,
  reactivateUser,
  deleteUser,
  getUserDashboard
} = require('../controllers/userController');
const { protect, authorize, authorizeResource, canPerformAction } = require('../middleware/auth');

const router = express.Router();

// Validation rules for updating user profile
const updateUserValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be one of: male, female, other'),
  body('beltRank')
    .optional()
    .isIn(['white', 'yellow', 'orange', 'green', 'blue', 'brown', 'black'])
    .withMessage('Belt rank must be one of: white, yellow, orange, green, blue, brown, black'),
  body('weight')
    .optional()
    .isFloat({ min: 20, max: 200 })
    .withMessage('Weight must be between 20 and 200 kg'),
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  body('coachId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid coach ID'),
  body('teamId')
    .optional()
    .isMongoId()
    .withMessage('Please provide a valid team ID')
];

// Validation rules for updating user role
const updateRoleValidation = [
  body('role')
    .isIn(['player', 'judge', 'coach', 'organizer', 'admin'])
    .withMessage('Role must be one of: player, judge, coach, organizer, admin')
];

// User dashboard route (accessible to all authenticated users)
router.get('/dashboard', protect, getUserDashboard);

// User management routes
router.route('/')
  .get(protect, authorize('admin', 'organizer'), getUsers); // Get all users (Admin and Organizer only)

router.route('/:id')
  .get(protect, authorizeResource('user'), getUser) // Get single user (User can view own profile, Admin can view any)
  .put(protect, authorizeResource('user'), updateUserValidation, updateUser) // Update user (User can update own profile, Admin can update any)
  .delete(protect, authorize('admin'), deleteUser); // Delete user (Admin only)

// Update user role (Admin only)
router.put('/:id/role', protect, authorize('admin'), updateRoleValidation, updateUserRole);

// Deactivate user (Admin only)
router.put('/:id/deactivate', protect, authorize('admin'), deactivateUser);

// Reactivate user (Admin only)
router.put('/:id/reactivate', protect, authorize('admin'), reactivateUser);

module.exports = router;