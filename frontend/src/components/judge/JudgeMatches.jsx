import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaTrophy, FaFilter, FaSearch, 
  FaCheckCircle, FaClock, FaPlay, FaFlag, 
  FaMedal, FaStar, FaChartBar, FaUsers,
  FaSort, FaSortUp, FaSortDown, FaInfoCircle
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

const JudgeMatches = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });

  useEffect(() => {
    // Simulate fetching matches data
    setTimeout(() => {
      setMatches([
        { 
          id: 1, 
          tournament: 'Summer Championship',
          team1: 'Team Alpha',
          team2: 'Team Beta',
          date: '2023-07-20',
          time: '14:00',
          venue: 'Central Stadium',
          status: 'Upcoming',
          assigned: true
        },
        { 
          id: 2, 
          tournament: 'Summer Championship',
          team1: 'Team Gamma',
          team2: 'Team Delta',
          date: '2023-07-20',
          time: '16:30',
          venue: 'Central Stadium',
          status: 'Upcoming',
          assigned: true
        },
        { 
          id: 3, 
          tournament: 'Summer Championship',
          team1: 'Team Epsilon',
          team2: 'Team Zeta',
          date: '2023-07-21',
          time: '10:00',
          venue: 'North Field',
          status: 'Completed',
          assigned: true,
          score: '2-1',
          result: 'Team Epsilon won'
        },
        { 
          id: 4, 
          tournament: 'Spring League',
          team1: 'Team Alpha',
          team2: 'Team Gamma',
          date: '2023-04-25',
          time: '15:00',
          venue: 'Central Stadium',
          status: 'Completed',
          assigned: true,
          score: '3-2',
          result: 'Team Alpha won'
        },
        { 
          id: 5, 
          tournament: 'Winter Cup',
          team1: 'Team Beta',
          team2: 'Team Delta',
          date: '2023-12-10',
          time: '11:00',
          venue: 'East Arena',
          status: 'Scheduled',
          assigned: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-900 text-blue-300';
      case 'Completed': return 'bg-green-900 text-green-300';
      case 'Scheduled': return 'bg-yellow-900 text-yellow-300';
      case 'In Progress': return 'bg-purple-900 text-purple-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Upcoming': return <FaClock className="mr-1" />;
      case 'Completed': return <FaCheckCircle className="mr-1" />;
      case 'Scheduled': return <FaClock className="mr-1" />;
      case 'In Progress': return <FaPlay className="mr-1" />;
      default: return <FaClock className="mr-1" />;
    }
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="ml-1 text-white" /> : 
      <FaSortDown className="ml-1 text-white" />;
  };

  const filteredMatches = matches.filter(match => {
    const matchesFilter = filter === 'all' || match.status === filter;
    const matchesSearch = searchTerm === '' || 
      match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.tournament.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleScoreMatch = (matchId) => {
    // In a real app, this would open a modal or navigate to a scoring page
    alert(`Score match ${matchId}`);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Chart data for match status distribution
  const statusData = {
    labels: ['Upcoming', 'Completed', 'Scheduled'],
    datasets: [
      {
        data: [
          matches.filter(m => m.status === 'Upcoming').length,
          matches.filter(m => m.status === 'Completed').length,
          matches.filter(m => m.status === 'Scheduled').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for matches by tournament
  const tournamentData = {
    labels: ['Summer Championship', 'Spring League', 'Winter Cup'],
    datasets: [
      {
        label: 'Matches',
        data: [
          matches.filter(m => m.tournament === 'Summer Championship').length,
          matches.filter(m => m.tournament === 'Spring League').length,
          matches.filter(m => m.tournament === 'Winter Cup').length
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
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
            <h1 className="text-3xl font-bold leading-tight text-white flex items-center">
              <FaFlag className="mr-3 text-red-500" />
              Matches
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
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

                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                        <FaClock className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Upcoming</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {matches.filter(m => m.status === 'Upcoming').length}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                        <FaCheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Completed</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {matches.filter(m => m.status === 'Completed').length}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                        <FaUsers className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Tournaments</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {[...new Set(matches.map(m => m.tournament))].length}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Status Distribution Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-red-500" />
                    Match Status Distribution
                  </h3>
                  <div className="h-64">
                    <Pie 
                      data={statusData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            labels: {
                              color: '#9CA3AF'
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>

                {/* Matches by Tournament Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaTrophy className="mr-2 text-red-500" />
                    Matches by Tournament
                  </h3>
                  <div className="h-64">
                    <Bar 
                      data={tournamentData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            ticks: {
                              color: '#9CA3AF',
                              beginAtZero: true
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          },
                          x: {
                            ticks: {
                              color: '#9CA3AF'
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
              </div>

              {/* Filter and Search Controls */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex-1 max-w-md">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-600 rounded-md bg-gray-800 text-white"
                        placeholder="Search matches..."
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                        filter === 'all'
                          ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FaFlag className="mr-2" />
                      All Matches
                    </button>
                    <button
                      onClick={() => setFilter('Upcoming')}
                      className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                        filter === 'Upcoming'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FaClock className="mr-2" />
                      Upcoming
                    </button>
                    <button
                      onClick={() => setFilter('Completed')}
                      className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                        filter === 'Completed'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FaCheckCircle className="mr-2" />
                      Completed
                    </button>
                  </div>
                </div>
              </div>

              {/* Matches List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Match List</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    List of all matches you are assigned to judge
                  </p>
                </div>
                <div className="border-t border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 flex items-center"
                            onClick={() => handleSort('tournament')}
                          >
                            Tournament
                            {getSortIcon('tournament')}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Match
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 flex items-center"
                            onClick={() => handleSort('date')}
                          >
                            Date & Time
                            {getSortIcon('date')}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Venue
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {sortedMatches.map((match) => (
                          <tr key={match.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{match.tournament}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-red-400">
                                {match.team1} <span className="text-gray-400">vs</span> {match.team2}
                              </div>
                              {match.status === 'Completed' && match.score && (
                                <div className="text-sm text-gray-400">Score: {match.score}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-300">
                                <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400" />
                                <div>
                                  <div>{match.date}</div>
                                  <div className="text-gray-400">{match.time}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300 flex items-center">
                                <FaInfoCircle className="mr-1 text-gray-400" />
                                {match.venue}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                                {getStatusIcon(match.status)}
                                {match.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {match.status === 'Upcoming' && (
                                <button
                                  onClick={() => handleScoreMatch(match.id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <FaStar className="mr-1" />
                                  Score Match
                                </button>
                              )}
                              {match.status === 'Completed' && (
                                <button
                                  onClick={() => alert(`View report for match ${match.id}`)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600"
                                >
                                  <FaChartBar className="mr-1" />
                                  View Report
                                </button>
                              )}
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

export default JudgeMatches;