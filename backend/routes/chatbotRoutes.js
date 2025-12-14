const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { auth } = require('../middleware/authMiddleware');

// Public: allow guests to ask questions
router.post('/message', chatbotController.sendMessage);

// Authenticated: fetch chat history for the logged-in user
router.get('/history', auth, chatbotController.getHistory);

module.exports = router;