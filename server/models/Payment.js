const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  type: {
    type: String,
    enum: ['registration_fee', 'late_fee', 'processing_fee', 'refund', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'cash', 'check'],
    required: true
  },
  // Payment gateway details
  gateway: {
    provider: String,
    transactionId: String,
    paymentIntentId: String, // Stripe payment intent ID
    chargeId: String, // Stripe charge ID
    refundId: String, // Stripe refund ID
    customerId: String, // Stripe customer ID
    subscriptionId: String // For recurring payments
  },
  // Billing information
  billingDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    phone: String
  },
  // Payment breakdown
  breakdown: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    processingFee: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  // Refund information
  refund: {
    amount: {
      type: Number,
      default: 0
    },
    reason: String,
    refundDate: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refundMethod: String,
    refundTransactionId: String
  },
  // Payment metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    referralSource: String,
    couponCode: String,
    notes: String
  },
  // Invoice details
  invoice: {
    number: {
      type: String,
      unique: true
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    dueDate: Date,
    pdfUrl: String
  },
  // Payment attempts (for failed payments)
  attempts: [{
    attemptNumber: Number,
    status: String,
    errorMessage: String,
    gatewayResponse: Object,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // 3D Secure authentication
  authentication: {
    required: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    authenticationId: String,
    version: String
  },
  // Risk assessment
  risk: {
    level: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    score: Number,
    factors: [String],
    decision: {
      type: String,
      enum: ['approved', 'declined', 'review']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ tournament: 1, status: 1 });
paymentSchema.index({ 'gateway.transactionId': 1 });
paymentSchema.index({ 'invoice.number': 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// Virtual for payment age
paymentSchema.virtual('age').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is overdue
paymentSchema.virtual('isOverdue').get(function() {
  if (this.status !== 'pending' || !this.invoice.dueDate) return false;
  return new Date() > this.invoice.dueDate;
});

// Pre-save middleware to generate invoice number
paymentSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoice.number) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    this.invoice.number = `INV-${year}${month}${day}-${random}`;
  }
  
  next();
});

// Method to process payment
paymentSchema.methods.processPayment = function(gatewayResponse) {
  this.status = 'completed';
  this.gateway.transactionId = gatewayResponse.id;
  this.gateway.paymentIntentId = gatewayResponse.paymentIntent;
  this.gateway.chargeId = gatewayResponse.charge;
  
  this.attempts.push({
    attemptNumber: this.attempts.length + 1,
    status: 'completed',
    gatewayResponse: gatewayResponse,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to fail payment
paymentSchema.methods.failPayment = function(errorMessage, gatewayResponse = null) {
  this.status = 'failed';
  
  this.attempts.push({
    attemptNumber: this.attempts.length + 1,
    status: 'failed',
    errorMessage: errorMessage,
    gatewayResponse: gatewayResponse,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = function(amount, reason, processedBy, refundTransactionId) {
  this.status = 'refunded';
  this.refund.amount = amount;
  this.refund.reason = reason;
  this.refund.refundDate = new Date();
  this.refund.processedBy = processedBy;
  this.refund.refundTransactionId = refundTransactionId;
  
  return this.save();
};

// Method to cancel payment
paymentSchema.methods.cancelPayment = function(reason) {
  this.status = 'cancelled';
  this.metadata.notes = reason;
  
  return this.save();
};

// Method to add payment attempt
paymentSchema.methods.addAttempt = function(status, errorMessage = null, gatewayResponse = null) {
  this.attempts.push({
    attemptNumber: this.attempts.length + 1,
    status: status,
    errorMessage: errorMessage,
    gatewayResponse: gatewayResponse,
    timestamp: new Date()
  });
  
  return this.save();
};

// Static method to get payments by user
paymentSchema.statics.getByUser = function(userId, status = null) {
  const query = { user: userId };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('tournament', 'name dates venue')
    .populate('registration', 'categories')
    .sort({ createdAt: -1 });
};

// Static method to get payments by tournament
paymentSchema.statics.getByTournament = function(tournamentId, status = null) {
  const query = { tournament: tournamentId };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('user', 'firstName lastName email')
    .populate('registration', 'categories')
    .sort({ createdAt: -1 });
};

// Static method to get payment statistics
paymentSchema.statics.getStatistics = function(startDate = null, endDate = null) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = startDate;
    if (endDate) matchStage.createdAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        totalAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0]
          }
        },
        completedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        failedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        refundedPayments: {
          $sum: { $cond: [{ $in: ['$status', ['refunded', 'partially_refunded']] }, 1, 0] }
        },
        totalRefunded: {
          $sum: {
            $cond: [
              { $in: ['$status', ['refunded', 'partially_refunded']] },
              '$refund.amount',
              0
            ]
          }
        }
      }
    }
  ]);
};

// Static method to generate revenue report
paymentSchema.statics.generateRevenueReport = function(startDate, endDate, groupBy = 'day') {
  const groupByFormat = {
    day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
    month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
    year: { $dateToString: { format: '%Y', date: '$createdAt' } }
  };
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: groupByFormat[groupBy] || groupByFormat.day,
        revenue: { $sum: '$amount' },
        transactionCount: { $sum: 1 },
        averageTransaction: { $avg: '$amount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);