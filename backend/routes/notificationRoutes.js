const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { createNotificationValidation, updateNotificationValidation } = require('../middleware/notificationValidation');
const { auth, authorize } = require('../middleware/authMiddleware');

// All notification routes require authentication
router.use(auth);

// Get all notifications (admin and users can access their own)
router.get('/', notificationController.getNotifications);

// Get notification by ID (admin and users can access their own)
router.get('/:id', notificationController.getNotificationById);

// Create new notification (admin can create)
router.post('/', authorize('admin'), createNotificationValidation, notificationController.createNotification);

// Update notification (admin and users can update their own - mark as read)
router.put('/:id', updateNotificationValidation, notificationController.updateNotification);

// Delete notification (admin and users can delete their own)
router.delete('/:id', notificationController.deleteNotification);

// Mark all notifications as read (admin and users can mark their own)
router.put('/mark-all-read', notificationController.markAllAsRead);

module.exports = router;