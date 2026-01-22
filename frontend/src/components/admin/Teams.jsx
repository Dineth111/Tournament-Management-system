import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, 
  FaUserTie, FaFlag, FaUser, FaCheckCircle, FaBan, FaCheck, FaTimes
} from 'react-icons/fa';

const Teams = () => {
  const [teams, setTeams] = useState([]);
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
  const [newTeam, setNewTeam] = useState({
    name: '',
    coach: '',
    category: '',
    playerCount: 0
  });
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, [currentPage]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      // Simulate API call with sample data
      const sampleTeams = [
        {
          _id: 1,
          name: 'Dragon Warriors',
          coach: { name: 'Coach Anderson' },
          category: { name: 'Black Belt' },
          playerCount: 12,
          isActive: true,
          wins: 15,
          losses: 3,
          tournaments: 8
        },
        {
          _id: 2,
          name: 'Phoenix Fighters',
          coach: { name: 'Coach Martinez' },
          category: { name: 'Brown Belt' },
          playerCount: 10,
          isActive: true,
          wins: 12,
          losses: 5,
          tournaments: 6
        },
        {
          _id: 3,
          name: 'Tiger Masters',
          coach: { name: 'Coach Thompson' },
          category: { name: 'Blue Belt' },
          playerCount: 8,
          isActive: false,
          wins: 8,
          losses: 7,
          tournaments: 4
        },
        {
          _id: 4,
          name: 'Eagle Champions',
          coach: { name: 'Coach Lee' },
          category: { name: 'Green Belt' },
          playerCount: 11,
          isActive: true,
          wins: 10,
          losses: 4,
          tournaments: 5
        },
        {
          _id: 5,
          name: 'Lion Legends',
          coach: { name: 'Coach Wilson' },
          category: { name: 'Black Belt' },
          playerCount: 14,
          isActive: true,
          wins: 18,
          losses: 2,
          tournaments: 9
        }
      ];
      
      // Apply filters
      let filteredTeams = sampleTeams;
      if (searchTerm) {
        filteredTeams = filteredTeams.filter(team => 
          team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          team.coach.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredTeams = filteredTeams.filter(team => team.isActive === isActive);
      }
      
      if (categoryFilter !== 'all') {
        filteredTeams = filteredTeams.filter(team => 
          team.category.name.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      
      setTeams(filteredTeams);
      setTotalPages(2);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch teams');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        // Simulate API call
        setTeams(teams.filter(team => team._id !== id));
      } catch (err) {
        setError('Failed to delete team');
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

  const toggleTeamStatus = async (id) => {
    try {
      // Simulate API call
      setTeams(teams.map(team => 
        team._id === id ? { ...team, isActive: !team.isActive } : team
      ));
    } catch (err) {
      setError('Failed to update team status');
    }
  };

  // Handle input changes for new team form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam({
      ...newTeam,
      [name]: value
    });
  };

  // Handle form submission for adding new team
  const handleAddTeam = (e) => {
    e.preventDefault();
    // Simulate API call
    const teamToAdd = {
      _id: teams.length + 1,
      name: newTeam.name,
      coach: { name: newTeam.coach },
      category: { name: newTeam.category },
      playerCount: parseInt(newTeam.playerCount) || 0,
      isActive: true,
      wins: 0,
      losses: 0,
      tournaments: 0
    };
    setTeams([...teams, teamToAdd]);
    // Reset form and close modal
    setNewTeam({
      name: '',
      coach: '',
      category: '',
      playerCount: 0
    });
    setShowAddModal(false);
  };

  // Handle edit team
  const handleEditTeam = (team) => {
    setCurrentTeam(team);
    // Initialize form with team data
    setNewTeam({
      name: team.name,
      coach: team.coach.name,
      category: team.category.name,
      playerCount: team.playerCount
    });
    setShowEditModal(true);
  };

  // Handle update team
  const handleUpdateTeam = (e) => {
    e.preventDefault();
    // Simulate API call
    const updatedTeams = teams.map(team => 
      team._id === currentTeam._id 
        ? {
            ...team,
            name: newTeam.name,
            coach: { name: newTeam.coach },
            category: { name: newTeam.category },
            playerCount: parseInt(newTeam.playerCount) || 0
          }
        : team
    );
    setTeams(updatedTeams);
    // Reset form and close modal
    setNewTeam({
      name: '',
      coach: '',
      category: '',
      playerCount: 0
    });
    setCurrentTeam(null);
    setShowEditModal(false);
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'white belt': return 'bg-gray-100 text-gray-800';
      case 'yellow belt': return 'bg-yellow-100 text-yellow-800';
      case 'orange belt': return 'bg-orange-100 text-orange-800';
      case 'green belt': return 'bg-green-100 text-green-800';
      case 'blue belt': return 'bg-blue-100 text-blue-800';
      case 'brown belt': return 'bg-amber-100 text-amber-800';
      case 'black belt': return 'bg-black text-white';
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
          <h1 className="text-3xl font-bold text-white mb-2">Teams Management</h1>
          <p className="text-gray-400">Manage all teams in the system</p>
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
                  placeholder="Search teams..."
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
              Add New Team
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  <option value="white belt">White Belt</option>
                  <option value="yellow belt">Yellow Belt</option>
                  <option value="orange belt">Orange Belt</option>
                  <option value="green belt">Green Belt</option>
                  <option value="blue belt">Blue Belt</option>
                  <option value="brown belt">Brown Belt</option>
                  <option value="black belt">Black Belt</option>
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

        {/* Teams Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Team List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {teams.length} teams</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Coach
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Players
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Record
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
                {teams.map((team) => (
                  <tr key={team._id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                          <FaUsers className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{team.name || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaUserTie className="text-blue-500" />
                        </div>
                        <div className="text-sm text-white">{team.coach?.name || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaFlag className="text-yellow-500" />
                        </div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(team.category?.name)}`}>
                          {team.category?.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaUser className="text-green-500" />
                        </div>
                        <div className="text-sm text-white">{team.playerCount || 0} players</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <span className="font-bold text-green-400">{team.wins || 0}</span> W - 
                        <span className="font-bold text-red-400 ml-1">{team.losses || 0}</span> L
                      </div>
                      <div className="text-sm text-gray-400">
                        {team.tournaments || 0} tournaments
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(team.isActive)}`}>
                        {team.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => toggleTeamStatus(team._id)}
                          className={`p-2 rounded-lg ${team.isActive ? 'text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10' : 'text-green-400 hover:bg-green-400 hover:bg-opacity-10'} transition-colors duration-200`}
                          title={team.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {team.isActive ? <FaBan /> : <FaCheck />}
                        </button>
                        <button 
                          onClick={() => handleEditTeam(team)}
                          className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(team._id)}
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

            {teams.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaUsers className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No teams found</h3>
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

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Add New Team</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddTeam}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newTeam.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Coach Name</label>
                  <input
                    type="text"
                    name="coach"
                    value={newTeam.coach}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter coach name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newTeam.category}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Player Count</label>
                  <input
                    type="number"
                    name="playerCount"
                    value={newTeam.playerCount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter player count"
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
                  Add Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit Team</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentTeam(null);
                  setNewTeam({
                    name: '',
                    coach: '',
                    category: '',
                    playerCount: 0
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateTeam}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newTeam.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Coach Name</label>
                  <input
                    type="text"
                    name="coach"
                    value={newTeam.coach}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter coach name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newTeam.category}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Player Count</label>
                  <input
                    type="number"
                    name="playerCount"
                    value={newTeam.playerCount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter player count"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-750 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentTeam(null);
                    setNewTeam({
                      name: '',
                      coach: '',
                      category: '',
                      playerCount: 0
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
                  Update Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;