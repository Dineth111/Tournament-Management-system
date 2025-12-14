import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaBell, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, 
  FaCalendarAlt, FaUser, FaCheck, FaBan, FaInfoCircle, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaEnvelope, FaEye
} from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Simulate API call with sample data
      const sampleNotifications = [
        {
          _id: 1,
          title: 'Tournament Registration Open',
          message: 'Registration for Summer Championship 2025 is now open',
          recipient: { name: 'All Players', email: 'all@karate.org' },
          type: 'info',
          isRead: false,
          createdAt: '2025-06-01T09:00:00Z',
          priority: 'high'
        },
        {
          _id: 2,
          title: 'Match Schedule Updated',
          message: 'The match schedule for Winter League has been updated',
          recipient: { name: 'Tiger Masters', email: 'tiger@karate.org' },
          type: 'warning',
          isRead: true,
          createdAt: '2025-12-05T14:30:00Z',
          priority: 'medium'
        },
        {
          _id: 3,
          title: 'Payment Confirmation',
          message: 'Your payment for Beginner\'s Open has been confirmed',
          recipient: { name: 'John Smith', email: 'john@example.com' },
          type: 'success',
          isRead: false,
          createdAt: '2025-09-10T11:15:00Z',
          priority: 'low'
        },
        {
          _id: 4,
          title: 'Important Deadline',
          message: 'Registration deadline for Master\'s Cup is tomorrow',
          recipient: { name: 'All Coaches', email: 'coaches@karate.org' },
          type: 'error',
          isRead: true,
          createdAt: '2025-04-19T16:45:00Z',
          priority: 'high'
        },
        {
          _id: 5,
          title: 'New Tournament Announcement',
          message: 'Youth Tournament registration starts next week',
          recipient: { name: 'All Members', email: 'members@karate.org' },
          type: 'info',
          isRead: false,
          createdAt: '2025-08-01T10:20:00Z',
          priority: 'medium'
        }
      ];
      
      // Apply filters
      let filteredNotifications = sampleNotifications;
      if (searchTerm) {
        filteredNotifications = filteredNotifications.filter(notification => 
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        const isRead = statusFilter === 'read';
        filteredNotifications = filteredNotifications.filter(notification => notification.isRead === isRead);
      }
      
      if (typeFilter !== 'all') {
        filteredNotifications = filteredNotifications.filter(notification => 
          notification.type === typeFilter
        );
      }
      
      setNotifications(filteredNotifications);
      setTotalPages(2);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notifications');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        // Simulate API call
        setNotifications(notifications.filter(notification => notification._id !== id));
      } catch (err) {
        setError('Failed to delete notification');
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      // Simulate API call
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (window.confirm('Are you sure you want to mark all notifications as read?')) {
      try {
        // Simulate API call
        setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
      } catch (err) {
        setError('Failed to mark all notifications as read');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'info': return <FaInfoCircle className="text-blue-500" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'success': return <FaCheckCircle className="text-green-500" />;
      case 'error': return <FaTimesCircle className="text-red-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  const getStatusColor = (isRead) => {
    return isRead 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Notifications Management</h1>
          <p className="text-gray-400">Manage all notifications in the system</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center">
              <FaTimes className="mr-3 text-red-400" />
              {error}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaCheck className="mr-2" />
                Mark All Read
              </button>
              <button className="inline-flex items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105">
                <FaPlus className="mr-2" />
                Send Notification
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Types</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="w-full px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Notification List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {notifications.length} notifications</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Notification
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {notifications.map((notification) => (
                  <tr key={notification._id} className={`${!notification.isRead ? 'bg-gray-750' : ''} hover:bg-gray-750 transition-colors duration-200`}>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{notification.title || 'N/A'}</div>
                          <div className="text-sm text-gray-400 max-w-md truncate" title={notification.message || 'N/A'}>
                            {notification.message || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaUser className="text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm text-white">{notification.recipient?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{notification.recipient?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getTypeIcon(notification.type)}
                        </div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaCalendarAlt className="text-yellow-500" />
                        </div>
                        <div className="text-sm text-white">
                          {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(notification.isRead)}`}>
                        {notification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {!notification.isRead && (
                          <button 
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-2 rounded-lg text-green-400 hover:bg-green-400 hover:bg-opacity-10 transition-colors duration-200"
                            title="Mark as Read"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200">
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleDelete(notification._id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-400 hover:bg-opacity-10 transition-colors duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {notifications.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaBell className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No notifications found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-750 border-t border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;