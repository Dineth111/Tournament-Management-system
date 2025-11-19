import { Router } from 'express';
import { 
  getUserNotifications, 
  markAsRead, 
  markAllAsRead, 
  createNotification, 
  deleteNotification, 
  getUnreadCount 
} from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get notifications for a user
router.get('/user/:userId', authenticate, getUserNotifications);

// Mark notification as read
router.put('/read/:notificationId', authenticate, markAsRead);

// Mark all notifications as read
router.put('/read-all/:userId', authenticate, markAllAsRead);

// Create a new notification
router.post('/', authenticate, createNotification);

// Delete notification
router.delete('/:notificationId', authenticate, deleteNotification);

// Get unread notification count
router.get('/unread-count/:userId', authenticate, getUnreadCount);

export default router;