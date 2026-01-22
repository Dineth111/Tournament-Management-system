const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { auth } = require('../middleware/authMiddleware');

// Register route
router.post('/register', registerValidation, authController.register);

// Login route
router.post('/login', loginValidation, authController.login);

// Logout route
router.post('/logout', authController.logout);

// Get current user
router.get('/me', auth, authController.getCurrentUser);

// Test route
router.get('/test', authController.test);

// Database test route
router.get('/db-test', authController.dbTest);

module.exports = router;