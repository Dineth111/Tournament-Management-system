import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUsersCog, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, 
  FaUsers, FaUser, FaCheckCircle, FaBan, FaCheck, FaStar, FaTimes
} from 'react-icons/fa';

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  // Add state for modal and form data
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCoach, setNewCoach] = useState({
    name: '',
    email: '',
    team: '',
    specialization: 'Kata'
  });
  const [currentCoach, setCurrentCoach] = useState(null);

  useEffect(() => {
    fetchCoaches();
  }, [currentPage]);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      // Simulate API call with sample data
      const sampleCoaches = [
        {
          _id: 1,
          user: { name: 'Coach Anderson', email: 'anderson@example.com' },
          team: { name: 'Dragon Warriors' },
          specialization: 'Kata',
          isActive: true,
          yearsOfExperience: 12,
          playersCoached: 24,
          rating: 4.8
        },
        {
          _id: 2,
          user: { name: 'Coach Martinez', email: 'martinez@example.com' },
          team: { name: 'Phoenix Fighters' },
          specialization: 'Kumite',
          isActive: true,
          yearsOfExperience: 15,
          playersCoached: 32,
          rating: 4.9
        },
        {
          _id: 3,
          user: { name: 'Coach Thompson', email: 'thompson@example.com' },
          team: { name: 'Tiger Masters' },
          specialization: 'All-Round',
          isActive: false,
          yearsOfExperience: 8,
          playersCoached: 18,
          rating: 4.5
        },
        {
          _id: 4,
          user: { name: 'Coach Lee', email: 'lee@example.com' },
          team: { name: 'Dragon Warriors' },
          specialization: 'Kata',
          isActive: true,
          yearsOfExperience: 10,
          playersCoached: 20,
          rating: 4.7
        },
        {
          _id: 5,
          user: { name: 'Coach Wilson', email: 'wilson@example.com' },
          team: { name: 'Phoenix Fighters' },
          specialization: 'Kumite',
          isActive: true,
          yearsOfExperience: 18,
          playersCoached: 28,
          rating: 4.8
        }
      ];
      
      // Apply filters
      let filteredCoaches = sampleCoaches;
      if (searchTerm) {
        filteredCoaches = filteredCoaches.filter(coach => 
          coach.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          coach.user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredCoaches = filteredCoaches.filter(coach => coach.isActive === isActive);
      }
      
      if (teamFilter !== 'all') {
        filteredCoaches = filteredCoaches.filter(coach => 
          coach.team.name.toLowerCase() === teamFilter.toLowerCase()
        );
      }
      
      setCoaches(filteredCoaches);
      setTotalPages(2);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch coaches');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coach?')) {
      try {
        // Simulate API call
        setCoaches(coaches.filter(coach => coach._id !== id));
      } catch (err) {
        setError('Failed to delete coach');
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

  const toggleCoachStatus = async (id) => {
    try {
      // Simulate API call
      setCoaches(coaches.map(coach => 
        coach._id === id ? { ...coach, isActive: !coach.isActive } : coach
      ));
    } catch (err) {
      setError('Failed to update coach status');
    }
  };

  // Handle input changes for new coach form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoach({
      ...newCoach,
      [name]: value
    });
  };

  // Handle form submission for adding new coach
  const handleAddCoach = (e) => {
    e.preventDefault();
    // Simulate API call
    const coachToAdd = {
      _id: coaches.length + 1,
      user: { name: newCoach.name, email: newCoach.email },
      team: { name: newCoach.team },
      specialization: newCoach.specialization,
      isActive: true,
      yearsOfExperience: 0,
      playersCoached: 0,
      rating: 0
    };
    setCoaches([...coaches, coachToAdd]);
    // Reset form and close modal
    setNewCoach({
      name: '',
      email: '',
      team: '',
      specialization: 'Kata'
    });
    setShowAddModal(false);
  };

  // Handle edit coach
  const handleEditCoach = (coach) => {
    setCurrentCoach(coach);
    // Initialize form with coach data
    setNewCoach({
      name: coach.user.name,
      email: coach.user.email,
      team: coach.team.name,
      specialization: coach.specialization
    });
    setShowEditModal(true);
  };

  // Handle update coach
  const handleUpdateCoach = (e) => {
    e.preventDefault();
    // Simulate API call
    const updatedCoaches = coaches.map(coach => 
      coach._id === currentCoach._id 
        ? {
            ...coach,
            user: { name: newCoach.name, email: newCoach.email },
            team: { name: newCoach.team },
            specialization: newCoach.specialization
          }
        : coach
    );
    setCoaches(updatedCoaches);
    // Reset form and close modal
    setNewCoach({
      name: '',
      email: '',
      team: '',
      specialization: 'Kata'
    });
    setCurrentCoach(null);
    setShowEditModal(false);
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getSpecializationColor = (specialization) => {
    switch (specialization.toLowerCase()) {
      case 'kata': return 'bg-blue-100 text-blue-800';
      case 'kumite': return 'bg-red-100 text-red-800';
      case 'all-round': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Coaches Management</h1>
          <p className="text-gray-400">Manage all coaches in the system</p>
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
                  placeholder="Search coaches..."
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
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
            >
              <FaPlus className="mr-2" />
              Add New Coach
            </button>
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Team</label>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Teams</option>
                  <option value="dragon warriors">Dragon Warriors</option>
                  <option value="phoenix fighters">Phoenix Fighters</option>
                  <option value="tiger masters">Tiger Masters</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTeamFilter('all');
                  }}
                  className="w-full px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Coaches Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Coach List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {coaches.length} coaches</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Coach
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Experience
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Performance
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
                {coaches.map((coach) => (
                  <tr key={coach._id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">
                            {coach.user?.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{coach.user?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{coach.user?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaUsers className="text-blue-500" />
                        </div>
                        <div className="text-sm text-white">{coach.team?.name || 'No Team'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaUser className="text-yellow-500" />
                        </div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSpecializationColor(coach.specialization)}`}>
                          {coach.specialization || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-white">{coach.yearsOfExperience || 0} years</div>
                      <div className="text-sm text-gray-400">{coach.playersCoached || 0} players</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaStar className="text-yellow-400" />
                        </div>
                        <div className="text-sm text-white">
                          {coach.rating || 'N/A'} <span className="text-gray-400">/ 5.0</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(coach.isActive)}`}>
                        {coach.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => toggleCoachStatus(coach._id)}
                          className={`p-2 rounded-lg ${coach.isActive ? 'text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10' : 'text-green-400 hover:bg-green-400 hover:bg-opacity-10'} transition-colors duration-200`}
                          title={coach.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {coach.isActive ? <FaBan /> : <FaCheck />}
                        </button>
                        <button 
                          onClick={() => handleEditCoach(coach)}
                          className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(coach._id)}
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

            {coaches.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaUsersCog className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No coaches found</h3>
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

      {/* Add Coach Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Add New Coach</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCoach}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCoach.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter coach name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newCoach.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter coach email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team</label>
                  <input
                    type="text"
                    name="team"
                    value={newCoach.team}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
                  <select
                    name="specialization"
                    value={newCoach.specialization}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  >
                    <option value="Kata">Kata</option>
                    <option value="Kumite">Kumite</option>
                    <option value="All-Round">All-Round</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-750 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Add Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coach Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit Coach</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentCoach(null);
                  setNewCoach({
                    name: '',
                    email: '',
                    team: '',
                    specialization: 'Kata'
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateCoach}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCoach.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter coach name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newCoach.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter coach email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team</label>
                  <input
                    type="text"
                    name="team"
                    value={newCoach.team}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
                  <select
                    name="specialization"
                    value={newCoach.specialization}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  >
                    <option value="Kata">Kata</option>
                    <option value="Kumite">Kumite</option>
                    <option value="All-Round">All-Round</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-750 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentCoach(null);
                    setNewCoach({
                      name: '',
                      email: '',
                      team: '',
                      specialization: 'Kata'
                    });
                  }}
                  className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Update Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coaches;