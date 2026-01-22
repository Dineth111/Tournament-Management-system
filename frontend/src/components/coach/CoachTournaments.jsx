import React, { useState, useEffect } from 'react';
import { 
  FaTrophy, FaChartBar, FaFilter, FaSearch, FaEye, FaMedal, 
  FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, 
  FaTimesCircle, FaMinusCircle, FaStar
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

const CoachTournaments = ({ user }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate fetching tournaments data
    setTimeout(() => {
      setTournaments([
        { 
          id: 1, 
          name: 'Summer Championship', 
          date: '2023-07-15', 
          status: 'Ongoing',
          category: 'U18 Male',
          team: 'Team Alpha',
          matches: 12,
          wins: 8,
          losses: 3,
          draws: 1
        },
        { 
          id: 2, 
          name: 'Winter Cup', 
          date: '2023-12-10', 
          status: 'Registered',
          category: 'U18 Male',
          team: 'Team Alpha',
          matches: 0,
          wins: 0,
          losses: 0,
          draws: 0
        },
        { 
          id: 3, 
          name: 'Spring League', 
          date: '2023-04-20', 
          status: 'Completed',
          category: 'U18 Male',
          team: 'Team Alpha',
          matches: 10,
          wins: 7,
          losses: 2,
          draws: 1
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Chart data for tournament status
  const statusData = {
    labels: ['Ongoing', 'Registered', 'Completed'],
    datasets: [
      {
        label: 'Tournaments by Status',
        data: [
          tournaments.filter(t => t.status === 'Ongoing').length,
          tournaments.filter(t => t.status === 'Registered').length,
          tournaments.filter(t => t.status === 'Completed').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // Blue for ongoing
          'rgba(251, 191, 36, 0.8)',   // Yellow for registered
          'rgba(34, 197, 94, 0.8)'     // Green for completed
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for performance across tournaments
  const performanceData = {
    labels: tournaments.map(t => t.name),
    datasets: [
      {
        label: 'Wins',
        data: tournaments.map(t => t.wins),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Losses',
        data: tournaments.map(t => t.losses),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Draws',
        data: tournaments.map(t => t.draws),
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for matches played
  const matchesData = {
    labels: tournaments.map(t => t.name),
    datasets: [
      {
        label: 'Matches Played',
        data: tournaments.map(t => t.matches),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing': return 'bg-blue-100 text-blue-800';
      case 'Registered': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesFilter = filter === 'all' ? true : tournament.status === filter;
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
              <h1 className="text-3xl font-bold leading-tight text-white">Tournaments</h1>
              <div className="flex space-x-3">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Search tournaments..."
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Status</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Registered">Registered</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Tournaments by Status */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Tournaments by Status</h3>
                  <div className="h-64">
                    <Pie data={statusData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Performance Across Tournaments */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Performance Across Tournaments</h3>
                  <div className="h-64">
                    <Bar data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Matches Played Over Time */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Matches Played</h3>
                  <div className="h-64">
                    <Line data={matchesData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>

              {/* Tournaments List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Tournament List</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">List of all tournaments your team is participating in</p>
                </div>
                <ul className="divide-y divide-gray-700">
                  {filteredTournaments.map((tournament) => (
                    <li key={tournament.id} className="hover:bg-gray-700">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-medium text-red-400 truncate">
                                {tournament.name}
                              </p>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
                                {tournament.status}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                {tournament.date}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaUsers className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                {tournament.category}
                              </div>
                            </div>
                            <div className="mt-2 flex space-x-4">
                              <div className="flex items-center text-sm text-gray-400">
                                <FaCheckCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" />
                                Wins: {tournament.wins}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <FaTimesCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-500" />
                                Losses: {tournament.losses}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <FaMinusCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-yellow-500" />
                                Draws: {tournament.draws}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600">
                              <FaEye className="mr-2" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tournament Stats */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white">Team Performance</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                          <FaTrophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Tournaments</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">{tournaments.length}</div>
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
                          <FaCheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Wins</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {tournaments.reduce((sum, t) => sum + t.wins, 0)}
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
                          <FaTimesCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Losses</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {tournaments.reduce((sum, t) => sum + t.losses, 0)}
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
                          <FaStar className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Win Rate</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {tournaments.reduce((sum, t) => sum + t.matches, 0) > 0
                                  ? Math.round((tournaments.reduce((sum, t) => sum + t.wins, 0) / 
                                      tournaments.reduce((sum, t) => sum + t.matches, 0)) * 100)
                                  : 0}%
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

export default CoachTournaments;