const { validationResult } = require('express-validator');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const Registration = require('../models/Registration');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// @desc    Get all users with pagination and filtering
// @route   GET /api/users
// @access  Private (Admin, Organizer)
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      isActive,
      beltRank,
      dojo,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (beltRank) {
      query.beltRank = beltRank;
    }
    
    if (dojo) {
      query.dojo = { $regex: dojo, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .populate('coachId', 'firstName lastName email')
      .populate('teamId', 'name dojo')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('coachId', 'firstName lastName email phone')
      .populate('teamId', 'name dojo coach members');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's tournament statistics
    const tournamentStats = await getUserTournamentStats(req.params.id);
    
    // Get user's recent matches
    const recentMatches = await Match.find({
      $or: [
        { 'participants.player': req.params.id },
        { 'judges.judge': req.params.id }
      ]
    })
      .populate('tournament', 'name date')
      .populate('participants.player', 'firstName lastName')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        user,
        tournamentStats,
        recentMatches
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (User can update own profile, Admin can update any)
exports.updateUser = async (req, res) => {
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

    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      dojo,
      beltRank,
      weight,
      height,
      experience,
      medicalInfo,
      coachId,
      teamId,
      avatar
    } = req.body;

    // Find user
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can update this profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    // Update user fields
    const updateFields = {};
    
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (phone !== undefined) updateFields.phone = phone;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateFields.gender = gender;
    if (address !== undefined) updateFields.address = address;
    if (emergencyContact !== undefined) updateFields.emergencyContact = emergencyContact;
    if (dojo !== undefined) updateFields.dojo = dojo;
    if (beltRank !== undefined) updateFields.beltRank = beltRank;
    if (weight !== undefined) updateFields.weight = weight;
    if (height !== undefined) updateFields.height = height;
    if (experience !== undefined) updateFields.experience = experience;
    if (medicalInfo !== undefined) updateFields.medicalInfo = medicalInfo;
    if (coachId !== undefined) updateFields.coachId = coachId;
    if (teamId !== undefined) updateFields.teamId = teamId;
    if (avatar !== undefined) updateFields.avatar = avatar;

    // Update user
    user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res) => {
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

    const { role } = req.body;

    // Find user
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update role
    user.role = role;
    await user.save();

    // Send notification email about role change
    try {
      await sendEmail({
        to: user.email,
        subject: 'Role Updated - AI Tournament Management System',
        template: 'role-update',
        context: {
          firstName: user.firstName,
          newRole: role,
          appName: 'AI Tournament Management System'
        }
      });
    } catch (emailError) {
      console.error('Role update email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Deactivate user (Admin only)
// @route   PUT /api/users/:id/deactivate
// @access  Private (Admin only)
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    user.deactivatedAt = Date.now();
    user.deactivatedBy = req.user._id;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Reactivate user (Admin only)
// @route   PUT /api/users/:id/reactivate
// @access  Private (Admin only)
exports.reactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = true;
    user.deactivatedAt = undefined;
    user.deactivatedBy = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User reactivated successfully'
    });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has any active registrations or tournaments
    const activeRegistrations = await Registration.countDocuments({
      player: req.params.id,
      status: 'approved'
    });

    if (activeRegistrations > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active tournament registrations'
      });
    }

    // Soft delete (set isActive to false and add deleted timestamp)
    user.isActive = false;
    user.deletedAt = Date.now();
    user.deletedBy = req.user._id;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let dashboardData = {};

    // Common data for all users
    const user = await User.findById(userId)
      .select('-password')
      .populate('coachId', 'firstName lastName email')
      .populate('teamId', 'name dojo');

    dashboardData.user = user;

    // Role-specific data
    switch (userRole) {
      case 'player':
        dashboardData = await getPlayerDashboard(userId, dashboardData);
        break;
      case 'judge':
        dashboardData = await getJudgeDashboard(userId, dashboardData);
        break;
      case 'coach':
        dashboardData = await getCoachDashboard(userId, dashboardData);
        break;
      case 'organizer':
        dashboardData = await getOrganizerDashboard(userId, dashboardData);
        break;
      case 'admin':
        dashboardData = await getAdminDashboard(dashboardData);
        break;
      default:
        break;
    }

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to get user tournament statistics
const getUserTournamentStats = async (userId) => {
  try {
    const stats = await Registration.aggregate([
      { $match: { player: userId } },
      {
        $group: {
          _id: null,
          totalTournaments: { $sum: 1 },
          approvedRegistrations: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          pendingRegistrations: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          totalSpent: { $sum: '$payment.amount' }
        }
      }
    ]);

    return stats.length > 0 ? stats[0] : {
      totalTournaments: 0,
      approvedRegistrations: 0,
      pendingRegistrations: 0,
      totalSpent: 0
    };
  } catch (error) {
    console.error('Get tournament stats error:', error);
    return {
      totalTournaments: 0,
      approvedRegistrations: 0,
      pendingRegistrations: 0,
      totalSpent: 0
    };
  }
};

// Dashboard data helpers for different roles
const getPlayerDashboard = async (userId, dashboardData) => {
  try {
    // Get upcoming matches
    const upcomingMatches = await Match.find({
      'participants.player': userId,
      status: 'scheduled'
    })
      .populate('tournament', 'name date venue')
      .populate('participants.player', 'firstName lastName')
      .sort('schedule.startTime')
      .limit(5);

    // Get tournament statistics
    const tournamentStats = await getUserTournamentStats(userId);

    // Get recent results
    const recentResults = await Match.find({
      'participants.player': userId,
      status: 'completed'
    })
      .populate('tournament', 'name date')
      .populate('participants.player', 'firstName lastName')
      .sort('-completedAt')
      .limit(5);

    return {
      ...dashboardData,
      upcomingMatches,
      recentResults,
      tournamentStats
    };
  } catch (error) {
    console.error('Get player dashboard error:', error);
    return dashboardData;
  }
};

const getJudgeDashboard = async (userId, dashboardData) => {
  try {
    // Get assigned matches
    const assignedMatches = await Match.find({
      'judges.judge': userId,
      status: 'scheduled'
    })
      .populate('tournament', 'name date venue')
      .populate('participants.player', 'firstName lastName')
      .sort('schedule.startTime')
      .limit(10);

    // Get recent judged matches
    const recentJudgedMatches = await Match.find({
      'judges.judge': userId,
      status: 'completed'
    })
      .populate('tournament', 'name date')
      .populate('participants.player', 'firstName lastName')
      .sort('-completedAt')
      .limit(5);

    return {
      ...dashboardData,
      assignedMatches,
      recentJudgedMatches
    };
  } catch (error) {
    console.error('Get judge dashboard error:', error);
    return dashboardData;
  }
};

const getCoachDashboard = async (userId, dashboardData) => {
  try {
    // Get team members
    const teamMembers = await User.find({
      coachId: userId,
      isActive: true
    })
      .select('firstName lastName beltRank weight experience')
      .sort('firstName');

    // Get upcoming matches for team members
    const upcomingTeamMatches = await Match.find({
      'participants.player': { $in: teamMembers.map(member => member._id) },
      status: 'scheduled'
    })
      .populate('tournament', 'name date venue')
      .populate('participants.player', 'firstName lastName')
      .sort('schedule.startTime')
      .limit(10);

    return {
      ...dashboardData,
      teamMembers,
      upcomingTeamMatches
    };
  } catch (error) {
    console.error('Get coach dashboard error:', error);
    return dashboardData;
  }
};

const getOrganizerDashboard = async (userId, dashboardData) => {
  try {
    // Get organizer's tournaments
    const tournaments = await Tournament.find({
      organizer: userId
    })
      .sort('-createdAt')
      .limit(10);

    // Get tournament statistics
    const tournamentStats = await Tournament.aggregate([
      { $match: { organizer: userId } },
      {
        $group: {
          _id: null,
          totalTournaments: { $sum: 1 },
          activeTournaments: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          upcomingTournaments: {
            $sum: { $cond: [{ $eq: ['$status', 'upcoming'] }, 1, 0] }
          },
          completedTournaments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    return {
      ...dashboardData,
      tournaments,
      tournamentStats: tournamentStats.length > 0 ? tournamentStats[0] : {
        totalTournaments: 0,
        activeTournaments: 0,
        upcomingTournaments: 0,
        completedTournaments: 0
      }
    };
  } catch (error) {
    console.error('Get organizer dashboard error:', error);
    return dashboardData;
  }
};

const getAdminDashboard = async (dashboardData) => {
  try {
    // Get system statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalTournaments = await Tournament.countDocuments();
    const activeTournaments = await Tournament.countDocuments({ status: 'active' });
    const totalRegistrations = await Registration.countDocuments();
    const totalRevenue = await Registration.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);

    // Get recent users
    const recentUsers = await User.find()
      .select('firstName lastName email role createdAt')
      .sort('-createdAt')
      .limit(10);

    // Get recent tournaments
    const recentTournaments = await Tournament.find()
      .select('name date status organizer')
      .populate('organizer', 'firstName lastName')
      .sort('-createdAt')
      .limit(10);

    return {
      ...dashboardData,
      systemStats: {
        totalUsers,
        activeUsers,
        totalTournaments,
        activeTournaments,
        totalRegistrations,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      },
      recentUsers,
      recentTournaments
    };
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    return dashboardData;
  }
};