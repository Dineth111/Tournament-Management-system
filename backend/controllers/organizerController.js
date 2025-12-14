const Organizer = require('../models/Organizer');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all organizers with pagination
exports.getOrganizers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const organizers = await Organizer.find({ isActive: true })
      .populate('user', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Organizer.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: organizers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get organizers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching organizers'
    });
  }
};

// Get organizer by ID
exports.getOrganizerById = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id)
      .populate('user', 'name email');

    if (!organizer || !organizer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      data: organizer
    });
  } catch (error) {
    console.error('Get organizer by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid organizer ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching organizer'
    });
  }
};

// Create new organizer
exports.createOrganizer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { user, organizationName, contactPerson, phone, address, website } = req.body;

    // Check if user exists and has organizer role
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (existingUser.role !== 'organizer') {
      return res.status(400).json({
        success: false,
        message: 'User must have organizer role'
      });
    }

    // Check if organizer profile already exists for this user
    const existingOrganizer = await Organizer.findOne({ user });
    if (existingOrganizer) {
      return res.status(400).json({
        success: false,
        message: 'Organizer profile already exists for this user'
      });
    }

    const organizer = new Organizer({
      user,
      organizationName,
      contactPerson,
      phone,
      address,
      website
    });

    const savedOrganizer = await organizer.save();

    // Populate user details
    await savedOrganizer.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Organizer created successfully',
      data: savedOrganizer
    });
  } catch (error) {
    console.error('Create organizer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating organizer'
    });
  }
};

// Update organizer
exports.updateOrganizer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { organizationName, contactPerson, phone, address, website, isActive } = req.body;

    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    // Update fields
    if (organizationName !== undefined) organizer.organizationName = organizationName;
    if (contactPerson !== undefined) organizer.contactPerson = contactPerson;
    if (phone !== undefined) organizer.phone = phone;
    if (address !== undefined) organizer.address = address;
    if (website !== undefined) organizer.website = website;
    if (isActive !== undefined) organizer.isActive = isActive;

    const updatedOrganizer = await organizer.save();

    // Populate user details
    await updatedOrganizer.populate('user', 'name email');

    res.json({
      success: true,
      message: 'Organizer updated successfully',
      data: updatedOrganizer
    });
  } catch (error) {
    console.error('Update organizer error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid organizer ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating organizer'
    });
  }
};

// Delete organizer (soft delete)
exports.deleteOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    organizer.isActive = false;
    await organizer.save();

    res.json({
      success: true,
      message: 'Organizer deleted successfully'
    });
  } catch (error) {
    console.error('Delete organizer error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid organizer ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting organizer'
    });
  }
};