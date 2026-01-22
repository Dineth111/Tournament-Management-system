const User = require('../models/User');
const { validationResult } = require('express-validator');

// Register user
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'player'
    });

    await user.save();

    // Store user info in session
    req.session.userId = user._id;
    req.session.userRole = user.role;
    
    // Log session data for debugging
    console.log('Session after registration:', {
      userId: req.session.userId,
      userRole: req.session.userRole
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Store user info in session
    req.session.userId = user._id;
    req.session.userRole = user.role;
    
    // Log session data for debugging
    console.log('Session after login:', {
      userId: req.session.userId,
      userRole: req.session.userRole
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not log out'
      });
    }
    
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  // Log session info for debugging
  console.log('GetCurrentUser called. Session info:', req.session);
  
  if (!req.session.userId) {
    console.log('No userId in session');
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  try {
    // Fetch full user information from database
    const user = await User.findById(req.session.userId);
    console.log('User found in database:', user);
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    console.log('Sending user data:', userData);

    res.json({
      success: true,
      data: {
        user: userData
      }
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data'
    });
  }
};

// Test route to check if API is working
exports.test = (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    session: req.session
  });
};

// Database test route
exports.dbTest = async (req, res) => {
  try {
    // Try to fetch all users
    const users = await User.find({});
    res.json({
      success: true,
      message: 'Database connection successful',
      userCount: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
};