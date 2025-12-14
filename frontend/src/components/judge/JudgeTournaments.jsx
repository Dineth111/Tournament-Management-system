import React, { useState, useEffect } from 'react';
import { 
  FaTrophy, FaFilter, FaSearch, FaCheckCircle, 
  FaClock, FaCalendarAlt, FaUsers, FaChartBar, 
  FaMedal, FaStar, FaList, FaFlag, FaInfoCircle,
  FaSort, FaSortUp, FaSortDown
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

const JudgeTournaments = ({ user }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });

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
          assigned: true,
          matches: 12,
          completed: 8,
          startDate: '2023-07-15',
          endDate: '2023-07-25',
          venue: 'Central Stadium'
        },
        { 
          id: 2, 
          name: 'Winter Cup', 
          date: '2023-12-10', 
          status: 'Upcoming',
          category: 'U18 Male',
          assigned: true,
          matches: 0,
          completed: 0,
          startDate: '2023-12-10',
          endDate: '2023-12-20',
          venue: 'North Field'
        },
        { 
          id: 3, 
          name: 'Spring League', 
          date: '2023-04-20', 
          status: 'Completed',
          category: 'U18 Male',
          assigned: true,
          matches: 10,
          completed: 10,
          startDate: '2023-04-20',
          endDate: '2023-05-10',
          venue: 'East Arena'
        },
        { 
          id: 4, 
          name: 'Autumn Invitational', 
          date: '2023-09-05', 
          status: 'Upcoming',
          category: 'U16 Female',
          assigned: true,
          matches: 0,
          completed: 0,
          startDate: '2023-09-05',
          endDate: '2023-09-15',
          venue: 'Central Stadium'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing': return 'bg-blue-900 text-blue-300';
      case 'Upcoming': return 'bg-yellow-900 text-yellow-300';
      case 'Completed': return 'bg-green-900 text-green-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ongoing': return <FaClock className="mr-1" />;
      case 'Upcoming': return <FaClock className="mr-1" />;
      case 'Completed': return <FaCheckCircle className="mr-1" />;
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

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesFilter = filter === 'all' || tournament.status === filter;
    const matchesSearch = searchTerm === '' || 
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Chart data for tournament status distribution
  const statusData = {
    labels: ['Ongoing', 'Upcoming', 'Completed'],
    datasets: [
      {
        data: [
          tournaments.filter(t => t.status === 'Ongoing').length,
          tournaments.filter(t => t.status === 'Upcoming').length,
          tournaments.filter(t => t.status === 'Completed').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)'
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

  // Chart data for matches progress
  const progressData = {
    labels: tournaments.map(t => t.name),
    datasets: [
      {
        label: 'Completed',
        data: tournaments.map(t => t.completed),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: tournaments.map(t => t.matches - t.completed),
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Chart data for tournaments over time
  const timelineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Tournaments',
        data: [0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
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
              <FaTrophy className="mr-3 text-red-500" />
              Tournaments
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
                          <dt className="text-sm font-medium text-gray-400 truncate">Total Tournaments</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">{tournaments.length}</div>
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
                          <dt className="text-sm font-medium text-gray-400 truncate">Ongoing</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {tournaments.filter(t => t.status === 'Ongoing').length}
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
                              {tournaments.filter(t => t.status === 'Completed').length}
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
                          <dt className="text-sm font-medium text-gray-400 truncate">Total Matches</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {tournaments.reduce((sum, t) => sum + t.matches, 0)}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Status Distribution Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-red-500" />
                    Tournament Status
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

                {/* Progress Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaMedal className="mr-2 text-red-500" />
                    Matches Progress
                  </h3>
                  <div className="h-64">
                    <Bar 
                      data={progressData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            labels: {
                              color: '#9CA3AF'
                            }
                          }
                        },
                        scales: {
                          y: {
                            stacked: true,
                            ticks: {
                              color: '#9CA3AF',
                              beginAtZero: true
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          },
                          x: {
                            stacked: true,
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

                {/* Timeline Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaCalendarAlt className="mr-2 text-red-500" />
                    Tournaments Timeline
                  </h3>
                  <div className="h-64">
                    <Line 
                      data={timelineData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            labels: {
                              color: '#9CA3AF'
                            }
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
                        placeholder="Search tournaments..."
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
                      <FaTrophy className="mr-2" />
                      All Tournaments
                    </button>
                    <button
                      onClick={() => setFilter('Ongoing')}
                      className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                        filter === 'Ongoing'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FaClock className="mr-2" />
                      Ongoing
                    </button>
                    <button
                      onClick={() => setFilter('Upcoming')}
                      className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                        filter === 'Upcoming'
                          ? 'bg-yellow-600 text-white'
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

              {/* Tournaments List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Tournament List</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    List of all tournaments you are assigned to judge
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
                            onClick={() => handleSort('name')}
                          >
                            Tournament
                            {getSortIcon('name')}
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 flex items-center"
                            onClick={() => handleSort('category')}
                          >
                            Category
                            {getSortIcon('category')}
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 flex items-center"
                            onClick={() => handleSort('date')}
                          >
                            Date
                            {getSortIcon('date')}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Progress
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
                        {sortedTournaments.map((tournament) => (
                          <tr key={tournament.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{tournament.name}</div>
                              <div className="text-sm text-gray-400">{tournament.startDate} to {tournament.endDate}</div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center">
                                <FaInfoCircle className="mr-1" />
                                {tournament.venue}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">{tournament.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-300">
                                <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400" />
                                {tournament.date}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">
                                {tournament.completed}/{tournament.matches} matches
                              </div>
                              <div className="mt-1 w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-red-600 to-yellow-500 h-2 rounded-full" 
                                  style={{ width: tournament.matches > 0 ? `${(tournament.completed / tournament.matches) * 100}%` : '0%' }}
                                ></div>
                              </div>
                              {tournament.matches > 0 && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {Math.round((tournament.completed / tournament.matches) * 100)}% complete
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
                                {getStatusIcon(tournament.status)}
                                {tournament.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => alert(`View details for ${tournament.name}`)}
                                className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600"
                              >
                                <FaList className="mr-1" />
                                View Details
                              </button>
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

export default JudgeTournaments;