import { Router } from 'express';
import { 
  createPaymentIntent, 
  confirmPayment, 
  getPaymentById, 
  getPaymentsByPlayer, 
  refundPayment, 
  generateInvoice 
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Create a payment intent
router.post('/create-payment-intent', authenticate, createPaymentIntent);

// Confirm payment
router.post('/confirm', authenticate, confirmPayment);

// Get payment by ID
router.get('/:id', authenticate, getPaymentById);

// Get payments by player
router.get('/player/:playerId', authenticate, getPaymentsByPlayer);

// Refund payment
router.post('/refund', authenticate, refundPayment);

// Generate invoice
router.get('/invoice/:paymentId', authenticate, generateInvoice);

export default router;