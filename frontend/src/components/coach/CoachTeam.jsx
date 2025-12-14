import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaTrophy, FaChartBar, FaPlus, FaEdit, FaTrash, FaEye, 
  FaMedal, FaFutbol, FaCalendarAlt, FaUserPlus, FaSave, FaTimes,
  FaFilter, FaSearch, FaSort, FaSortUp, FaSortDown
} from 'react-icons/fa';
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CoachTeam = ({ user }) => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showEditPlayer, setShowEditPlayer] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: '',
    age: '',
    email: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [positionFilter, setPositionFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching team data
    setTimeout(() => {
      setTeamData({
        name: 'Team Alpha',
        category: 'U18 Male',
        founded: '2015',
        wins: 12,
        losses: 3,
        draws: 1,
        coach: 'Michael Johnson'
      });
      
      setPlayers([
        { id: 1, name: 'John Doe', position: 'Forward', age: 22, email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', position: 'Midfielder', age: 21, email: 'jane@example.com' },
        { id: 3, name: 'Robert Brown', position: 'Defender', age: 23, email: 'robert@example.com' },
        { id: 4, name: 'Emily Davis', position: 'Goalkeeper', age: 20, email: 'emily@example.com' },
        { id: 5, name: 'David Wilson', position: 'Midfielder', age: 22, email: 'david@example.com' },
        { id: 6, name: 'Sarah Johnson', position: 'Forward', age: 21, email: 'sarah@example.com' }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  // Chart data for team performance
  const performanceData = {
    labels: ['Wins', 'Losses', 'Draws'],
    datasets: [
      {
        label: 'Team Performance',
        data: [teamData?.wins || 0, teamData?.losses || 0, teamData?.draws || 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green for wins
          'rgba(239, 68, 68, 0.8)',  // Red for losses
          'rgba(251, 191, 36, 0.8)'  // Yellow for draws
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(251, 191, 36, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for player positions
  const positionData = {
    labels: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
    datasets: [
      {
        label: 'Players by Position',
        data: [
          players.filter(p => p.position === 'Forward').length,
          players.filter(p => p.position === 'Midfielder').length,
          players.filter(p => p.position === 'Defender').length,
          players.filter(p => p.position === 'Goalkeeper').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to add the player
    const player = {
      id: players.length + 1,
      ...newPlayer
    };
    setPlayers([...players, player]);
    setNewPlayer({ name: '', position: '', age: '', email: '' });
    setShowAddPlayer(false);
  };

  const handleEditPlayer = (player) => {
    setCurrentPlayer(player);
    setNewPlayer({
      name: player.name,
      position: player.position,
      age: player.age,
      email: player.email
    });
    setShowEditPlayer(true);
  };

  const handleUpdatePlayer = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the player
    setPlayers(players.map(player => 
      player.id === currentPlayer.id 
        ? { ...player, ...newPlayer } 
        : player
    ));
    setNewPlayer({ name: '', position: '', age: '', email: '' });
    setShowEditPlayer(false);
    setCurrentPlayer(null);
  };

  const handleRemovePlayer = (playerId) => {
    // In a real app, this would make an API call to remove the player
    setPlayers(players.filter(player => player.id !== playerId));
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'Forward': return 'bg-blue-100 text-blue-800';
      case 'Midfielder': return 'bg-purple-100 text-purple-800';
      case 'Defender': return 'bg-yellow-100 text-yellow-800';
      case 'Goalkeeper': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
    (player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (positionFilter === 'all' || player.position === positionFilter)
  );

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'ascending' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
    }
    return <FaSort className="ml-1" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold leading-tight text-white">My Team</h1>
              <button
                onClick={() => setShowAddPlayer(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaUserPlus className="mr-2" />
                Add Player
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Team Stats Overview */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-md p-3">
                        <FaUsers className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-white text-opacity-80 truncate">Total Players</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">{players.length}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-md p-3">
                        <FaTrophy className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-white text-opacity-80 truncate">Wins</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">{teamData?.wins}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-teal-600 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-md p-3">
                        <FaChartBar className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-white text-opacity-80 truncate">Win Rate</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {teamData && Math.round((teamData.wins / (teamData.wins + teamData.losses + teamData.draws)) * 100)}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-600 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-md p-3">
                        <FaMedal className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-white text-opacity-80 truncate">Category</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">{teamData?.category}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Info Card */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Team Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">Details about your team</p>
                </div>
                <div className="border-t border-gray-700">
                  <dl>
                    <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400">Team Name</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{teamData?.name}</dd>
                    </div>
                    <div className="bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400">Coach</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{teamData?.coach}</dd>
                    </div>
                    <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400">Category</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{teamData?.category}</dd>
                    </div>
                    <div className="bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400">Founded</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{teamData?.founded}</dd>
                    </div>
                    <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400">Record</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                        {teamData?.wins} Wins - {teamData?.losses} Losses - {teamData?.draws} Draws
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Performance Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Team Performance</h3>
                  <div className="h-64">
                    <Pie data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Player Positions Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Players by Position</h3>
                  <div className="h-64">
                    <Bar data={positionData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-600 rounded-md bg-gray-800 text-white"
                        placeholder="Search players..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <select
                      value={positionFilter}
                      onChange={(e) => setPositionFilter(e.target.value)}
                      className="block px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">All Positions</option>
                      <option value="Forward">Forward</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Defender">Defender</option>
                      <option value="Goalkeeper">Goalkeeper</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Add Player Form */}
              {(showAddPlayer || showEditPlayer) && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-white">
                        {showEditPlayer ? 'Edit Player' : 'Add New Player'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddPlayer(false);
                          setShowEditPlayer(false);
                          setNewPlayer({ name: '', position: '', age: '', email: '' });
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={showEditPlayer ? handleUpdatePlayer : handleAddPlayer} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Player Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={newPlayer.name}
                              onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="position" className="block text-sm font-medium text-gray-300">
                            Position
                          </label>
                          <div className="mt-1">
                            <select
                              id="position"
                              name="position"
                              value={newPlayer.position}
                              onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select position</option>
                              <option value="Goalkeeper">Goalkeeper</option>
                              <option value="Defender">Defender</option>
                              <option value="Midfielder">Midfielder</option>
                              <option value="Forward">Forward</option>
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
                              onChange={(e) => setNewPlayer({...newPlayer, age: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                          </label>
                          <div className="mt-1">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={newPlayer.email}
                              onChange={(e) => setNewPlayer({...newPlayer, email: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddPlayer(false);
                            setShowEditPlayer(false);
                            setNewPlayer({ name: '', position: '', age: '', email: '' });
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FaSave className="mr-2" />
                          {showEditPlayer ? 'Update Player' : 'Add Player'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Team Players */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Team Players</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">List of players in your team</p>
                </div>
                <div className="border-t border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center">
                              Player {getSortIcon('name')}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                            onClick={() => handleSort('position')}
                          >
                            <div className="flex items-center">
                              Position {getSortIcon('position')}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                            onClick={() => handleSort('age')}
                          >
                            <div className="flex items-center">
                              Age {getSortIcon('age')}
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Contact
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
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center">
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
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
                                {player.position}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{player.age} years</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-400">{player.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEditPlayer(player)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <FaEdit className="mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleRemovePlayer(player.id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <FaTrash className="mr-1" />
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default CoachTeam;