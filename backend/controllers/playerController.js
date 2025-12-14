const Player = require('../models/Player');
const { validationResult } = require('express-validator');

// Get all players with pagination
exports.getPlayers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const players = await Player.find({ isActive: true })
      .populate('team', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Player.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: players,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get players error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching players'
    });
  }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('team', 'name');

    if (!player || !player.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Get player by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching player'
    });
  }
};

// Create new player
exports.createPlayer = async (req, res) => {
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

    const { name, email, phone, dateOfBirth, team, position, jerseyNumber } = req.body;

    // Check if player already exists
    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: 'Player already exists with this email'
      });
    }

    // Create new player
    const player = new Player({
      name,
      email,
      phone,
      dateOfBirth,
      team: team || null,
      position: position || null,
      jerseyNumber: jerseyNumber || null
    });

    await player.save();

    // Try to populate team reference, but don't fail if it doesn't exist
    try {
      await player.populate('team', 'name');
    } catch (populateError) {
      console.log('Could not populate team:', populateError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      data: player
    });
  } catch (error) {
    console.error('Create player error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating player'
    });
  }
};

// Update player
exports.updatePlayer = async (req, res) => {
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

    const { name, email, phone, dateOfBirth, team, position, jerseyNumber } = req.body;

    // Check if player exists
    const player = await Player.findById(req.params.id);
    if (!player || !player.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== player.email) {
      const existingPlayer = await Player.findOne({ email, _id: { $ne: player._id } });
      if (existingPlayer) {
        return res.status(400).json({
          success: false,
          message: 'Player already exists with this email'
        });
      }
    }

    // Update player
    player.name = name || player.name;
    player.email = email || player.email;
    player.phone = phone || player.phone;
    player.dateOfBirth = dateOfBirth || player.dateOfBirth;
    player.team = team || player.team;
    player.position = position || player.position;
    player.jerseyNumber = jerseyNumber || player.jerseyNumber;

    await player.save();

    // Try to populate team reference, but don't fail if it doesn't exist
    try {
      await player.populate('team', 'name');
    } catch (populateError) {
      console.log('Could not populate team:', populateError.message);
    }

    res.json({
      success: true,
      message: 'Player updated successfully',
      data: player
    });
  } catch (error) {
    console.error('Update player error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating player'
    });
  }
};

// Delete player (soft delete)
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player || !player.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    // Soft delete
    player.isActive = false;
    await player.save();

    res.json({
      success: true,
      message: 'Player deleted successfully'
    });
  } catch (error) {
    console.error('Delete player error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting player'
    });
  }
};