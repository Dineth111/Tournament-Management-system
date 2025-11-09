const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { promisify } = require('util');

// Helper function to get token from header
const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

// Verify JWT token
const verifyToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to access this route. Please log in.'
      });
    }

    try {
      // Verify token
      const decoded = await verifyToken(token);
      
      // Check if user still exists
      const currentUser = await User.findById(decoded.id).select('-password');
      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.'
        });
      }

      // Check if user is active
      if (!currentUser.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Grant access to protected route
      req.user = currentUser;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Invalid token.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// Grant access to multiple roles (OR condition)
exports.authorizeAny = (...roles) => {
  return (req, res, next) => {
    const hasRole = roles.some(role => req.user.role === role);
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this route'
      });
    }
    next();
  };
};

// Grant access to specific permissions (based on role and resource ownership)
exports.authorizeResource = (resourceType) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const resourceId = req.params.id;
      
      // Admin can access any resource
      if (user.role === 'admin') {
        return next();
      }
      
      // Check based on resource type
      switch (resourceType) {
        case 'tournament':
          const Tournament = require('../models/Tournament');
          const tournament = await Tournament.findById(resourceId);
          
          if (!tournament) {
            return res.status(404).json({
              success: false,
              message: 'Tournament not found'
            });
          }
          
          // Organizer can access their own tournaments
          if (user.role === 'organizer' && tournament.organizer.toString() !== user._id.toString()) {
            return res.status(403).json({
              success: false,
              message: 'You can only access your own tournaments'
            });
          }
          break;
          
        case 'user':
          // Users can only access their own profile
          if (user._id.toString() !== resourceId) {
            return res.status(403).json({
              success: false,
              message: 'You can only access your own profile'
            });
          }
          break;
          
        case 'match':
          const Match = require('../models/Match');
          const match = await Match.findById(resourceId);
          
          if (!match) {
            return res.status(404).json({
              success: false,
              message: 'Match not found'
            });
          }
          
          // Judges can access matches they are assigned to
          if (user.role === 'judge') {
            const isAssigned = match.judges.some(judge => 
              judge.judge.toString() === user._id.toString()
            );
            
            if (!isAssigned) {
              return res.status(403).json({
                success: false,
                message: 'You can only access matches you are assigned to'
              });
            }
          }
          
          // Players can access matches they are participating in
          if (user.role === 'player') {
            const isParticipant = match.participants.some(participant =>
              participant.player.toString() === user._id.toString()
            );
            
            if (!isParticipant) {
              return res.status(403).json({
                success: false,
                message: 'You can only access matches you are participating in'
              });
            }
          }
          break;
          
        case 'registration':
          const Registration = require('../models/Registration');
          const registration = await Registration.findById(resourceId);
          
          if (!registration) {
            return res.status(404).json({
              success: false,
              message: 'Registration not found'
            });
          }
          
          // Users can only access their own registrations
          if (registration.player.toString() !== user._id.toString()) {
            return res.status(403).json({
              success: false,
              message: 'You can only access your own registrations'
            });
          }
          break;
          
        default:
          return res.status(400).json({
            success: false,
            message: 'Unknown resource type'
          });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error during authorization',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

// Check if user can perform action on resource
exports.canPerformAction = (action, resourceType) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const resourceId = req.params.id;
      
      // Define role-based permissions
      const permissions = {
        admin: {
          tournament: ['create', 'read', 'update', 'delete'],
          user: ['create', 'read', 'update', 'delete'],
          match: ['create', 'read', 'update', 'delete'],
          registration: ['create', 'read', 'update', 'delete'],
          payment: ['create', 'read', 'update', 'delete']
        },
        organizer: {
          tournament: ['create', 'read', 'update'],
          user: ['read'],
          match: ['create', 'read', 'update'],
          registration: ['read', 'update'],
          payment: ['read']
        },
        judge: {
          tournament: ['read'],
          user: ['read'],
          match: ['read', 'update'],
          registration: ['read'],
          payment: ['read']
        },
        coach: {
          tournament: ['read'],
          user: ['read', 'update'],
          match: ['read'],
          registration: ['create', 'read', 'update'],
          payment: ['create', 'read']
        },
        player: {
          tournament: ['read'],
          user: ['read', 'update'],
          match: ['read'],
          registration: ['create', 'read', 'update'],
          payment: ['create', 'read']
        }
      };
      
      // Check if user role has permission for the action
      if (!permissions[user.role] || !permissions[user.role][resourceType]) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action'
        });
      }
      
      const rolePermissions = permissions[user.role][resourceType];
      if (!rolePermissions.includes(action)) {
        return res.status(403).json({
          success: false,
          message: `You do not have permission to ${action} this resource`
        });
      }
      
      // Additional resource-specific checks
      if (action === 'update' || action === 'delete') {
        switch (resourceType) {
          case 'tournament':
            const Tournament = require('../models/Tournament');
            const tournament = await Tournament.findById(resourceId);
            
            if (!tournament) {
              return res.status(404).json({
                success: false,
                message: 'Tournament not found'
              });
            }
            
            if (user.role === 'organizer' && tournament.organizer.toString() !== user._id.toString()) {
              return res.status(403).json({
                success: false,
                message: 'You can only modify your own tournaments'
              });
            }
            break;
            
          case 'user':
            // Users can only update their own profile
            if (user._id.toString() !== resourceId) {
              return res.status(403).json({
                success: false,
                message: 'You can only modify your own profile'
              });
            }
            break;
        }
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

// Optional authentication - doesn't fail if no token provided
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      // No token provided, continue without authentication
      return next();
    }

    try {
      // Verify token
      const decoded = await verifyToken(token);
      
      // Check if user still exists and is active
      const currentUser = await User.findById(decoded.id).select('-password');
      if (currentUser && currentUser.isActive) {
        req.user = currentUser;
      }
    } catch (error) {
      // Invalid token, continue without authentication
    }
    
    next();
  } catch (error) {
    next();
  }
};

// Rate limiting for authentication endpoints
exports.authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// API key authentication for service-to-service communication
exports.apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required'
    });
  }
  
  // In production, you would validate this against a database
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  
  next();
};