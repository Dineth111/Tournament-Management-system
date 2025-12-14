const Notification = require('../models/Notification');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all notifications with pagination
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // For regular users, only show their notifications
    // For admin, show all notifications
    const filter = req.user.role === 'admin' 
      ? { } 
      : { recipient: req.user._id };

    const notifications = await Notification.find(filter)
      .populate('recipient', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(filter);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('recipient', 'name email');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user is authorized to view this notification
    if (req.user.role !== 'admin' && notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this notification'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Get notification by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notification'
    });
  }
};

// Create new notification
exports.createNotification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, message, recipient, type, relatedEntity, entityType } = req.body;

    // Check if recipient exists
    const existingUser = await User.findById(recipient);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found'
      });
    }

    const notification = new Notification({
      title,
      message,
      recipient,
      type,
      relatedEntity,
      entityType
    });

    const savedNotification = await notification.save();

    // Populate recipient details
    await savedNotification.populate('recipient', 'name email');

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: savedNotification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating notification'
    });
  }
};

// Update notification (mark as read)
exports.updateNotification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { isRead } = req.body;

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user is authorized to update this notification
    if (req.user.role !== 'admin' && notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }

    // Update fields
    if (isRead !== undefined) notification.isRead = isRead;

    const updatedNotification = await notification.save();

    // Populate recipient details
    await updatedNotification.populate('recipient', 'name email');

    res.json({
      success: true,
      message: 'Notification updated successfully',
      data: updatedNotification
    });
  } catch (error) {
    console.error('Update notification error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating notification'
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user is authorized to delete this notification
    if (req.user.role !== 'admin' && notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await notification.remove();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notification'
    });
  }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    // For regular users, only mark their notifications
    // For admin, mark all notifications
    const filter = req.user.role === 'admin' 
      ? { } 
      : { recipient: req.user._id };

    const result = await Notification.updateMany(filter, { isRead: true });

    res.json({
      success: true,
      message: `Marked ${result.nModified} notifications as read`,
      data: {
        modifiedCount: result.nModified
      }
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking notifications as read'
    });
  }
};