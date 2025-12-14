import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUser, FaUsers, FaChartBar, FaSearch, FaSave, FaTimes } from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const OrganizerPlayers = ({ user }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showEditPlayer, setShowEditPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    team: '',
    category: '',
    age: '',
    email: ''
  });

  useEffect(() => {
    // Simulate fetching players data
    setTimeout(() => {
      setPlayers([
        { id: 1, name: 'John Doe', team: 'Team Alpha', category: 'U18 Male', age: 17, email: 'john@example.com', matches: 15 },
        { id: 2, name: 'Jane Smith', team: 'Team Beta', category: 'U18 Female', age: 16, email: 'jane@example.com', matches: 12 },
        { id: 3, name: 'Robert Brown', team: 'Team Gamma', category: 'U18 Male', age: 18, email: 'robert@example.com', matches: 10 },
        { id: 4, name: 'Emily Davis', team: 'Team Delta', category: 'U18 Female', age: 17, email: 'emily@example.com', matches: 14 },
        { id: 5, name: 'David Wilson', team: 'Team Alpha', category: 'U18 Male', age: 16, email: 'david@example.com', matches: 13 },
        { id: 6, name: 'Sarah Johnson', team: 'Team Beta', category: 'U18 Female', age: 18, email: 'sarah@example.com', matches: 11 },
        { id: 7, name: 'Michael Taylor', team: 'Team Gamma', category: 'U18 Male', age: 17, email: 'michael@example.com', matches: 9 },
        { id: 8, name: 'Jessica Brown', team: 'Team Delta', category: 'U18 Female', age: 16, email: 'jessica@example.com', matches: 12 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredPlayers = sortedPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '↕';
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to add the player
    const player = {
      id: players.length + 1,
      ...newPlayer,
      matches: 0
    };
    setPlayers([...players, player]);
    setNewPlayer({ name: '', team: '', category: '', age: '', email: '' });
    setShowAddPlayer(false);
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setShowEditPlayer(true);
  };

  const handleUpdatePlayer = (e) => {
    e.preventDefault();
    setPlayers(players.map(player => player.id === editingPlayer.id ? editingPlayer : player));
    setShowEditPlayer(false);
    setEditingPlayer(null);
  };

  const handleDeletePlayer = (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      setPlayers(players.filter(player => player.id !== id));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPlayer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewPlayerChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPlayersByCategoryData = () => {
    const categories = [...new Set(players.map(player => player.category))];
    const data = categories.map(category => 
      players.filter(player => player.category === category).length
    );
    
    return {
      labels: categories,
      datasets: [
        {
          label: 'Players by Category',
          data: data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const getPlayersByTeamData = () => {
    const teams = [...new Set(players.map(player => player.team))];
    const data = teams.map(team => 
      players.filter(player => player.team === team).length
    );
    
    return {
      labels: teams,
      datasets: [
        {
          label: 'Players by Team',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF' // text-gray-400
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold leading-tight text-white flex items-center">
                <FaUser className="mr-2 text-indigo-400" /> Players
              </h1>
              <button
                onClick={() => setShowAddPlayer(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2" /> Add Player
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Add Player Form */}
              {showAddPlayer && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaPlus className="mr-2 text-indigo-400" /> Add New Player
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleAddPlayer} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Full Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={newPlayer.name}
                              onChange={handleNewPlayerChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="team" className="block text-sm font-medium text-gray-300">
                            Team
                          </label>
                          <div className="mt-1">
                            <select
                              id="team"
                              name="team"
                              value={newPlayer.team}
                              onChange={handleNewPlayerChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select team</option>
                              <option value="Team Alpha">Team Alpha</option>
                              <option value="Team Beta">Team Beta</option>
                              <option value="Team Gamma">Team Gamma</option>
                              <option value="Team Delta">Team Delta</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                            Category
                          </label>
                          <div className="mt-1">
                            <select
                              id="category"
                              name="category"
                              value={newPlayer.category}
                              onChange={handleNewPlayerChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select category</option>
                              <option value="U8 Male">U8 Male</option>
                              <option value="U10 Male">U10 Male</option>
                              <option value="U12 Male">U12 Male</option>
                              <option value="U14 Male">U14 Male</option>
                              <option value="U16 Male">U16 Male</option>
                              <option value="U18 Male">U18 Male</option>
                              <option value="U8 Female">U8 Female</option>
                              <option value="U10 Female">U10 Female</option>
                              <option value="U12 Female">U12 Female</option>
                              <option value="U14 Female">U14 Female</option>
                              <option value="U16 Female">U16 Female</option>
                              <option value="U18 Female">U18 Female</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                            Age
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="age"
                              id="age"
                              value={newPlayer.age}
                              onChange={handleNewPlayerChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email Address
                          </label>
                          <div className="mt-1">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={newPlayer.email}
                              onChange={handleNewPlayerChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddPlayer(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" /> Add Player
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Player Form */}
              {showEditPlayer && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaEdit className="mr-2 text-indigo-400" /> Edit Player
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleUpdatePlayer} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300">
                            Full Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="edit-name"
                              value={editingPlayer?.name || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-team" className="block text-sm font-medium text-gray-300">
                            Team
                          </label>
                          <div className="mt-1">
                            <select
                              id="edit-team"
                              name="team"
                              value={editingPlayer?.team || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select team</option>
                              <option value="Team Alpha">Team Alpha</option>
                              <option value="Team Beta">Team Beta</option>
                              <option value="Team Gamma">Team Gamma</option>
                              <option value="Team Delta">Team Delta</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-category" className="block text-sm font-medium text-gray-300">
                            Category
                          </label>
                          <div className="mt-1">
                            <select
                              id="edit-category"
                              name="category"
                              value={editingPlayer?.category || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select category</option>
                              <option value="U8 Male">U8 Male</option>
                              <option value="U10 Male">U10 Male</option>
                              <option value="U12 Male">U12 Male</option>
                              <option value="U14 Male">U14 Male</option>
                              <option value="U16 Male">U16 Male</option>
                              <option value="U18 Male">U18 Male</option>
                              <option value="U8 Female">U8 Female</option>
                              <option value="U10 Female">U10 Female</option>
                              <option value="U12 Female">U12 Female</option>
                              <option value="U14 Female">U14 Female</option>
                              <option value="U16 Female">U16 Female</option>
                              <option value="U18 Female">U18 Female</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-age" className="block text-sm font-medium text-gray-300">
                            Age
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="age"
                              id="edit-age"
                              value={editingPlayer?.age || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="edit-email" className="block text-sm font-medium text-gray-300">
                            Email Address
                          </label>
                          <div className="mt-1">
                            <input
                              type="email"
                              name="email"
                              id="edit-email"
                              value={editingPlayer?.email || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowEditPlayer(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" /> Update Player
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Search and Filter */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search players by name, team, or category..."
                  />
                </div>
              </div>

              {/* Players List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            Name
                            <span className="ml-1">{getSortIcon('name')}</span>
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('team')}
                        >
                          <div className="flex items-center">
                            Team
                            <span className="ml-1">{getSortIcon('team')}</span>
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center">
                            Category
                            <span className="ml-1">{getSortIcon('category')}</span>
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('age')}
                        >
                          <div className="flex items-center">
                            Age
                            <span className="ml-1">{getSortIcon('age')}</span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Matches
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {filteredPlayers.map((player) => (
                        <tr key={player.id} className="hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    {player.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{player.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{player.team}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-900 text-indigo-200">
                              {player.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {player.age}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {player.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {player.matches}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditPlayer(player)}
                              className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 mr-2"
                            >
                              <FaEdit className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeletePlayer(player.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              <FaTrash className="mr-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts Section */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <FaChartBar className="mr-2 text-indigo-400" /> Players Analytics
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Players by Category</h3>
                    <div className="h-64">
                      <Pie data={getPlayersByCategoryData()} options={chartOptions} />
                    </div>
                  </div>
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Players by Team</h3>
                    <div className="h-64">
                      <Bar data={getPlayersByTeamData()} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Players Stats */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white">Players Overview</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                          <FaUser className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Players</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">{players.length}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <FaUsers className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Teams</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {[...new Set(players.map(player => player.team))].length}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Avg. Matches</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {players.length > 0 
                                  ? Math.round(players.reduce((sum, player) => sum + player.matches, 0) / players.length)
                                  : 0}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Categories</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {[...new Set(players.map(player => player.category))].length}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizerPlayers;