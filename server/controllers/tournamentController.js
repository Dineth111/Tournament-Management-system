const { validationResult } = require('express-validator');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const Match = require('../models/Match');
const Registration = require('../models/Registration');
const sendEmail = require('../utils/email');
const { generateMatches } = require('../ai/matchGenerator');

// @desc    Get all tournaments with pagination and filtering
// @route   GET /api/tournaments
// @access  Public
exports.getTournaments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      search,
      startDate,
      endDate,
      location,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const tournaments = await Tournament.find(query)
      .populate('organizer', 'firstName lastName email')
      .populate('judges.judge', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Tournament.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tournaments,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tournaments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single tournament by ID
// @route   GET /api/tournaments/:id
// @access  Public
exports.getTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('organizer', 'firstName lastName email phone')
      .populate('judges.judge', 'firstName lastName email phone')
      .populate('sponsors', 'name logo website')
      .populate('media', 'name type url');

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Get tournament statistics
    const stats = await getTournamentStats(req.params.id);
    
    // Get tournament matches
    const matches = await Match.find({ tournament: req.params.id })
      .populate('participants.player', 'firstName lastName beltRank')
      .populate('judges.judge', 'firstName lastName')
      .sort('schedule.startTime');

    // Get tournament registrations
    const registrations = await Registration.find({ tournament: req.params.id })
      .populate('player', 'firstName lastName email beltRank')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        tournament,
        stats,
        matches,
        registrations
      }
    });
  } catch (error) {
    console.error('Get tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tournament',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new tournament
// @route   POST /api/tournaments
// @access  Private (Organizer, Admin)
exports.createTournament = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Set organizer to current user
    req.body.organizer = req.user._id;

    // Create tournament
    const tournament = await Tournament.create(req.body);

    // Populate organizer data
    await tournament.populate('organizer', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      data: { tournament }
    });
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tournament',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @access  Private (Organizer can update own tournaments, Admin can update any)
exports.updateTournament = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Find tournament
    let tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user can update this tournament
    if (req.user.role !== 'admin' && tournament.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own tournaments'
      });
    }

    // Update tournament
    tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('organizer', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Tournament updated successfully',
      data: { tournament }
    });
  } catch (error) {
    console.error('Update tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tournament',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
// @access  Private (Admin only)
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if tournament has any registrations or matches
    const registrations = await Registration.countDocuments({ tournament: req.params.id });
    const matches = await Match.countDocuments({ tournament: req.params.id });

    if (registrations > 0 || matches > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tournament with existing registrations or matches'
      });
    }

    await tournament.remove();

    res.status(200).json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    console.error('Delete tournament error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tournament',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Add judge to tournament
// @route   POST /api/tournaments/:id/judges
// @access  Private (Organizer can update own tournaments, Admin can update any)
exports.addJudge = async (req, res) => {
  try {
    const { judgeId, role } = req.body;

    // Find tournament
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user can update this tournament
    if (req.user.role !== 'admin' && tournament.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own tournaments'
      });
    }

    // Check if judge exists and has judge role
    const judge = await User.findById(judgeId);
    if (!judge || judge.role !== 'judge') {
      return res.status(404).json({
        success: false,
        message: 'Judge not found or user is not a judge'
      });
    }

    // Check if judge is already added
    const existingJudge = tournament.judges.find(j => j.judge.toString() === judgeId);
    if (existingJudge) {
      return res.status(400).json({
        success: false,
        message: 'Judge is already added to this tournament'
      });
    }

    // Add judge to tournament
    tournament.judges.push({
      judge: judgeId,
      role: role || 'judge',
      assignedAt: Date.now()
    });

    await tournament.save();

    // Send notification to judge
    try {
      await sendEmail({
        to: judge.email,
        subject: `Assigned to Tournament - ${tournament.name}`,
        template: 'judge-assignment',
        context: {
          firstName: judge.firstName,
          tournamentName: tournament.name,
          tournamentDate: tournament.date,
          tournamentVenue: tournament.venue,
          role: role || 'judge',
          appName: 'AI Tournament Management System'
        }
      });
    } catch (emailError) {
      console.error('Judge notification email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Judge added successfully',
      data: { tournament }
    });
  } catch (error) {
    console.error('Add judge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add judge',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Remove judge from tournament
// @route   DELETE /api/tournaments/:id/judges/:judgeId
// @access  Private (Organizer can update own tournaments, Admin can update any)
exports.removeJudge = async (req, res) => {
  try {
    const { judgeId } = req.params;

    // Find tournament
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user can update this tournament
    if (req.user.role !== 'admin' && tournament.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own tournaments'
      });
    }

    // Remove judge from tournament
    tournament.judges = tournament.judges.filter(j => j.judge.toString() !== judgeId);

    await tournament.save();

    res.status(200).json({
      success: true,
      message: 'Judge removed successfully',
      data: { tournament }
    });
  } catch (error) {
    console.error('Remove judge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove judge',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate tournament matches using AI
// @route   POST /api/tournaments/:id/generate-matches
// @access  Private (Organizer can update own tournaments, Admin can update any)
exports.generateMatches = async (req, res) => {
  try {
    // Find tournament
    const tournament = await Tournament.findById(req.params.id)
      .populate('judges.judge', 'firstName lastName email');

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user can update this tournament
    if (req.user.role !== 'admin' && tournament.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own tournaments'
      });
    }

    // Check if tournament has enough registrations
    const registrations = await Registration.find({
      tournament: req.params.id,
      status: 'approved'
    }).populate('player', 'firstName lastName beltRank weight height experience');

    if (registrations.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Need at least 2 approved registrations to generate matches'
      });
    }

    // Generate matches using AI
    const generatedMatches = await generateMatches(tournament, registrations);

    // Save matches to database
    const savedMatches = await Match.insertMany(generatedMatches);

    // Update tournament status
    tournament.status = 'active';
    tournament.matchesGeneratedAt = Date.now();
    await tournament.save();

    // Send notifications to participants
    await sendMatchNotifications(registrations, tournament);

    res.status(200).json({
      success: true,
      message: 'Matches generated successfully',
      data: {
        matchesGenerated: savedMatches.length,
        matches: savedMatches
      }
    });
  } catch (error) {
    console.error('Generate matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate matches',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update tournament status
// @route   PUT /api/tournaments/:id/status
// @access  Private (Organizer can update own tournaments, Admin can update any)
exports.updateTournamentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Find tournament
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if user can update this tournament
    if (req.user.role !== 'admin' && tournament.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own tournaments'
      });
    }

    // Validate status transition
    const validTransitions = {
      upcoming: ['active', 'cancelled'],
      active: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[tournament.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${tournament.status} to ${status}`
      });
    }

    // Update status
    tournament.status = status;
    
    if (status === 'active') {
      tournament.startedAt = Date.now();
    } else if (status === 'completed') {
      tournament.completedAt = Date.now();
    } else if (status === 'cancelled') {
      tournament.cancelledAt = Date.now();
      tournament.cancelledBy = req.user._id;
    }

    await tournament.save();

    // Send status update notifications
    await sendStatusUpdateNotifications(tournament, status);

    res.status(200).json({
      success: true,
      message: 'Tournament status updated successfully',
      data: { tournament }
    });
  } catch (error) {
    console.error('Update tournament status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tournament status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
const getTournamentStats = async (tournamentId) => {
  try {
    const registrations = await Registration.countDocuments({ tournament: tournamentId });
    const approvedRegistrations = await Registration.countDocuments({ 
      tournament: tournamentId, 
      status: 'approved' 
    });
    const matches = await Match.countDocuments({ tournament: tournamentId });
    const completedMatches = await Match.countDocuments({ 
      tournament: tournamentId, 
      status: 'completed' 
    });

    return {
      totalRegistrations: registrations,
      approvedRegistrations,
      totalMatches: matches,
      completedMatches,
      completionRate: matches > 0 ? (completedMatches / matches * 100).toFixed(2) : 0
    };
  } catch (error) {
    console.error('Get tournament stats error:', error);
    return {
      totalRegistrations: 0,
      approvedRegistrations: 0,
      totalMatches: 0,
      completedMatches: 0,
      completionRate: 0
    };
  }
};

const sendMatchNotifications = async (registrations, tournament) => {
  try {
    for (const registration of registrations) {
      await sendEmail({
        to: registration.player.email,
        subject: `Matches Generated - ${tournament.name}`,
        template: 'matches-generated',
        context: {
          firstName: registration.player.firstName,
          tournamentName: tournament.name,
          tournamentDate: tournament.date,
          tournamentVenue: tournament.venue,
          appName: 'AI Tournament Management System'
        }
      });
    }
  } catch (error) {
    console.error('Send match notifications error:', error);
  }
};

const sendStatusUpdateNotifications = async (tournament, newStatus) => {
  try {
    // Get all registered users
    const registrations = await Registration.find({ tournament: tournament._id })
      .populate('player', 'firstName lastName email');

    for (const registration of registrations) {
      await sendEmail({
        to: registration.player.email,
        subject: `Tournament Status Update - ${tournament.name}`,
        template: 'tournament-status-update',
        context: {
          firstName: registration.player.firstName,
          tournamentName: tournament.name,
          newStatus: newStatus,
          appName: 'AI Tournament Management System'
        }
      });
    }
  } catch (error) {
    console.error('Send status update notifications error:', error);
  }
};