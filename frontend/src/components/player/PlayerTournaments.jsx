import React, { useState, useEffect } from 'react';
import { FaTrophy, FaCalendarAlt, FaChartBar, FaFilter, FaSearch, FaMedal, FaStar, FaCrown, FaFlag, FaUsers } from 'react-icons/fa';
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

const PlayerTournaments = ({ user }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Chart data
  const [chartData, setChartData] = useState({
    statusDistribution: {
      labels: ['Upcoming', 'Registered', 'Completed'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    performance: {
      labels: ['Summer Championship', 'Winter Cup', 'Spring League', 'Autumn Tournament'],
      datasets: [
        {
          label: 'Performance Rating',
          data: [85, 78, 92, 88],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }
      ]
    }
  });

  useEffect(() => {
    // Simulate fetching tournaments data
    setTimeout(() => {
      const tournamentData = [
        { 
          id: 1, 
          name: 'Summer Championship', 
          date: '2023-07-15', 
          status: 'Upcoming',
          team: 'Team Alpha',
          category: 'U18 Male',
          registered: true
        },
        { 
          id: 2, 
          name: 'Winter Cup', 
          date: '2023-12-10', 
          status: 'Registered',
          team: 'Team Alpha',
          category: 'U18 Male',
          registered: true
        },
        { 
          id: 3, 
          name: 'Spring League', 
          date: '2023-04-20', 
          status: 'Completed',
          team: 'Team Alpha',
          category: 'U18 Male',
          registered: true,
          position: '1st'
        },
        { 
          id: 4, 
          name: 'Autumn Tournament', 
          date: '2023-09-05', 
          status: 'Completed',
          team: 'Team Alpha',
          category: 'U18 Male',
          registered: true,
          position: '3rd'
        }
      ];
      
      setTournaments(tournamentData);
      setLoading(false);
      
      // Update chart data
      const upcomingCount = tournamentData.filter(t => t.status === 'Upcoming').length;
      const registeredCount = tournamentData.filter(t => t.status === 'Registered').length;
      const completedCount = tournamentData.filter(t => t.status === 'Completed').length;
      
      setChartData({
        statusDistribution: {
          labels: ['Upcoming', 'Registered', 'Completed'],
          datasets: [
            {
              data: [upcomingCount, registeredCount, completedCount],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(16, 185, 129, 0.8)'
              ],
              borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(16, 185, 129, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        performance: {
          labels: ['Summer Championship', 'Winter Cup', 'Spring League', 'Autumn Tournament'],
          datasets: [
            {
              label: 'Performance Rating',
              data: [85, 78, 92, 88],
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }
          ]
        }
      });
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-900 text-blue-300';
      case 'Registered': return 'bg-yellow-900 text-yellow-300';
      case 'Completed': return 'bg-green-900 text-green-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };
  
  // Chart options
  const chartOptions = {
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
      x: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF'
        }
      }
    }
  };

  const filteredTournaments = filter === 'all' 
    ? tournaments 
    : tournaments.filter(tournament => tournament.status === filter);

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
            <div className="flex items-center mb-6">
              <FaTrophy className="text-red-500 text-3xl mr-3" />
              <h1 className="text-3xl font-bold leading-tight text-white">Tournaments</h1>
            </div>
            <p className="text-gray-400">Track your participation in various tournaments</p>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Status Distribution Chart */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-blue-500" />
                    Tournament Status Distribution
                  </h3>
                  <div className="h-64">
                    <Pie data={chartData.statusDistribution} options={pieChartOptions} />
                  </div>
                </div>
                
                {/* Performance Chart */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaStar className="mr-2 text-yellow-500" />
                    Performance Rating
                  </h3>
                  <div className="h-64">
                    <Bar data={chartData.performance} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              {/* Filter Controls */}
              <div className="mb-6 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                <div className="flex flex-wrap gap-2 mb-4">
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
                    onClick={() => setFilter('Upcoming')}
                    className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                      filter === 'Upcoming'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <FaCalendarAlt className="mr-2" />
                    Upcoming
                  </button>
                  <button
                    onClick={() => setFilter('Registered')}
                    className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                      filter === 'Registered'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <FaFlag className="mr-2" />
                    Registered
                  </button>
                  <button
                    onClick={() => setFilter('Completed')}
                    className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                      filter === 'Completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <FaMedal className="mr-2" />
                    Completed
                  </button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Tournaments List */}
              <div className="bg-gray-800 shadow-lg overflow-hidden sm:rounded-xl border border-gray-700">
                <ul className="divide-y divide-gray-700">
                  {filteredTournaments.map((tournament) => (
                    <li key={tournament.id} className="hover:bg-gray-750 transition-colors duration-200">
                      <div className="px-6 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <FaTrophy className="text-red-500 mr-3" />
                              <p className="text-lg font-medium text-white truncate">
                                {tournament.name}
                              </p>
                            </div>
                            <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaCalendarAlt className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                                {tournament.date}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaUsers className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                                {tournament.category}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaFlag className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                                {tournament.team}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {tournament.position && (
                              <span className="mr-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                <FaCrown className="mr-1" />
                                {tournament.position} Place
                              </span>
                            )}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
                              {tournament.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlayerTournaments;