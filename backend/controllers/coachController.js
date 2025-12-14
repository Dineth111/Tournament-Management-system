const Coach = require('../models/Coach');
const User = require('../models/User');
const Team = require('../models/Team');
const { validationResult } = require('express-validator');

// Get all coaches with pagination
exports.getCoaches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const coaches = await Coach.find({ isActive: true })
      .populate('user', 'name email')
      .populate('team', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Coach.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: coaches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get coaches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coaches'
    });
  }
};

// Get coach by ID
exports.getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id)
      .populate('user', 'name email')
      .populate('team', 'name');

    if (!coach || !coach.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.json({
      success: true,
      data: coach
    });
  } catch (error) {
    console.error('Get coach by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid coach ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coach'
    });
  }
};

// Create new coach
exports.createCoach = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { user, specialization, experience, certifications, team } = req.body;

    // Check if user exists and has coach role
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (existingUser.role !== 'coach') {
      return res.status(400).json({
        success: false,
        message: 'User must have coach role'
      });
    }

    // Check if coach profile already exists for this user
    const existingCoach = await Coach.findOne({ user });
    if (existingCoach) {
      return res.status(400).json({
        success: false,
        message: 'Coach profile already exists for this user'
      });
    }

    // If team is provided, check if it exists
    if (team) {
      const existingTeam = await Team.findById(team);
      if (!existingTeam) {
        return res.status(404).json({
          success: false,
          message: 'Team not found'
        });
      }
    }

    const coach = new Coach({
      user,
      specialization,
      experience,
      certifications,
      team
    });

    const savedCoach = await coach.save();

    // Populate user and team details
    await savedCoach.populate('user', 'name email');
    await savedCoach.populate('team', 'name');

    res.status(201).json({
      success: true,
      message: 'Coach created successfully',
      data: savedCoach
    });
  } catch (error) {
    console.error('Create coach error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating coach'
    });
  }
};

// Update coach
exports.updateCoach = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { specialization, experience, certifications, team, isActive } = req.body;

    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // If team is provided, check if it exists
    if (team) {
      const existingTeam = await Team.findById(team);
      if (!existingTeam) {
        return res.status(404).json({
          success: false,
          message: 'Team not found'
        });
      }
      coach.team = team;
    }

    // Update fields
    if (specialization !== undefined) coach.specialization = specialization;
    if (experience !== undefined) coach.experience = experience;
    if (certifications !== undefined) coach.certifications = certifications;
    if (isActive !== undefined) coach.isActive = isActive;

    const updatedCoach = await coach.save();

    // Populate user and team details
    await updatedCoach.populate('user', 'name email');
    await updatedCoach.populate('team', 'name');

    res.json({
      success: true,
      message: 'Coach updated successfully',
      data: updatedCoach
    });
  } catch (error) {
    console.error('Update coach error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid coach ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating coach'
    });
  }
};

// Delete coach (soft delete)
exports.deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    coach.isActive = false;
    await coach.save();

    res.json({
      success: true,
      message: 'Coach deleted successfully'
    });
  } catch (error) {
    console.error('Delete coach error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid coach ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting coach'
    });
  }
};