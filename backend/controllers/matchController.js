const Match = require('../models/Match');
const { validationResult } = require('express-validator');

// Get all matches with pagination
exports.getMatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matches = await Match.find({ isActive: true })
      .populate('tournament', 'name')
      .populate('team1', 'name')
      .populate('team2', 'name')
      .populate('judge', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 });

    const total = await Match.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: matches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching matches'
    });
  }
};

// Get match by ID
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('tournament', 'name')
      .populate('team1', 'name')
      .populate('team2', 'name')
      .populate('judge', 'name');

    if (!match || !match.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Get match by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching match'
    });
  }
};

// Create new match
exports.createMatch = async (req, res) => {
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

    const { tournament, team1, team2, date, venue } = req.body;

    // Check if teams are different
    if (team1 === team2) {
      return res.status(400).json({
        success: false,
        message: 'Team1 and Team2 must be different'
      });
    }

    // Create new match
    const match = new Match({
      tournament,
      team1,
      team2,
      date,
      venue
    });

    await match.save();

    // Populate references
    await match.populate('tournament', 'name');
    await match.populate('team1', 'name');
    await match.populate('team2', 'name');

    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      data: match
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating match'
    });
  }
};

// Update match
exports.updateMatch = async (req, res) => {
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

    const { tournament, team1, team2, date, venue, status, scoreTeam1, scoreTeam2, winner, judge } = req.body;

    // Check if match exists
    const match = await Match.findById(req.params.id);
    if (!match || !match.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Check if teams are different
    if (team1 && team2 && team1 === team2) {
      return res.status(400).json({
        success: false,
        message: 'Team1 and Team2 must be different'
      });
    }

    // Update match
    match.tournament = tournament || match.tournament;
    match.team1 = team1 || match.team1;
    match.team2 = team2 || match.team2;
    match.date = date || match.date;
    match.venue = venue || match.venue;
    match.status = status || match.status;
    match.scoreTeam1 = scoreTeam1 !== undefined ? scoreTeam1 : match.scoreTeam1;
    match.scoreTeam2 = scoreTeam2 !== undefined ? scoreTeam2 : match.scoreTeam2;
    match.winner = winner || match.winner;
    match.judge = judge || match.judge;

    await match.save();

    // Populate references
    await match.populate('tournament', 'name');
    await match.populate('team1', 'name');
    await match.populate('team2', 'name');
    await match.populate('judge', 'name');

    res.json({
      success: true,
      message: 'Match updated successfully',
      data: match
    });
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating match'
    });
  }
};

// Delete match (soft delete)
exports.deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match || !match.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Soft delete
    match.isActive = false;
    await match.save();

    res.json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting match'
    });
  }
};