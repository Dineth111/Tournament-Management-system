import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaUserFriends, FaTrophy, FaChartBar, FaSave, FaTimes } from 'react-icons/fa';
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

const OrganizerTeams = ({ user }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    coach: '',
    category: '',
    players: ''
  });

  useEffect(() => {
    // Simulate fetching teams data
    setTimeout(() => {
      setTeams([
        { 
          id: 1, 
          name: 'Team Alpha', 
          coach: 'Michael Johnson',
          category: 'U18 Male',
          players: 18,
          tournaments: 3
        },
        { 
          id: 2, 
          name: 'Team Beta', 
          coach: 'Sarah Williams',
          category: 'U18 Male',
          players: 16,
          tournaments: 2
        },
        { 
          id: 3, 
          name: 'Team Gamma', 
          coach: 'David Brown',
          category: 'U18 Male',
          players: 17,
          tournaments: 1
        },
        { 
          id: 4, 
          name: 'Team Delta', 
          coach: 'Jennifer Davis',
          category: 'U18 Female',
          players: 15,
          tournaments: 2
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddTeam = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to add the team
    const team = {
      id: teams.length + 1,
      ...newTeam,
      tournaments: 0
    };
    setTeams([...teams, team]);
    setNewTeam({ name: '', coach: '', category: '', players: '' });
    setShowAddTeam(false);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowEditTeam(true);
  };

  const handleUpdateTeam = (e) => {
    e.preventDefault();
    setTeams(teams.map(team => team.id === editingTeam.id ? editingTeam : team));
    setShowEditTeam(false);
    setEditingTeam(null);
  };

  const handleDeleteTeam = (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(team => team.id !== id));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTeam(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTeamsByCategoryData = () => {
    const categories = [...new Set(teams.map(team => team.category))];
    const data = categories.map(category => 
      teams.filter(team => team.category === category).length
    );
    
    return {
      labels: categories,
      datasets: [
        {
          label: 'Teams by Category',
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

  const getTeamsByTournamentsData = () => {
    const tournamentCounts = [...new Set(teams.map(team => team.tournaments))];
    const data = tournamentCounts.map(count => 
      teams.filter(team => team.tournaments === count).length
    );
    
    return {
      labels: tournamentCounts.map(count => `${count} tournament${count !== 1 ? 's' : ''}`),
      datasets: [
        {
          label: 'Teams by Tournaments',
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
                <FaUsers className="mr-2 text-indigo-400" /> Teams
              </h1>
              <button
                onClick={() => setShowAddTeam(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2" /> Add Team
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Add Team Form */}
              {showAddTeam && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaPlus className="mr-2 text-indigo-400" /> Add New Team
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleAddTeam} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Team Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={newTeam.name}
                              onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="coach" className="block text-sm font-medium text-gray-300">
                            Coach Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="coach"
                              id="coach"
                              value={newTeam.coach}
                              onChange={(e) => setNewTeam({...newTeam, coach: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
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
                              value={newTeam.category}
                              onChange={(e) => setNewTeam({...newTeam, category: e.target.value})}
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
                          <label htmlFor="players" className="block text-sm font-medium text-gray-300">
                            Number of Players
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="players"
                              id="players"
                              value={newTeam.players}
                              onChange={(e) => setNewTeam({...newTeam, players: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddTeam(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" /> Add Team
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Team Form */}
              {showEditTeam && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaEdit className="mr-2 text-indigo-400" /> Edit Team
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleUpdateTeam} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300">
                            Team Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="edit-name"
                              value={editingTeam?.name || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-coach" className="block text-sm font-medium text-gray-300">
                            Coach Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="coach"
                              id="edit-coach"
                              value={editingTeam?.coach || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
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
                              value={editingTeam?.category || ''}
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
                          <label htmlFor="edit-players" className="block text-sm font-medium text-gray-300">
                            Number of Players
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="players"
                              id="edit-players"
                              value={editingTeam?.players || ''}
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
                          onClick={() => setShowEditTeam(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" /> Update Team
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Teams List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                <ul className="divide-y divide-gray-700">
                  {teams.map((team) => (
                    <li key={team.id} className="hover:bg-gray-750">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-medium text-indigo-300 truncate flex items-center">
                                <FaUsers className="mr-2" /> {team.name}
                              </p>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-200">
                                {team.category}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Coach: {team.coach}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                {team.players} players
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-3 text-sm text-gray-400">
                              {team.tournaments} tournaments
                            </div>
                            <button
                              onClick={() => handleEditTeam(team)}
                              className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 mr-2"
                            >
                              <FaEdit className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              <FaTrash className="mr-1" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Charts Section */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <FaChartBar className="mr-2 text-indigo-400" /> Teams Analytics
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Teams by Category</h3>
                    <div className="h-64">
                      <Pie data={getTeamsByCategoryData()} options={chartOptions} />
                    </div>
                  </div>
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Teams by Tournaments</h3>
                    <div className="h-64">
                      <Bar data={getTeamsByTournamentsData()} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Teams Stats */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white">Teams Overview</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                          <FaUsers className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Teams</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">{teams.length}</div>
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
                          <FaUserFriends className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Avg. Players</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {teams.length > 0 
                                  ? Math.round(teams.reduce((sum, team) => sum + team.players, 0) / teams.length)
                                  : 0}
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
                          <FaTrophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Categories</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {[...new Set(teams.map(team => team.category))].length}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Tournaments</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {teams.reduce((sum, team) => sum + team.tournaments, 0)}
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

export default OrganizerTeams;