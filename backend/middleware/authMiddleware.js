const User = require('../models/User');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    // Find user by ID
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    if (!roles.includes(req.session.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Specific role middleware
const isAdmin = authorize('admin');
const isPlayer = authorize('player');
const isJudge = authorize('judge');
const isCoach = authorize('coach');
const isOrganizer = authorize('organizer');

module.exports = {
  auth,
  authorize,
  isAdmin,
  isPlayer,
  isJudge,
  isCoach,
  isOrganizer
};