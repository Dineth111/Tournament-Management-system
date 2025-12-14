const Tournament = require('../models/Tournament');
const { validationResult } = require('express-validator');

// Get all tournaments with pagination
exports.getTournaments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tournaments = await Tournament.find({ isActive: true })
      .populate('category', 'name')
      .populate('organizer', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Tournament.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: tournaments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tournaments'
    });
  }
};

// Get tournament by ID
exports.getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('category', 'name')
      .populate('organizer', 'name');

    if (!tournament || !tournament.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    res.json({
      success: true,
      data: tournament
    });
  } catch (error) {
    console.error('Get tournament by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tournament'
    });
  }
};

// Create new tournament
exports.createTournament = async (req, res) => {
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

    const { name, description, startDate, endDate, category, maxTeams, registrationFee } = req.body;

    // Create new tournament
    const tournament = new Tournament({
      name,
      description,
      startDate,
      endDate,
      category,
      organizer: req.user._id,
      maxTeams,
      registrationFee: registrationFee || 0
    });

    await tournament.save();

    // Populate references
    await tournament.populate('category', 'name');
    await tournament.populate('organizer', 'name');

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      data: tournament
    });
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating tournament'
    });
  }
};

// Update tournament
exports.updateTournament = async (req, res) => {
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

    const { name, description, startDate, endDate, category, maxTeams, registrationFee, status } = req.body;

    // Check if tournament exists
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament || !tournament.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Update tournament
    tournament.name = name || tournament.name;
    tournament.description = description || tournament.description;
    tournament.startDate = startDate || tournament.startDate;
    tournament.endDate = endDate || tournament.endDate;
    tournament.category = category || tournament.category;
    tournament.maxTeams = maxTeams || tournament.maxTeams;
    tournament.registrationFee = registrationFee !== undefined ? registrationFee : tournament.registrationFee;
    tournament.status = status || tournament.status;

    await tournament.save();

    // Populate references
    await tournament.populate('category', 'name');
    await tournament.populate('organizer', 'name');

    res.json({
      success: true,
      message: 'Tournament updated successfully',
      data: tournament
    });
  } catch (error) {
    console.error('Update tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating tournament'
    });
  }
};

// Delete tournament (soft delete)
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament || !tournament.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Soft delete
    tournament.isActive = false;
    await tournament.save();

    res.json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    console.error('Delete tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting tournament'
    });
  }
};