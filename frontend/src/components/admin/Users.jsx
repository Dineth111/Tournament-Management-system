import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, 
  FaUser, FaUserShield, FaGavel, FaUserTie, FaUsersCog, FaCheck, FaTimes,
  FaEllipsisV, FaBan, FaSync
} from 'react-icons/fa';
import AddUserForm from './AddUserForm';
import EditUserForm from './EditUserForm';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  // State for modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Simulate API call with sample data
      const sampleUsers = [
        { _id: 1, name: 'John Admin', email: 'admin@example.com', role: 'admin', isActive: true, createdAt: '2025-01-15' },
        { _id: 2, name: 'Jane Player', email: 'player@example.com', role: 'player', isActive: true, createdAt: '2025-02-20' },
        { _id: 3, name: 'Bob Judge', email: 'judge@example.com', role: 'judge', isActive: true, createdAt: '2025-03-10' },
        { _id: 4, name: 'Alice Coach', email: 'coach@example.com', role: 'coach', isActive: false, createdAt: '2025-04-05' },
        { _id: 5, name: 'Charlie Organizer', email: 'organizer@example.com', role: 'organizer', isActive: true, createdAt: '2025-05-12' },
        { _id: 6, name: 'Diana Player', email: 'player2@example.com', role: 'player', isActive: true, createdAt: '2025-06-18' },
        { _id: 7, name: 'Eve Judge', email: 'judge2@example.com', role: 'judge', isActive: false, createdAt: '2025-07-22' },
        { _id: 8, name: 'Frank Coach', email: 'coach2@example.com', role: 'coach', isActive: true, createdAt: '2025-08-30' },
      ];
      
      // Apply filters
      let filteredUsers = sampleUsers;
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }
      
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
      }
      
      setUsers(filteredUsers);
      setTotalPages(2);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Simulate API call
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        setError('Failed to delete user');
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Simulate API call
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      // Simulate API call
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: !user.isActive } : user
      ));
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  // Handle add user
  const handleAddUser = () => {
    setCurrentUser(null);
    setShowAddModal(true);
  };

  // Handle save new user
  const handleSaveNewUser = (newUser) => {
    // Add the new user to the users list
    setUsers([...users, { ...newUser, _id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
    setShowAddModal(false);
  };

  // Handle update user
  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user => 
      user._id === updatedUser._id ? updatedUser : user
    ));
    setShowEditModal(false);
    setCurrentUser(null);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaUserShield className="text-red-500" />;
      case 'player': return <FaUserTie className="text-blue-500" />;
      case 'judge': return <FaGavel className="text-yellow-500" />;
      case 'coach': return <FaUsersCog className="text-green-500" />;
      case 'organizer': return <FaUsers className="text-purple-500" />;
      default: return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'player': return 'bg-blue-100 text-blue-800';
      case 'judge': return 'bg-yellow-100 text-yellow-800';
      case 'coach': return 'bg-green-100 text-green-800';
      case 'organizer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
          <p className="text-gray-400">Manage all users in the system</p>
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
                  placeholder="Search users..."
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
            <button 
              onClick={handleAddUser}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
            >
              <FaUserPlus className="mr-2" />
              Add New User
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="player">Player</option>
                  <option value="judge">Judge</option>
                  <option value="coach">Coach</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                  }}
                  className="w-full px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">User List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {users.length} users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{user.name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{user.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getRoleIcon(user.role)}
                        </div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                      {user.createdAt || 'N/A'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => toggleUserStatus(user._id)}
                          className={`p-2 rounded-lg ${user.isActive ? 'text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10' : 'text-green-400 hover:bg-green-400 hover:bg-opacity-10'} transition-colors duration-200`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <FaBan /> : <FaCheck />}
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
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

            {users.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaUsers className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No users found</h3>
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Add New User</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <AddUserForm 
                onSave={handleSaveNewUser}
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit User</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <EditUserForm 
                user={currentUser}
                onSave={handleUpdateUser}
                onCancel={() => setShowEditModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;