import { Request, Response } from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment';
import Player from '../models/Player';
import Tournament from '../models/Tournament';

// Initialize Stripe with your secret key
// In production, use process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-11-17.clover',
});

// Create a payment intent
export const createPaymentIntent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { playerId, tournamentId, amount, currency = 'USD' } = req.body;
    
    // Validate required parameters
    if (!playerId || !tournamentId || !amount) {
      return res.status(400).json({ message: 'Player ID, Tournament ID, and amount are required' });
    }
    
    // Verify player exists
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    // Verify tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amounts in cents
      currency: currency,
      metadata: {
        playerId: playerId.toString(),
        tournamentId: tournamentId.toString(),
      },
    });
    
    // Create a payment record in our database
    const payment = new Payment({
      playerId,
      tournamentId,
      amount,
      currency,
      status: 'pending',
      paymentMethod: 'card', // Default to card payment
      transactionId: paymentIntent.id,
      invoiceId: `INV-${Date.now()}`, // Generate a simple invoice ID
    });
    
    await payment.save();
    
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      message: 'Payment intent created successfully',
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
};

// Confirm payment
export const confirmPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { paymentId, paymentIntentId } = req.body;
    
    // Validate required parameters
    if (!paymentId || !paymentIntentId) {
      return res.status(400).json({ message: 'Payment ID and Payment Intent ID are required' });
    }
    
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Update our payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed',
        transactionId: paymentIntent.id,
      },
      { new: true }
    );
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }
    
    // If payment was successful, update tournament participant count
    if (paymentIntent.status === 'succeeded') {
      await Tournament.findByIdAndUpdate(
        payment.tournamentId,
        { $inc: { participants: 1 } }
      );
    }
    
    return res.status(200).json({
      message: 'Payment confirmed successfully',
      payment,
      status: paymentIntent.status,
    });
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    return res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('playerId', 'firstName lastName email')
      .populate('tournamentId', 'name registrationFee');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    return res.status(200).json(payment);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
};

// Get payments by player
export const getPaymentsByPlayer = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { playerId } = req.params;
    
    const payments = await Payment.find({ playerId })
      .populate('tournamentId', 'name')
      .sort({ createdAt: -1 });
    
    return res.status(200).json(payments);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

// Refund payment
export const refundPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { paymentId } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }
    
    // Find the payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if payment can be refunded
    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }
    
    // Create a refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.transactionId,
    });
    
    // Update our payment record
    payment.status = 'refunded';
    await payment.save();
    
    // Decrement tournament participant count
    await Tournament.findByIdAndUpdate(
      payment.tournamentId,
      { $inc: { participants: -1 } }
    );
    
    return res.status(200).json({
      message: 'Payment refunded successfully',
      refund,
      payment,
    });
  } catch (error: any) {
    console.error('Error refunding payment:', error);
    return res.status(500).json({ message: 'Error refunding payment', error: error.message });
  }
};

// Generate invoice
export const generateInvoice = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { paymentId } = req.params;
    
    // Find the payment
    const payment = await Payment.findById(paymentId)
      .populate('playerId', 'firstName lastName email')
      .populate('tournamentId', 'name registrationFee');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Generate a simple invoice object
    const invoice = {
      invoiceId: payment.invoiceId,
      date: payment.createdAt,
      dueDate: payment.createdAt,
      player: {
        name: `${(payment.playerId as any).firstName} ${(payment.playerId as any).lastName}`,
        email: (payment.playerId as any).email,
      },
      tournament: {
        name: (payment.tournamentId as any).name,
        fee: (payment.tournamentId as any).registrationFee,
      },
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      transactionId: payment.transactionId,
    };
    
    return res.status(200).json({
      message: 'Invoice generated successfully',
      invoice,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error generating invoice', error: error.message });
  }
};