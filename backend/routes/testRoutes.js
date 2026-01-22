const express = require('express');
const router = express.Router();
const { auth, isAdmin, isPlayer, isJudge, isCoach, isOrganizer } = require('../middleware/authMiddleware');

// Public route
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

// Protected route - any authenticated user
router.get('/protected', auth, (req, res) => {
  res.json({ 
    message: 'This is a protected route',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Admin only route
router.get('/admin', auth, isAdmin, (req, res) => {
  res.json({ 
    message: 'Admin only route',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Player only route
router.get('/player', auth, isPlayer, (req, res) => {
  res.json({ 
    message: 'Player only route',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Judge only route
router.get('/judge', auth, isJudge, (req, res) => {
  res.json({ 
    message: 'Judge only route',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Coach only route
router.get('/coach', auth, isCoach, (req, res) => {
  res.json({ 
    message: 'Coach only route',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Organizer only route
router.get('/organizer', auth, isOrganizer, (req, res) => {
  res.json({ 
    message: 'Organizer only route',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;