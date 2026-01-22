import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUserTie, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, 
  FaUsers, FaFlag, FaCheckCircle, FaBan, FaCheck, FaTimes
} from 'react-icons/fa';

const Players = () => {
  const [players, setPlayers] = useState([]);
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
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    email: '',
    team: '',
    category: '',
    beltRank: 'White Belt'
  });
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, [currentPage]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      // Simulate API call with sample data
      const samplePlayers = [
        {
          _id: 1,
          user: { name: 'John Smith', email: 'john@example.com' },
          team: { name: 'Dragon Warriors' },
          category: { name: 'Black Belt' },
          isActive: true,
          beltRank: 'Black Belt',
          wins: 15,
          losses: 3
        },
        {
          _id: 2,
          user: { name: 'Jane Doe', email: 'jane@example.com' },
          team: { name: 'Phoenix Fighters' },
          category: { name: 'Brown Belt' },
          isActive: true,
          beltRank: 'Brown Belt',
          wins: 12,
          losses: 5
        },
        {
          _id: 3,
          user: { name: 'Mike Johnson', email: 'mike@example.com' },
          team: { name: 'Tiger Masters' },
          category: { name: 'Blue Belt' },
          isActive: false,
          beltRank: 'Blue Belt',
          wins: 8,
          losses: 7
        },
        {
          _id: 4,
          user: { name: 'Sarah Wilson', email: 'sarah@example.com' },
          team: { name: 'Dragon Warriors' },
          category: { name: 'Black Belt' },
          isActive: true,
          beltRank: 'Black Belt',
          wins: 18,
          losses: 2
        },
        {
          _id: 5,
          user: { name: 'Tom Brown', email: 'tom@example.com' },
          team: { name: 'Phoenix Fighters' },
          category: { name: 'Green Belt' },
          isActive: true,
          beltRank: 'Green Belt',
          wins: 10,
          losses: 4
        }
      ];
      
      // Apply filters
      let filteredPlayers = samplePlayers;
      if (searchTerm) {
        filteredPlayers = filteredPlayers.filter(player => 
          player.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          player.user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredPlayers = filteredPlayers.filter(player => player.isActive === isActive);
      }
      
      setPlayers(filteredPlayers);
      setTotalPages(2);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch players');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        // Simulate API call
        setPlayers(players.filter(player => player._id !== id));
      } catch (err) {
        setError('Failed to delete player');
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

  const togglePlayerStatus = async (id) => {
    try {
      // Simulate API call
      setPlayers(players.map(player => 
        player._id === id ? { ...player, isActive: !player.isActive } : player
      ));
    } catch (err) {
      setError('Failed to update player status');
    }
  };

  // Handle input changes for new player form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer({
      ...newPlayer,
      [name]: value
    });
  };

  // Handle form submission for adding new player
  const handleAddPlayer = (e) => {
    e.preventDefault();
    // Simulate API call
    const playerToAdd = {
      _id: players.length + 1,
      user: { name: newPlayer.name, email: newPlayer.email },
      team: { name: newPlayer.team },
      category: { name: newPlayer.category },
      isActive: true,
      beltRank: newPlayer.beltRank,
      wins: 0,
      losses: 0
    };
    setPlayers([...players, playerToAdd]);
    // Reset form and close modal
    setNewPlayer({
      name: '',
      email: '',
      team: '',
      category: '',
      beltRank: 'White Belt'
    });
    setShowAddModal(false);
  };

  // Handle edit player
  const handleEditPlayer = (player) => {
    setCurrentPlayer(player);
    // Initialize form with player data
    setNewPlayer({
      name: player.user.name,
      email: player.user.email,
      team: player.team.name,
      category: player.category.name,
      beltRank: player.beltRank
    });
    setShowEditModal(true);
  };

  // Handle update player
  const handleUpdatePlayer = (e) => {
    e.preventDefault();
    // Simulate API call
    const updatedPlayers = players.map(player => 
      player._id === currentPlayer._id 
        ? {
            ...player,
            user: { name: newPlayer.name, email: newPlayer.email },
            team: { name: newPlayer.team },
            category: { name: newPlayer.category },
            beltRank: newPlayer.beltRank
          }
        : player
    );
    setPlayers(updatedPlayers);
    // Reset form and close modal
    setNewPlayer({
      name: '',
      email: '',
      team: '',
      category: '',
      beltRank: 'White Belt'
    });
    setCurrentPlayer(null);
    setShowEditModal(false);
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getBeltColor = (beltRank) => {
    switch (beltRank.toLowerCase()) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Players Management</h1>
          <p className="text-gray-400">Manage all players in the system</p>
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
                  placeholder="Search players..."
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
              Add New Player
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

        {/* Players Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Player List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {players.length} players</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Player
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Belt Rank
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
                {players.map((player) => (
                  <tr key={player._id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">
                            {player.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{player.user?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{player.user?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaUsers className="text-blue-500" />
                        </div>
                        <div className="text-sm text-white">{player.team?.name || 'No Team'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaFlag className="text-yellow-500" />
                        </div>
                        <div className="text-sm text-white">{player.category?.name || 'No Category'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBeltColor(player.beltRank)}`}>
                        {player.beltRank || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-white">
                      <span className="font-bold text-green-400">{player.wins || 0}</span> W - 
                      <span className="font-bold text-red-400 ml-1">{player.losses || 0}</span> L
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(player.isActive)}`}>
                        {player.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => togglePlayerStatus(player._id)}
                          className={`p-2 rounded-lg ${player.isActive ? 'text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10' : 'text-green-400 hover:bg-green-400 hover:bg-opacity-10'} transition-colors duration-200`}
                          title={player.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {player.isActive ? <FaBan /> : <FaCheck />}
                        </button>
                        <button 
                          onClick={() => handleEditPlayer(player)}
                          className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(player._id)}
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

            {players.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaUserTie className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No players found</h3>
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

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Add New Player</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddPlayer}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newPlayer.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter player name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newPlayer.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter player email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team</label>
                  <input
                    type="text"
                    name="team"
                    value={newPlayer.team}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newPlayer.category}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Belt Rank</label>
                  <select
                    name="beltRank"
                    value={newPlayer.beltRank}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  >
                    <option value="White Belt">White Belt</option>
                    <option value="Yellow Belt">Yellow Belt</option>
                    <option value="Orange Belt">Orange Belt</option>
                    <option value="Green Belt">Green Belt</option>
                    <option value="Blue Belt">Blue Belt</option>
                    <option value="Brown Belt">Brown Belt</option>
                    <option value="Black Belt">Black Belt</option>
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
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Player Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit Player</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentPlayer(null);
                  setNewPlayer({
                    name: '',
                    email: '',
                    team: '',
                    category: '',
                    beltRank: 'White Belt'
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdatePlayer}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newPlayer.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter player name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newPlayer.email}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter player email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team</label>
                  <input
                    type="text"
                    name="team"
                    value={newPlayer.team}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newPlayer.category}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Belt Rank</label>
                  <select
                    name="beltRank"
                    value={newPlayer.beltRank}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  >
                    <option value="White Belt">White Belt</option>
                    <option value="Yellow Belt">Yellow Belt</option>
                    <option value="Orange Belt">Orange Belt</option>
                    <option value="Green Belt">Green Belt</option>
                    <option value="Blue Belt">Blue Belt</option>
                    <option value="Brown Belt">Brown Belt</option>
                    <option value="Black Belt">Black Belt</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-750 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentPlayer(null);
                    setNewPlayer({
                      name: '',
                      email: '',
                      team: '',
                      category: '',
                      beltRank: 'White Belt'
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
                  Update Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;