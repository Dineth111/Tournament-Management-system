const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    categoryId: {
      type: String,
      required: true
    },
    name: String,
    eventType: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'waitlisted'],
      default: 'pending'
    },
    approvalDate: Date,
    rejectionReason: String
  }],
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['stripe', 'paypal', 'bank_transfer', 'cash']
    },
    transactionId: String,
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paidAt: Date,
    refundAmount: {
      type: Number,
      default: 0
    },
    refundReason: String,
    refundDate: Date
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  waiver: {
    signed: {
      type: Boolean,
      default: false
    },
    signedAt: Date,
    ipAddress: String
  },
  medical: {
    isFit: {
      type: Boolean,
      default: true
    },
    medicalConditions: [String],
    allergies: [String],
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  team: {
    name: String,
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  accommodation: {
    required: {
      type: Boolean,
      default: false
    },
    preference: String,
    specialRequests: String
  },
  transportation: {
    required: {
      type: Boolean,
      default: false
    },
    arrivalDate: Date,
    departureDate: Date,
    flightNumber: String,
    pickupRequired: {
      type: Boolean,
      default: false
    }
  },
  notes: String,
  approvalHistory: [{
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      enum: ['approved', 'rejected', 'waitlisted']
    },
    reason: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // AI-generated insights
  aiInsights: {
    recommendedCategories: [String],
    successProbability: Number,
    riskFactors: [String],
    performancePrediction: Object
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
registrationSchema.index({ tournament: 1, player: 1 }, { unique: true });
registrationSchema.index({ status: 1 });
registrationSchema.index({ 'payment.status': 1 });
registrationSchema.index({ registrationDate: -1 });

// Virtual for total amount
registrationSchema.virtual('totalAmount').get(function() {
  return this.categories.reduce((total, category) => {
    return total + (category.entryFee || 0);
  }, 0);
});

// Virtual for approved categories count
registrationSchema.virtual('approvedCategoriesCount').get(function() {
  return this.categories.filter(cat => cat.status === 'approved').length;
});

// Virtual for pending categories count
registrationSchema.virtual('pendingCategoriesCount').get(function() {
  return this.categories.filter(cat => cat.status === 'pending').length;
});

// Pre-save middleware to validate categories
registrationSchema.pre('save', function(next) {
  if (this.categories.length === 0) {
    return next(new Error('At least one category must be selected'));
  }
  
  // Check for duplicate categories
  const categoryIds = this.categories.map(cat => cat.categoryId);
  const uniqueIds = new Set(categoryIds);
  if (categoryIds.length !== uniqueIds.size) {
    return next(new Error('Duplicate categories are not allowed'));
  }
  
  next();
});

// Method to approve registration
registrationSchema.methods.approve = function(approvedBy, approvedCategories = null) {
  this.status = 'approved';
  
  if (approvedCategories) {
    this.categories.forEach(category => {
      if (approvedCategories.includes(category.categoryId)) {
        category.status = 'approved';
        category.approvalDate = new Date();
      } else {
        category.status = 'rejected';
      }
    });
  } else {
    // Approve all categories
    this.categories.forEach(category => {
      category.status = 'approved';
      category.approvalDate = new Date();
    });
  }
  
  this.approvalHistory.push({
    approvedBy: approvedBy,
    action: 'approved',
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to reject registration
registrationSchema.methods.reject = function(rejectedBy, reason) {
  this.status = 'rejected';
  
  this.categories.forEach(category => {
    category.status = 'rejected';
    category.rejectionReason = reason;
  });
  
  this.approvalHistory.push({
    approvedBy: rejectedBy,
    action: 'rejected',
    reason: reason,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to process payment
registrationSchema.methods.processPayment = function(transactionId, amount, method) {
  this.payment.status = 'paid';
  this.payment.transactionId = transactionId;
  this.payment.amount = amount;
  this.payment.method = method;
  this.payment.paidAt = new Date();
  
  return this.save();
};

// Method to process refund
registrationSchema.methods.processRefund = function(amount, reason) {
  this.payment.status = 'refunded';
  this.payment.refundAmount = amount;
  this.payment.refundReason = reason;
  this.payment.refundDate = new Date();
  
  return this.save();
};

// Method to add document
registrationSchema.methods.addDocument = function(name, type, url) {
  this.documents.push({
    name: name,
    type: type,
    url: url
  });
  
  return this.save();
};

// Static method to get registrations by tournament
registrationSchema.statics.getByTournament = function(tournamentId, status = null) {
  const query = { tournament: tournamentId };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('player', 'firstName lastName email avatar playerProfile')
    .populate('approvalHistory.approvedBy', 'firstName lastName')
    .sort({ registrationDate: -1 });
};

// Static method to get registrations by player
registrationSchema.statics.getByPlayer = function(playerId) {
  return this.find({ player: playerId })
    .populate('tournament', 'name dates venue status')
    .sort({ registrationDate: -1 });
};

// Static method to get registration statistics
registrationSchema.statics.getStatistics = function(tournamentId) {
  return this.aggregate([
    { $match: { tournament: tournamentId } },
    {
      $group: {
        _id: null,
        totalRegistrations: { $sum: 1 },
        approvedRegistrations: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
        },
        pendingRegistrations: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        rejectedRegistrations: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
        },
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ['$payment.status', 'paid'] },
              '$payment.amount',
              0
            ]
          }
        }
      }
    }
  ]);
};

// Static method to check if player is registered for category
registrationSchema.statics.isPlayerRegisteredForCategory = function(playerId, tournamentId, categoryId) {
  return this.findOne({
    player: playerId,
    tournament: tournamentId,
    'categories.categoryId': categoryId,
    'categories.status': 'approved'
  });
};

module.exports = mongoose.model('Registration', registrationSchema);