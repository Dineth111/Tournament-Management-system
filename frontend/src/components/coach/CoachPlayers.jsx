import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaChartBar, FaSearch, FaSort, FaSortUp, FaSortDown, 
  FaEye, FaEdit, FaPlus, FaFilter, FaDownload, FaTable, FaChartPie,
  FaSave, FaTimes, FaTrash
} from 'react-icons/fa';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import jsPDF from 'jspdf';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const CoachPlayers = ({ user }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showFilters, setShowFilters] = useState(false);
  const [positionFilter, setPositionFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'charts'
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showEditPlayer, setShowEditPlayer] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: '',
    age: '',
    email: '',
    matches: 0,
    goals: 0,
    assists: 0
  });

  useEffect(() => {
    // Simulate fetching players data
    setTimeout(() => {
      setPlayers([
        { id: 1, name: 'John Doe', position: 'Forward', age: 22, email: 'john@example.com', matches: 15, goals: 8, assists: 5 },
        { id: 2, name: 'Jane Smith', position: 'Midfielder', age: 21, email: 'jane@example.com', matches: 14, goals: 3, assists: 7 },
        { id: 3, name: 'Robert Brown', position: 'Defender', age: 23, email: 'robert@example.com', matches: 16, goals: 1, assists: 2 },
        { id: 4, name: 'Emily Davis', position: 'Goalkeeper', age: 20, email: 'emily@example.com', matches: 10, goals: 0, assists: 1 },
        { id: 5, name: 'David Wilson', position: 'Midfielder', age: 22, email: 'david@example.com', matches: 15, goals: 4, assists: 6 },
        { id: 6, name: 'Sarah Johnson', position: 'Forward', age: 21, email: 'sarah@example.com', matches: 14, goals: 6, assists: 3 },
        { id: 7, name: 'Michael Taylor', position: 'Defender', age: 24, email: 'michael@example.com', matches: 16, goals: 2, assists: 4 },
        { id: 8, name: 'Jessica Brown', position: 'Midfielder', age: 20, email: 'jessica@example.com', matches: 13, goals: 3, assists: 8 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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

  // Chart data for top scorers
  const topScorersData = {
    labels: players.slice(0, 5).map(p => p.name),
    datasets: [
      {
        label: 'Goals',
        data: players.slice(0, 5).map(p => p.goals),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for assists
  const assistsData = {
    labels: players.slice(0, 5).map(p => p.name),
    datasets: [
      {
        label: 'Assists',
        data: players.slice(0, 5).map(p => p.assists),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
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

  const getPositionColor = (position) => {
    switch (position) {
      case 'Forward': return 'bg-blue-100 text-blue-800';
      case 'Midfielder': return 'bg-purple-100 text-purple-800';
      case 'Defender': return 'bg-yellow-100 text-yellow-800';
      case 'Goalkeeper': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Expert Karate - Players Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add table headers
    doc.setFontSize(12);
    doc.text('Name', 20, 45);
    doc.text('Position', 70, 45);
    doc.text('Age', 110, 45);
    doc.text('Matches', 140, 45);
    doc.text('Goals', 170, 45);
    doc.text('Assists', 200, 45);
    
    // Add player data
    let y = 55;
    filteredPlayers.forEach((player, index) => {
      doc.text(player.name, 20, y);
      doc.text(player.position, 70, y);
      doc.text(player.age.toString(), 110, y);
      doc.text(player.matches.toString(), 140, y);
      doc.text(player.goals.toString(), 170, y);
      doc.text(player.assists.toString(), 200, y);
      y += 10;
    });
    
    // Save the PDF
    doc.save(`players-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to add the player
    const player = {
      id: players.length + 1,
      ...newPlayer,
      age: parseInt(newPlayer.age) || 0,
      matches: parseInt(newPlayer.matches) || 0,
      goals: parseInt(newPlayer.goals) || 0,
      assists: parseInt(newPlayer.assists) || 0
    };
    setPlayers([...players, player]);
    setNewPlayer({
      name: '',
      position: '',
      age: '',
      email: '',
      matches: 0,
      goals: 0,
      assists: 0
    });
    setShowAddPlayer(false);
  };

  const handleEditPlayer = (player) => {
    setCurrentPlayer(player);
    setNewPlayer({
      name: player.name,
      position: player.position,
      age: player.age.toString(),
      email: player.email,
      matches: player.matches.toString(),
      goals: player.goals.toString(),
      assists: player.assists.toString()
    });
    setShowEditPlayer(true);
  };

  const handleUpdatePlayer = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the player
    setPlayers(players.map(player => 
      player.id === currentPlayer.id 
        ? { 
            ...player, 
            name: newPlayer.name,
            position: newPlayer.position,
            age: parseInt(newPlayer.age) || 0,
            email: newPlayer.email,
            matches: parseInt(newPlayer.matches) || 0,
            goals: parseInt(newPlayer.goals) || 0,
            assists: parseInt(newPlayer.assists) || 0
          } 
        : player
    ));
    setNewPlayer({
      name: '',
      position: '',
      age: '',
      email: '',
      matches: 0,
      goals: 0,
      assists: 0
    });
    setShowEditPlayer(false);
    setCurrentPlayer(null);
  };

  const handleRemovePlayer = (playerId) => {
    // In a real app, this would make an API call to remove the player
    setPlayers(players.filter(player => player.id !== playerId));
  };

  const handleViewPlayer = (player) => {
    // In a real app, this would navigate to the player's profile page or open a modal with details
    alert(`Viewing details for ${player.name}`);
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
              <h1 className="text-3xl font-bold leading-tight text-white">Players</h1>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddPlayer(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaPlus className="mr-2" />
                  Add Player
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${
                    viewMode === 'table'
                      ? 'border-red-500 text-white bg-red-600'
                      : 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <FaTable className="mr-2" />
                  Table View
                </button>
                <button
                  onClick={() => setViewMode('charts')}
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${
                    viewMode === 'charts'
                      ? 'border-red-500 text-white bg-red-600'
                      : 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <FaChartPie className="mr-2" />
                  Chart View
                </button>
                <button
                  onClick={exportToPDF}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaDownload className="mr-2" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-5 w-5 text-gray-400" />
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
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaFilter className="mr-2" />
                      Filters
                    </button>
                  </div>
                </div>
                
                {/* Filter Panel */}
                {showFilters && (
                  <div className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                        <select
                          value={positionFilter}
                          onChange={(e) => setPositionFilter(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
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
                )}
              </div>

              {/* Add/Edit Player Form */}
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
                          setNewPlayer({
                            name: '',
                            position: '',
                            age: '',
                            email: '',
                            matches: 0,
                            goals: 0,
                            assists: 0
                          });
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

                        <div className="sm:col-span-2">
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

                        <div className="sm:col-span-2">
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

                        <div className="sm:col-span-2">
                          <label htmlFor="matches" className="block text-sm font-medium text-gray-300">
                            Matches
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="matches"
                              id="matches"
                              value={newPlayer.matches}
                              onChange={(e) => setNewPlayer({...newPlayer, matches: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="goals" className="block text-sm font-medium text-gray-300">
                            Goals
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="goals"
                              id="goals"
                              value={newPlayer.goals}
                              onChange={(e) => setNewPlayer({...newPlayer, goals: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="assists" className="block text-sm font-medium text-gray-300">
                            Assists
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="assists"
                              id="assists"
                              value={newPlayer.assists}
                              onChange={(e) => setNewPlayer({...newPlayer, assists: e.target.value})}
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
                            setNewPlayer({
                              name: '',
                              position: '',
                              age: '',
                              email: '',
                              matches: 0,
                              goals: 0,
                              assists: 0
                            });
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

              {/* Chart View */}
              {viewMode === 'charts' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Players by Position */}
                  <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">Players by Position</h3>
                    <div className="h-64">
                      <Pie data={positionData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>

                  {/* Top Scorers */}
                  <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4">Top Scorers</h3>
                    <div className="h-64">
                      <Bar data={topScorersData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>

                  {/* Assists */}
                  <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700 lg:col-span-2">
                    <h3 className="text-lg font-medium text-white mb-4">Player Assists</h3>
                    <div className="h-64">
                      <Line data={assistsData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <>
                  {/* Players Table */}
                  <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-white">Team Players</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-400">List of all players in your team with their statistics</p>
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
                                  Player Name {getSortIcon('name')}
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
                              <th 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                                onClick={() => handleSort('matches')}
                              >
                                <div className="flex items-center">
                                  Matches {getSortIcon('matches')}
                                </div>
                              </th>
                              <th 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                                onClick={() => handleSort('goals')}
                              >
                                <div className="flex items-center">
                                  Goals {getSortIcon('goals')}
                                </div>
                              </th>
                              <th 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                                onClick={() => handleSort('assists')}
                              >
                                <div className="flex items-center">
                                  Assists {getSortIcon('assists')}
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredPlayers.map((player) => (
                              <tr key={player.id} className="hover:bg-gray-700">
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
                                      <div className="text-sm text-gray-400">{player.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
                                    {player.position}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">{player.age}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">{player.matches}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">{player.goals}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">{player.assists}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button 
                                      onClick={() => handleViewPlayer(player)}
                                      className="text-blue-400 hover:text-blue-300"
                                      title="View"
                                    >
                                      <FaEye />
                                    </button>
                                    <button 
                                      onClick={() => handleEditPlayer(player)}
                                      className="text-yellow-400 hover:text-yellow-300"
                                      title="Edit"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button 
                                      onClick={() => handleRemovePlayer(player.id)}
                                      className="text-red-400 hover:text-red-300"
                                      title="Delete"
                                    >
                                      <FaTrash />
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

                  {/* Player Stats Summary */}
                  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                            <FaUsers className="h-6 w-6 text-white" />
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

                    <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                            <FaChartBar className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-400 truncate">Avg. Goals</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-white">
                                  {(players.reduce((sum, player) => sum + player.goals, 0) / players.length).toFixed(1)}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                            <FaChartBar className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-400 truncate">Avg. Assists</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-white">
                                  {(players.reduce((sum, player) => sum + player.assists, 0) / players.length).toFixed(1)}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                            <FaChartBar className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-400 truncate">Avg. Matches</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-white">
                                  {(players.reduce((sum, player) => sum + player.matches, 0) / players.length).toFixed(1)}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoachPlayers;