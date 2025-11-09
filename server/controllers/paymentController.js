const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Registration = require('../models/Registration');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create payment intent for registration
const createPaymentIntent = async (req, res) => {
  try {
    const { registrationId, amount, currency = 'usd' } = req.body;

    // Validate registration
    const registration = await Registration.findById(registrationId)
      .populate('tournamentId', 'name')
      .populate('playerId', 'firstName lastName email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      registrationId,
      status: { $in: ['succeeded', 'pending'] }
    });

    if (existingPayment) {
      return res.status(400).json({ 
        message: 'Payment already initiated for this registration',
        payment: existingPayment
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        registrationId: registrationId.toString(),
        playerId: registration.playerId._id.toString(),
        tournamentId: registration.tournamentId._id.toString(),
        userId: req.user.id
      },
      description: `Registration fee for ${registration.tournamentId.name}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record
    const payment = new Payment({
      registrationId,
      playerId: registration.playerId._id,
      tournamentId: registration.tournamentId._id,
      amount,
      currency: currency.toUpperCase(),
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
      paymentMethod: 'card',
      transactionId: uuidv4(),
      createdBy: req.user.id
    });

    await payment.save();

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      amount,
      currency: currency.toUpperCase(),
      status: payment.status
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

// Confirm payment after successful Stripe payment
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, registrationId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed successfully'
      });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { 
        stripePaymentIntentId: paymentIntentId,
        registrationId 
      },
      {
        status: 'succeeded',
        paymentMethod: paymentIntent.payment_method_types[0],
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntentId,
        metadata: {
          stripePaymentId: paymentIntent.id,
          charges: paymentIntent.charges.data
        }
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Update registration status to paid
    await Registration.findByIdAndUpdate(registrationId, {
      paymentStatus: 'paid',
      status: 'confirmed'
    });

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      payment: payment
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
};

// Get user's own payments
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ 
      playerId: req.user.id 
    })
      .populate('tournamentId', 'name startDate endDate')
      .populate('registrationId', 'status category weightDivision')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    console.error('Get my payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payments',
      error: error.message
    });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('tournamentId', 'name startDate endDate')
      .populate('registrationId', 'status category weightDivision')
      .populate('playerId', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user owns this payment or is admin/organizer
    if (payment.playerId._id.toString() !== req.user.id && 
        !['admin', 'organizer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Get payment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment',
      error: error.message
    });
  }
};

// Get all payments (admin/organizer only)
const getAllPayments = async (req, res) => {
  try {
    const {
      status,
      tournamentId,
      playerId,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Apply filters
    if (status) query.status = status;
    if (tournamentId) query.tournamentId = tournamentId;
    if (playerId) query.playerId = playerId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('tournamentId', 'name startDate endDate')
      .populate('registrationId', 'status category weightDivision')
      .populate('playerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      count: payments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      payments
    });

  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payments',
      error: error.message
    });
  }
};

// Process refund
const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason = 'Customer request' } = req.body;

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund payment that is not succeeded'
      });
    }

    // Calculate refund amount
    const refundAmount = amount || payment.amount;

    if (refundAmount > payment.amount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed original payment amount'
      });
    }

    // Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: 'requested_by_customer',
      metadata: {
        paymentId: payment._id.toString(),
        reason: reason,
        refundedBy: req.user.id
      }
    });

    // Update payment record
    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundReason = reason;
    payment.refundedAt = new Date();
    payment.refundTransactionId = refund.id;
    payment.refundMetadata = refund;

    await payment.save();

    // Update registration status
    await Registration.findByIdAndUpdate(payment.registrationId, {
      paymentStatus: 'refunded',
      status: 'cancelled'
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refundAmount,
        reason: reason,
        status: refund.status
      }
    });

  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
};

// Get payment statistics
const getPaymentStatistics = async (req, res) => {
  try {
    const { startDate, endDate, tournamentId } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }
    if (tournamentId) matchStage.tournamentId = tournamentId;

    const stats = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          succeededPayments: {
            $sum: { $cond: [{ $eq: ['$status', 'succeeded'] }, 1, 0] }
          },
          refundedPayments: {
            $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] }
          },
          totalRefunded: {
            $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, '$refundAmount', 0] }
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalPayments: 1,
          totalAmount: { $round: ['$totalAmount', 2] },
          succeededPayments: 1,
          refundedPayments: 1,
          totalRefunded: { $round: ['$totalRefunded', 2] },
          pendingPayments: 1,
          successRate: {
            $round: [
              { $multiply: [{ $divide: ['$succeededPayments', '$totalPayments'] }, 100] },
              2
            ]
          }
        }
      }
    ]);

    // Get payment method breakdown
    const paymentMethods = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          method: '$_id',
          count: 1,
          totalAmount: { $round: ['$totalAmount', 2] }
        }
      }
    ]);

    // Get daily payment trends (last 30 days)
    const dailyTrends = await Payment.aggregate([
      {
        $match: {
          ...matchStage,
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          payments: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $limit: 30
      }
    ]);

    res.json({
      success: true,
      statistics: stats[0] || {
        totalPayments: 0,
        totalAmount: 0,
        succeededPayments: 0,
        refundedPayments: 0,
        totalRefunded: 0,
        pendingPayments: 0,
        successRate: 0
      },
      paymentMethods,
      dailyTrends
    });

  } catch (error) {
    console.error('Get payment statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment statistics',
      error: error.message
    });
  }
};

// Download invoice
const downloadInvoice = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('tournamentId', 'name startDate endDate location')
      .populate('registrationId', 'status category weightDivision')
      .populate('playerId', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user owns this payment or is admin/organizer
    if (payment.playerId._id.toString() !== req.user.id && 
        !['admin', 'organizer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create PDF invoice
    const doc = new PDFDocument();
    const filename = `invoice_${payment.transactionId}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Invoice header
    doc.fontSize(20).text('KARATE TOURNAMENT PAYMENT INVOICE', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12);
    doc.text(`Invoice Number: ${payment.transactionId}`);
    doc.text(`Date: ${payment.createdAt.toLocaleDateString()}`);
    doc.text(`Payment ID: ${payment._id}`);
    doc.moveDown();

    // Tournament details
    doc.fontSize(14).text('Tournament Details:', { underline: true });
    doc.fontSize(12);
    doc.text(`Tournament: ${payment.tournamentId.name}`);
    doc.text(`Date: ${payment.tournamentId.startDate.toLocaleDateString()} - ${payment.tournamentId.endDate.toLocaleDateString()}`);
    doc.text(`Location: ${payment.tournamentId.location || 'TBD'}`);
    doc.moveDown();

    // Player details
    doc.fontSize(14).text('Player Details:', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${payment.playerId.firstName} ${payment.playerId.lastName}`);
    doc.text(`Email: ${payment.playerId.email}`);
    doc.text(`Category: ${payment.registrationId.category}`);
    doc.text(`Weight Division: ${payment.registrationId.weightDivision || 'N/A'}`);
    doc.moveDown();

    // Payment details
    doc.fontSize(14).text('Payment Details:', { underline: true });
    doc.fontSize(12);
    doc.text(`Amount: ${payment.amount} ${payment.currency}`);
    doc.text(`Payment Method: ${payment.paymentMethod}`);
    doc.text(`Status: ${payment.status.toUpperCase()}`);
    
    if (payment.paidAt) {
      doc.text(`Paid At: ${payment.paidAt.toLocaleDateString()}`);
    }

    if (payment.refundAmount) {
      doc.text(`Refund Amount: ${payment.refundAmount} ${payment.currency}`);
      doc.text(`Refund Reason: ${payment.refundReason}`);
    }

    doc.end();

  } catch (error) {
    console.error('Download invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate invoice',
      error: error.message
    });
  }
};

// Handle Stripe webhook
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      
      case 'payment_intent.requires_action':
        await handlePaymentIntentRequiresAction(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Handle successful payment intent
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        status: 'succeeded',
        paymentMethod: paymentIntent.payment_method_types[0],
        paidAt: new Date(),
        metadata: {
          stripePaymentId: paymentIntent.id,
          charges: paymentIntent.charges.data
        }
      },
      { new: true }
    );

    if (payment) {
      // Update registration status
      await Registration.findByIdAndUpdate(payment.registrationId, {
        paymentStatus: 'paid',
        status: 'confirmed'
      });

      // Send confirmation email (you can implement this later)
      console.log(`Payment succeeded for registration ${payment.registrationId}`);
    }
  } catch (error) {
    console.error('Handle payment intent succeeded error:', error);
  }
};

// Handle failed payment intent
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        status: 'failed',
        failureReason: paymentIntent.last_payment_error?.message,
        metadata: {
          lastPaymentError: paymentIntent.last_payment_error
        }
      },
      { new: true }
    );

    if (payment) {
      // Update registration status
      await Registration.findByIdAndUpdate(payment.registrationId, {
        paymentStatus: 'failed',
        status: 'pending'
      });

      console.log(`Payment failed for registration ${payment.registrationId}`);
    }
  } catch (error) {
    console.error('Handle payment intent failed error:', error);
  }
};

// Handle charge refunded
const handleChargeRefunded = async (charge) => {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: charge.payment_intent
    });

    if (payment) {
      payment.status = 'refunded';
      payment.refundAmount = charge.amount_refunded / 100; // Convert from cents
      payment.refundedAt = new Date();
      payment.refundTransactionId = charge.refunds.data[0]?.id;
      payment.refundMetadata = charge.refunds.data[0];

      await payment.save();

      // Update registration status
      await Registration.findByIdAndUpdate(payment.registrationId, {
        paymentStatus: 'refunded',
        status: 'cancelled'
      });

      console.log(`Payment refunded for registration ${payment.registrationId}`);
    }
  } catch (error) {
    console.error('Handle charge refunded error:', error);
  }
};

// Handle payment intent requires action
const handlePaymentIntentRequiresAction = async (paymentIntent) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        status: 'requires_action',
        nextAction: paymentIntent.next_action,
        metadata: {
          requiresAction: true
        }
      },
      { new: true }
    );

    if (payment) {
      console.log(`Payment requires action for registration ${payment.registrationId}`);
    }
  } catch (error) {
    console.error('Handle payment intent requires action error:', error);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getPaymentById,
  getAllPayments,
  processRefund,
  getPaymentStatistics,
  downloadInvoice,
  handleStripeWebhook
};
