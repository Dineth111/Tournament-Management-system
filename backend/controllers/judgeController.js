const Judge = require('../models/Judge');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all judges with pagination
exports.getJudges = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const judges = await Judge.find({ isActive: true })
      .populate('user', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Judge.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: judges,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get judges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching judges'
    });
  }
};

// Get judge by ID
exports.getJudgeById = async (req, res) => {
  try {
    const judge = await Judge.findById(req.params.id)
      .populate('user', 'name email');

    if (!judge || !judge.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Judge not found'
      });
    }

    res.json({
      success: true,
      data: judge
    });
  } catch (error) {
    console.error('Get judge by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid judge ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching judge'
    });
  }
};

// Create new judge
exports.createJudge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { user, specialization, experience, certifications } = req.body;

    // Check if user exists and has judge role
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (existingUser.role !== 'judge') {
      return res.status(400).json({
        success: false,
        message: 'User must have judge role'
      });
    }

    // Check if judge profile already exists for this user
    const existingJudge = await Judge.findOne({ user });
    if (existingJudge) {
      return res.status(400).json({
        success: false,
        message: 'Judge profile already exists for this user'
      });
    }

    const judge = new Judge({
      user,
      specialization,
      experience,
      certifications
    });

    const savedJudge = await judge.save();

    // Populate user details
    await savedJudge.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Judge created successfully',
      data: savedJudge
    });
  } catch (error) {
    console.error('Create judge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating judge'
    });
  }
};

// Update judge
exports.updateJudge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { specialization, experience, certifications, isActive } = req.body;

    const judge = await Judge.findById(req.params.id);
    if (!judge) {
      return res.status(404).json({
        success: false,
        message: 'Judge not found'
      });
    }

    // Update fields
    if (specialization !== undefined) judge.specialization = specialization;
    if (experience !== undefined) judge.experience = experience;
    if (certifications !== undefined) judge.certifications = certifications;
    if (isActive !== undefined) judge.isActive = isActive;

    const updatedJudge = await judge.save();

    // Populate user details
    await updatedJudge.populate('user', 'name email');

    res.json({
      success: true,
      message: 'Judge updated successfully',
      data: updatedJudge
    });
  } catch (error) {
    console.error('Update judge error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid judge ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating judge'
    });
  }
};

// Delete judge (soft delete)
exports.deleteJudge = async (req, res) => {
  try {
    const judge = await Judge.findById(req.params.id);
    if (!judge) {
      return res.status(404).json({
        success: false,
        message: 'Judge not found'
      });
    }

    judge.isActive = false;
    await judge.save();

    res.json({
      success: true,
      message: 'Judge deleted successfully'
    });
  } catch (error) {
    console.error('Delete judge error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid judge ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting judge'
    });
  }
};