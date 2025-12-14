import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaGavel, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, 
  FaUser, FaStar, FaCheckCircle, FaBan, FaCheck, FaTrophy, FaTimes
} from 'react-icons/fa';

const Judges = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  // Add state for modal and form data
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newJudge, setNewJudge] = useState({
    name: '',
    email: '',
    specialization: 'Kata',
    experience: ''
  });
  const [currentJudge, setCurrentJudge] = useState(null);

  useEffect(() => {
    fetchJudges();
  }, [currentPage]);

  const fetchJudges = async () => {
    try {
      setLoading(true);
      // Simulate API call with sample data
      const sampleJudges = [
        {
          _id: 1,
          user: { name: 'Sensei Yamamoto', email: 'yamamoto@example.com' },
          specialization: 'Kata',
          experience: '15 years',
          isActive: true,
          tournamentsJudged: 42,
          rating: 4.8
        },
        {
          _id: 2,
          user: { name: 'Master Chen', email: 'chen@example.com' },
          specialization: 'Kumite',
          experience: '20 years',
          isActive: true,
          tournamentsJudged: 56,
          rating: 4.9
        },
        {
          _id: 3,
          user: { name: 'Judge Williams', email: 'williams@example.com' },
          specialization: 'All-Round',
          experience: '10 years',
          isActive: false,
          tournamentsJudged: 28,
          rating: 4.5
        },
        {
          _id: 4,
          user: { name: 'Sensei Rodriguez', email: 'rodriguez@example.com' },
          specialization: 'Kata',
          experience: '12 years',
          isActive: true,
          tournamentsJudged: 35,
          rating: 4.7
        },
        {
          _id: 5,
          user: { name: 'Master Johnson', email: 'johnson@example.com' },
          specialization: 'Kumite',
          experience: '18 years',
          isActive: true,
          tournamentsJudged: 48,
          rating: 4.8
        }
      ];
      
      // Apply filters
      let filteredJudges = sampleJudges;
      if (searchTerm) {
        filteredJudges = filteredJudges.filter(judge => 
          judge.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          judge.user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredJudges = filteredJudges.filter(judge => judge.isActive === isActive);
      }
      
      if (specializationFilter !== 'all') {
        filteredJudges = filteredJudges.filter(judge => 
          judge.specialization.toLowerCase() === specializationFilter.toLowerCase()
        );
      }
      
      setJudges(filteredJudges);
      setTotalPages(2);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch judges');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this judge?')) {
      try {
        // Simulate API call
        setJudges(judges.filter(judge => judge._id !== id));
      } catch (err) {
        setError('Failed to delete judge');
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

  const toggleJudgeStatus = async (id) => {
    try {
      // Simulate API call
      setJudges(judges.map(judge => 
        judge._id === id ? { ...judge, isActive: !judge.isActive } : judge
      ));
    } catch (err) {
      setError('Failed to update judge status');
    }
  };

  // Handle input changes for new judge form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJudge({
      ...newJudge,
      [name]: value
    });
  };

  // Handle form submission for adding new judge
  const handleAddJudge = (e) => {
    e.preventDefault();
    // Simulate API call
    const judgeToAdd = {
      _id: judges.length + 1,
      user: { name: newJudge.name, email: newJudge.email },
      specialization: newJudge.specialization,
      experience: newJudge.experience,
      isActive: true,
      tournamentsJudged: 0,
      rating: 0
    };
    setJudges([...judges, judgeToAdd]);
    // Reset form and close modal
    setNewJudge({
      name: '',
      email: '',
      specialization: 'Kata',
      experience: ''
    });
    setShowAddModal(false);
  };

  // Handle edit judge
  const handleEditJudge = (judge) => {
    setCurrentJudge(judge);
    // Initialize form with judge data
    setNewJudge({
      name: judge.user.name,
      email: judge.user.email,
      specialization: judge.specialization,
      experience: judge.experience
    });
    setShowEditModal(true);
  };

  // Handle update judge
  const handleUpdateJudge = (e) => {
    e.preventDefault();
    // Simulate API call
    const updatedJudges = judges.map(judge => 
      judge._id === currentJudge._id 
        ? {
            ...judge,
            user: { name: newJudge.name, email: newJudge.email },
            specialization: newJudge.specialization,
            experience: newJudge.experience
          }
        : judge
    );
    setJudges(updatedJudges);
    // Reset form and close modal
    setNewJudge({
      name: '',
      email: '',
      specialization: 'Kata',
      experience: ''
    });
    setCurrentJudge(null);
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
          <h1 className="text-3xl font-bold text-white mb-2">Judges Management</h1>
          <p className="text-gray-400">Manage all judges in the system</p>
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
                  placeholder="Search judges..."
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
              Add New Judge
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Specializations</option>
                  <option value="kata">Kata</option>
                  <option value="kumite">Kumite</option>
                  <option value="all-round">All-Round</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setSpecializationFilter('all');
                  }}
                  className="w-full px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Judges Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Judge List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {judges.length} judges</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Judge
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
                {judges.map((judge) => (
                  <tr key={judge._id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">
                            {judge.user?.name?.charAt(0)?.toUpperCase() || 'J'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{judge.user?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{judge.user?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaGavel className="text-yellow-500" />
                        </div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSpecializationColor(judge.specialization)}`}>
                          {judge.specialization || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-white">{judge.experience || 'N/A'}</div>
                      <div className="text-sm text-gray-400">{judge.tournamentsJudged || 0} tournaments</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaStar className="text-yellow-400" />
                        </div>
                        <div className="text-sm text-white">
                          {judge.rating || 'N/A'} <span className="text-gray-400">/ 5.0</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(judge.isActive)}`}>
                        {judge.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => toggleJudgeStatus(judge._id)}
                          className={`p-2 rounded-lg ${judge.isActive ? 'text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10' : 'text-green-400 hover:bg-green-400 hover:bg-opacity-10'} transition-colors duration-200`}
                          title={judge.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {judge.isActive ? <FaBan /> : <FaCheck />}
                        </button>
                        <button 
                          onClick={() => handleEditJudge(judge)}
                          className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(judge._id)}
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

            {judges.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaGavel className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No judges found</h3>
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

      {/* Add Judge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Add New Judge</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddJudge}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newJudge.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter judge name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newJudge.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter judge email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
                  <select
                    name="specialization"
                    value={newJudge.specialization}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  >
                    <option value="Kata">Kata</option>
                    <option value="Kumite">Kumite</option>
                    <option value="All-Round">All-Round</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={newJudge.experience}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter years of experience"
                  />
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
                  Add Judge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Judge Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit Judge</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentJudge(null);
                  setNewJudge({
                    name: '',
                    email: '',
                    specialization: 'Kata',
                    experience: ''
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateJudge}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newJudge.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter judge name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newJudge.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter judge email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
                  <select
                    name="specialization"
                    value={newJudge.specialization}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  >
                    <option value="Kata">Kata</option>
                    <option value="Kumite">Kumite</option>
                    <option value="All-Round">All-Round</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={newJudge.experience}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter years of experience"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-750 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentJudge(null);
                    setNewJudge({
                      name: '',
                      email: '',
                      specialization: 'Kata',
                      experience: ''
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
                  Update Judge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Judges;