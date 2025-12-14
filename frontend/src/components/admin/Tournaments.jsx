import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaTrophy, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, 
  FaEye, FaCalendarAlt, FaFlag, FaUsers, FaChartBar, FaCheckCircle, 
  FaClock, FaBan, FaCheck, FaTimes
} from 'react-icons/fa';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  // Add state for modal and form data
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    category: '',
    maxTeams: 0
  });
  const [currentTournament, setCurrentTournament] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, [currentPage]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      // Simulate API call with sample data
      const sampleTournaments = [
        {
          _id: 1,
          name: 'Summer Championship 2025',
          description: 'Annual summer karate championship',
          startDate: '2025-06-15',
          endDate: '2025-06-17',
          category: { name: 'Black Belt' },
          maxTeams: 16,
          registeredTeams: 12,
          isActive: true,
          status: 'active'
        },
        {
          _id: 2,
          name: 'Winter League 2025',
          description: 'Winter league for all belt levels',
          startDate: '2025-12-01',
          endDate: '2025-12-03',
          category: { name: 'All Levels' },
          maxTeams: 32,
          registeredTeams: 8,
          isActive: true,
          status: 'upcoming'
        },
        {
          _id: 3,
          name: 'Youth Tournament',
          description: 'Tournament for junior karateka',
          startDate: '2025-08-10',
          endDate: '2025-08-12',
          category: { name: 'Youth' },
          maxTeams: 24,
          registeredTeams: 24,
          isActive: false,
          status: 'full'
        },
        {
          _id: 4,
          name: 'Master\'s Cup',
          description: 'Competition for 4th dan and above',
          startDate: '2025-04-20',
          endDate: '2025-04-22',
          category: { name: 'Master' },
          maxTeams: 8,
          registeredTeams: 6,
          isActive: false,
          status: 'completed'
        },
        {
          _id: 5,
          name: 'Beginner\'s Open',
          description: 'Open tournament for white and yellow belts',
          startDate: '2025-09-05',
          endDate: '2025-09-07',
          category: { name: 'Beginner' },
          maxTeams: 20,
          registeredTeams: 15,
          isActive: true,
          status: 'active'
        }
      ];
      
      // Apply filters
      let filteredTournaments = sampleTournaments;
      if (searchTerm) {
        filteredTournaments = filteredTournaments.filter(tournament => 
          tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          tournament.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        filteredTournaments = filteredTournaments.filter(tournament => tournament.status === statusFilter);
      }
      
      if (categoryFilter !== 'all') {
        filteredTournaments = filteredTournaments.filter(tournament => 
          tournament.category.name.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      
      setTournaments(filteredTournaments);
      setTotalPages(2);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tournaments');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        // Simulate API call
        setTournaments(tournaments.filter(tournament => tournament._id !== id));
      } catch (err) {
        setError('Failed to delete tournament');
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

  const toggleTournamentStatus = async (id) => {
    try {
      // Simulate API call
      setTournaments(tournaments.map(tournament => 
        tournament._id === id ? { ...tournament, isActive: !tournament.isActive } : tournament
      ));
    } catch (err) {
      setError('Failed to update tournament status');
    }
  };

  // Handle input changes for new tournament form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTournament({
      ...newTournament,
      [name]: value
    });
  };

  // Handle form submission for adding new tournament
  const handleAddTournament = (e) => {
    e.preventDefault();
    // Simulate API call
    const tournamentToAdd = {
      _id: tournaments.length + 1,
      name: newTournament.name,
      description: newTournament.description,
      startDate: newTournament.startDate,
      endDate: newTournament.endDate,
      category: { name: newTournament.category },
      maxTeams: parseInt(newTournament.maxTeams) || 0,
      registeredTeams: 0,
      isActive: true,
      status: 'upcoming'
    };
    setTournaments([...tournaments, tournamentToAdd]);
    // Reset form and close modal
    setNewTournament({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      category: '',
      maxTeams: 0
    });
    setShowAddModal(false);
  };

  // Handle edit tournament
  const handleEditTournament = (tournament) => {
    setCurrentTournament(tournament);
    // Initialize form with tournament data
    setNewTournament({
      name: tournament.name,
      description: tournament.description,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      category: tournament.category.name,
      maxTeams: tournament.maxTeams
    });
    setShowEditModal(true);
  };

  // Handle update tournament
  const handleUpdateTournament = (e) => {
    e.preventDefault();
    // Simulate API call
    const updatedTournaments = tournaments.map(tournament => 
      tournament._id === currentTournament._id 
        ? {
            ...tournament,
            name: newTournament.name,
            description: newTournament.description,
            startDate: newTournament.startDate,
            endDate: newTournament.endDate,
            category: { name: newTournament.category },
            maxTeams: parseInt(newTournament.maxTeams) || 0
          }
        : tournament
    );
    setTournaments(updatedTournaments);
    // Reset form and close modal
    setNewTournament({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      category: '',
      maxTeams: 0
    });
    setCurrentTournament(null);
    setShowEditModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'full': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaCheckCircle className="text-green-500" />;
      case 'upcoming': return <FaClock className="text-blue-500" />;
      case 'full': return <FaBan className="text-yellow-500" />;
      case 'completed': return <FaCheck className="text-purple-500" />;
      default: return <FaClock className="text-gray-500" />;
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
          <h1 className="text-3xl font-bold text-white mb-2">Tournaments Management</h1>
          <p className="text-gray-400">Manage all tournaments in the system</p>
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
                  placeholder="Search tournaments..."
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
              Add New Tournament
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
                  <option value="upcoming">Upcoming</option>
                  <option value="full">Full</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  <option value="black belt">Black Belt</option>
                  <option value="all levels">All Levels</option>
                  <option value="youth">Youth</option>
                  <option value="master">Master</option>
                  <option value="beginner">Beginner</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                  className="w-full px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tournaments Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Tournament List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {tournaments.length} tournaments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tournament
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Teams
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
                {tournaments.map((tournament) => (
                  <tr key={tournament._id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                          <FaTrophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{tournament.name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{tournament.description || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaFlag className="text-yellow-500" />
                        </div>
                        <div className="text-sm text-white">{tournament.category?.name || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaCalendarAlt className="text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm text-white">
                            {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaUsers className="text-green-500" />
                        </div>
                        <div>
                          <div className="text-sm text-white">
                            {tournament.registeredTeams || 0}/{tournament.maxTeams || 'N/A'}
                          </div>
                          <div className="w-24 bg-gray-700 rounded-full h-2 mt-1">
                            <div 
                              className="bg-gradient-to-r from-red-600 to-yellow-500 h-2 rounded-full" 
                              style={{ 
                                width: `${tournament.maxTeams ? (tournament.registeredTeams / tournament.maxTeams) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getStatusIcon(tournament.status)}
                        </div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tournament.status)}`}>
                          {tournament.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200">
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleEditTournament(tournament)}
                          className="p-2 rounded-lg text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10 transition-colors duration-200"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(tournament._id)}
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

            {tournaments.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaTrophy className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No tournaments found</h3>
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

      {/* Add Tournament Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Add New Tournament</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddTournament}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newTournament.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter tournament name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newTournament.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter tournament description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newTournament.startDate}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newTournament.endDate}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newTournament.category}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Teams</label>
                  <input
                    type="number"
                    name="maxTeams"
                    value={newTournament.maxTeams}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter maximum number of teams"
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
                  Add Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tournament Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit Tournament</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentTournament(null);
                  setNewTournament({
                    name: '',
                    description: '',
                    startDate: '',
                    endDate: '',
                    category: '',
                    maxTeams: 0
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateTournament}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newTournament.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter tournament name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newTournament.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter tournament description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newTournament.startDate}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newTournament.endDate}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newTournament.category}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Teams</label>
                  <input
                    type="number"
                    name="maxTeams"
                    value={newTournament.maxTeams}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter maximum number of teams"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-750 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentTournament(null);
                    setNewTournament({
                      name: '',
                      description: '',
                      startDate: '',
                      endDate: '',
                      category: '',
                      maxTeams: 0
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
                  Update Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournaments;