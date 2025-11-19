import { Request, Response } from 'express';
import Notification from '../models/Notification';

// Get notifications for a user
export const getUserNotifications = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const { limit = 20, unreadOnly = false } = req.query;
    
    // Build query
    const query: any = { userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }
    
    // Fetch notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    
    return res.status(200).json(notifications);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    return res.status(200).json(notification);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating notifications', error: error.message });
  }
};

// Create a new notification
export const createNotification = async (req: Request, res: Response): Promise<Response> => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    
    // Emit real-time notification via Socket.IO
    // This would be implemented in the server file where io is available
    // For now, we'll just return the notification
    return res.status(201).json(notification);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating notification', error: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};

// Get unread notification count
export const getUnreadCount = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    
    const count = await Notification.countDocuments({ userId, read: false });
    
    return res.status(200).json({ count });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching notification count', error: error.message });
  }
};