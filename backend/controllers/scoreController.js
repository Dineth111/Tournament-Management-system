const Score = require('../models/Score');
const { validationResult } = require('express-validator');

// Get all scores with pagination
exports.getScores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const scores = await Score.find({ isActive: true })
      .populate('match', 'team1 team2 date')
      .populate('player', 'name')
      .populate('team', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Score.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: scores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching scores'
    });
  }
};

// Get score by ID
exports.getScoreById = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id)
      .populate('match', 'team1 team2 date')
      .populate('player', 'name')
      .populate('team', 'name');

    if (!score || !score.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Score not found'
      });
    }

    res.json({
      success: true,
      data: score
    });
  } catch (error) {
    console.error('Get score by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid score ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching score'
    });
  }
};

// Create new score
exports.createScore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { match, player, team, value, category } = req.body;

    const score = new Score({
      match,
      player,
      team,
      value,
      category
    });

    const savedScore = await score.save();

    // Populate related entities
    await savedScore.populate('match', 'team1 team2 date');
    await savedScore.populate('player', 'name');
    await savedScore.populate('team', 'name');

    res.status(201).json({
      success: true,
      message: 'Score created successfully',
      data: savedScore
    });
  } catch (error) {
    console.error('Create score error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating score'
    });
  }
};

// Update score
exports.updateScore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { match, player, team, value, category, isActive } = req.body;

    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found'
      });
    }

    // Update fields
    if (match !== undefined) score.match = match;
    if (player !== undefined) score.player = player;
    if (team !== undefined) score.team = team;
    if (value !== undefined) score.value = value;
    if (category !== undefined) score.category = category;
    if (isActive !== undefined) score.isActive = isActive;

    const updatedScore = await score.save();

    // Populate related entities
    await updatedScore.populate('match', 'team1 team2 date');
    await updatedScore.populate('player', 'name');
    await updatedScore.populate('team', 'name');

    res.json({
      success: true,
      message: 'Score updated successfully',
      data: updatedScore
    });
  } catch (error) {
    console.error('Update score error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid score ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating score'
    });
  }
};

// Delete score (soft delete)
exports.deleteScore = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found'
      });
    }

    score.isActive = false;
    await score.save();

    res.json({
      success: true,
      message: 'Score deleted successfully'
    });
  } catch (error) {
    console.error('Delete score error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid score ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting score'
    });
  }
};