import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationIcon() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuthStore();

  // In a real implementation, this would fetch from the backend
  // For now, we'll use mock data
  useEffect(() => {
    if (user) {
      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          _id: '1',
          title: 'Tournament Registration',
          message: 'You have been registered for the upcoming Karate Championship',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          title: 'Match Schedule',
          message: 'Your match schedule has been updated',
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          _id: '3',
          title: 'Payment Confirmation',
          message: 'Your tournament registration payment has been confirmed',
          read: false,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n._id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => prev - 1);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-white hover:bg-white/20 rounded-full transition duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification._id)}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="p-2 text-center border-t border-gray-200">
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}