const Team = require('../models/Team');
const { validationResult } = require('express-validator');

// Get all teams with pagination
exports.getTeams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const teams = await Team.find({ isActive: true })
      .populate('coach', 'name')
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Team.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching teams'
    });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('coach', 'name')
      .populate('category', 'name');

    if (!team || !team.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Get team by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team'
    });
  }
};

// Create new team
exports.createTeam = async (req, res) => {
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

    const { name, coach, category } = req.body;

    // Check if team already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Team already exists with this name'
      });
    }

    // Create new team
    const team = new Team({
      name,
      coach,
      category
    });

    await team.save();

    // Populate references
    await team.populate('coach', 'name');
    await team.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating team'
    });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
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

    const { name, coach, category } = req.body;

    // Check if team exists
    const team = await Team.findById(req.params.id);
    if (!team || !team.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== team.name) {
      const existingTeam = await Team.findOne({ name, _id: { $ne: team._id } });
      if (existingTeam) {
        return res.status(400).json({
          success: false,
          message: 'Team already exists with this name'
        });
      }
    }

    // Update team
    team.name = name || team.name;
    team.coach = coach || team.coach;
    team.category = category || team.category;

    await team.save();

    // Populate references
    await team.populate('coach', 'name');
    await team.populate('category', 'name');

    res.json({
      success: true,
      message: 'Team updated successfully',
      data: team
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating team'
    });
  }
};

// Delete team (soft delete)
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team || !team.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Soft delete
    team.isActive = false;
    await team.save();

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting team'
    });
  }
};