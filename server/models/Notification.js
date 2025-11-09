const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for system notifications
  },
  type: {
    type: String,
    enum: [
      'system',
      'tournament_announcement',
      'registration_confirmation',
      'registration_approval',
      'registration_rejection',
      'payment_confirmation',
      'payment_failure',
      'refund_processed',
      'match_scheduled',
      'match_reminder',
      'match_result',
      'match_live_update',
      'tournament_reminder',
      'document_request',
      'approval_request',
      'chat_message',
      'friend_request',
      'achievement_unlocked',
      'ranking_update',
      'tournament_winner',
      'disqualification',
      'injury_alert',
      'schedule_change',
      'venue_change',
      'cancellation'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  content: {
    // Additional structured content based on notification type
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament'
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match'
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    category: String,
    amount: Number,
    date: Date,
    location: String,
    opponent: String,
    score: Number,
    ranking: Number,
    achievement: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  channels: {
    email: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      error: String,
      attempts: {
        type: Number,
        default: 0
      }
    },
    push: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      token: String,
      error: String
    },
    sms: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      phoneNumber: String,
      error: String
    },
    inApp: {
      sent: {
        type: Boolean,
        default: true
      },
      read: {
        type: Boolean,
        default: false
      },
      readAt: Date
    }
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'delivered', 'read'],
    default: 'pending'
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  // User actions
  actions: [{
    type: {
      type: String,
      enum: ['view', 'dismiss', 'click', 'reply', 'forward']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: Object
  }],
  // Group notifications (for bulk operations)
  groupId: String,
  // Language and localization
  language: {
    type: String,
    default: 'en'
  },
  // Template information
  template: {
    id: String,
    version: String,
    variables: Object // Template variables used
  },
  // Delivery tracking
  delivery: {
    attempts: {
      type: Number,
      default: 0
    },
    lastAttempt: Date,
    nextRetry: Date,
    retryCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ 'content.tournamentId': 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for is expired
notificationSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Virtual for delivery status
notificationSchema.virtual('deliveryStatus').get(function() {
  if (this.status === 'read') return 'Read';
  if (this.status === 'delivered') return 'Delivered';
  if (this.status === 'sent') return 'Sent';
  if (this.status === 'failed') return 'Failed';
  return 'Pending';
});

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.channels.inApp.read = true;
  this.channels.inApp.readAt = new Date();
  this.status = 'read';
  
  return this.save();
};

// Method to mark as delivered
notificationSchema.methods.markAsDelivered = function(channel) {
  if (channel === 'email') {
    this.channels.email.sent = true;
    this.channels.email.sentAt = new Date();
  } else if (channel === 'push') {
    this.channels.push.sent = true;
    this.channels.push.sentAt = new Date();
  } else if (channel === 'sms') {
    this.channels.sms.sent = true;
    this.channels.sms.sentAt = new Date();
  }
  
  // Update overall status if at least one channel delivered
  if (!this.status || this.status === 'pending') {
    this.status = 'delivered';
  }
  
  return this.save();
};

// Method to mark as failed
notificationSchema.methods.markAsFailed = function(channel, error) {
  if (channel === 'email') {
    this.channels.email.error = error;
    this.channels.email.attempts += 1;
  } else if (channel === 'push') {
    this.channels.push.error = error;
  } else if (channel === 'sms') {
    this.channels.sms.error = error;
  }
  
  this.status = 'failed';
  this.delivery.retryCount += 1;
  this.delivery.lastAttempt = new Date();
  
  return this.save();
};

// Method to add action
notificationSchema.methods.addAction = function(actionType, metadata = {}) {
  this.actions.push({
    type: actionType,
    metadata: metadata,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to schedule for later
notificationSchema.methods.scheduleFor = function(date) {
  this.scheduledFor = date;
  this.status = 'pending';
  
  return this.save();
};

// Method to dismiss
notificationSchema.methods.dismiss = function() {
  this.status = 'delivered';
  this.addAction('dismiss');
  
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = function(notificationData) {
  const notification = new this(notificationData);
  
  // Set default channels based on type
  if (!notification.channels) {
    notification.channels = {
      inApp: { sent: true, read: false },
      email: { sent: false },
      push: { sent: false },
      sms: { sent: false }
    };
  }
  
  return notification.save();
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    'channels.inApp.read': false,
    status: { $in: ['sent', 'delivered'] }
  });
};

// Static method to get notifications by user
notificationSchema.statics.getByUser = function(userId, options = {}) {
  const query = { recipient: userId };
  
  if (options.unreadOnly) {
    query['channels.inApp.read'] = false;
  }
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.priority) {
    query.priority = options.priority;
  }
  
  return this.find(query)
    .populate('sender', 'firstName lastName avatar')
    .populate('content.tournamentId', 'name')
    .populate('content.matchId', 'round matchNumber')
    .sort({ createdAt: -1 })
    .limit(options.limit || 50);
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { 
      recipient: userId, 
      'channels.inApp.read': false,
      status: { $in: ['sent', 'delivered'] }
    },
    { 
      $set: { 
        'channels.inApp.read': true,
        'channels.inApp.readAt': new Date(),
        status: 'read'
      }
    }
  );
};

// Static method to delete old notifications
notificationSchema.statics.deleteOldNotifications = function(daysOld = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    createdAt: { $lt: cutoffDate },
    status: { $in: ['read', 'delivered'] },
    priority: { $ne: 'high' }
  });
};

// Static method to get scheduled notifications
notificationSchema.statics.getScheduledNotifications = function() {
  const now = new Date();
  return this.find({
    scheduledFor: { $lte: now },
    status: 'pending'
  }).populate('recipient', 'email phone preferences');
};

module.exports = mongoose.model('Notification', notificationSchema);