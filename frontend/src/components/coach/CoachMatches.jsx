import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaTrophy, FaChartBar, FaEye, FaEdit, FaPlus, 
  FaFilter, FaSearch, FaMedal, FaStar, FaClock, FaMapMarkerAlt,
  FaCheckCircle, FaTimesCircle, FaMinusCircle
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

const CoachMatches = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate fetching matches data
    setTimeout(() => {
      setMatches([
        { 
          id: 1, 
          tournament: 'Summer Championship',
          opponent: 'Team Beta',
          date: '2023-07-20',
          time: '14:00',
          venue: 'Central Stadium',
          status: 'Upcoming',
          result: null,
          score: null
        },
        { 
          id: 2, 
          tournament: 'Summer Championship',
          opponent: 'Team Gamma',
          date: '2023-07-15',
          time: '16:30',
          venue: 'Central Stadium',
          status: 'Completed',
          result: 'Win',
          score: '3-1'
        },
        { 
          id: 3, 
          tournament: 'Summer Championship',
          opponent: 'Team Delta',
          date: '2023-07-10',
          time: '10:00',
          venue: 'Central Stadium',
          status: 'Completed',
          result: 'Loss',
          score: '1-2'
        },
        { 
          id: 4, 
          tournament: 'Spring League',
          opponent: 'Team Epsilon',
          date: '2023-04-25',
          time: '15:00',
          venue: 'North Field',
          status: 'Completed',
          result: 'Win',
          score: '2-0'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Chart data for match results
  const resultsData = {
    labels: ['Wins', 'Losses', 'Draws'],
    datasets: [
      {
        label: 'Match Results',
        data: [
          matches.filter(m => m.result === 'Win').length,
          matches.filter(m => m.result === 'Loss').length,
          matches.filter(m => m.result === 'Draw').length
        ],
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

  // Chart data for matches by tournament
  const tournamentData = {
    labels: [...new Set(matches.map(m => m.tournament))],
    datasets: [
      {
        label: 'Matches per Tournament',
        data: [...new Set(matches.map(m => m.tournament))].map(tournament => 
          matches.filter(m => m.tournament === tournament).length
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for performance over time
  const performanceData = {
    labels: matches.filter(m => m.status === 'Completed').map(m => m.date),
    datasets: [
      {
        label: 'Performance',
        data: matches.filter(m => m.status === 'Completed').map(m => 
          m.result === 'Win' ? 3 : m.result === 'Draw' ? 1 : 0
        ),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'Win': return 'bg-green-100 text-green-800';
      case 'Loss': return 'bg-red-100 text-red-800';
      case 'Draw': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesFilter = filter === 'all' ? true : match.status === filter;
    const matchesSearch = match.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.tournament.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (matchId) => {
    // In a real app, this would navigate to a match details page
    alert(`View details for match ${matchId}`);
  };

  const handleEditLineup = (matchId) => {
    // In a real app, this would open a lineup editor
    alert(`Edit lineup for match ${matchId}`);
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
              <h1 className="text-3xl font-bold leading-tight text-white">Matches</h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Filter Controls */}
              {showFilters && (
                <div className="mb-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          placeholder="Search matches..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="all">All Matches</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Match Results Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Match Results</h3>
                  <div className="h-64">
                    <Pie data={resultsData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Matches by Tournament */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Matches by Tournament</h3>
                  <div className="h-64">
                    <Bar data={tournamentData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Performance Over Time */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Performance Over Time</h3>
                  <div className="h-64">
                    <Line data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>

              {/* Matches List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Match Schedule</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">List of all matches for your team</p>
                </div>
                <ul className="divide-y divide-gray-700">
                  {filteredMatches.map((match) => (
                    <li key={match.id} className="hover:bg-gray-700">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-medium text-red-400 truncate">
                                vs {match.opponent}
                              </p>
                              {match.status === 'Completed' && match.result && (
                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultColor(match.result)}`}>
                                  {match.result}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 truncate">
                              {match.tournament}
                            </p>
                            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                {match.date} at {match.time}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                {match.venue}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {match.status === 'Upcoming' && (
                              <button
                                onClick={() => handleEditLineup(match.id)}
                                className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-full text-white bg-gray-700 hover:bg-gray-600"
                              >
                                <FaEdit className="mr-1" />
                                Edit Lineup
                              </button>
                            )}
                            {match.status === 'Completed' && match.score && (
                              <span className="text-lg font-bold text-white">
                                {match.score}
                              </span>
                            )}
                            <button
                              onClick={() => handleViewDetails(match.id)}
                              className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-full text-white bg-gray-700 hover:bg-gray-600"
                            >
                              <FaEye className="mr-1" />
                              View
                            </button>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                              {match.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Match Stats */}
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
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Matches</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">{matches.length}</div>
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
                            <dt className="text-sm font-medium text-gray-400 truncate">Wins</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {matches.filter(m => m.result === 'Win').length}
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
                            <dt className="text-sm font-medium text-gray-400 truncate">Losses</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {matches.filter(m => m.result === 'Loss').length}
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
                          <FaMinusCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Draws</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {matches.filter(m => m.result === 'Draw').length}
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

export default CoachMatches;