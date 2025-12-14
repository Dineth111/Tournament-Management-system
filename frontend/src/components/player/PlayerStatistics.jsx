import React, { useState, useEffect } from 'react';
import { FaChartBar, FaTrophy, FaFutbol, FaHandshake, FaFlag, FaClock } from 'react-icons/fa';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PlayerStatistics = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('season');
  
  // Chart data
  const [chartData, setChartData] = useState({
    performance: {
      labels: ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5'],
      datasets: [
        {
          label: 'Performance Rating',
          data: [75, 82, 78, 85, 88],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    contributions: {
      labels: ['Goals', 'Assists'],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)'
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    discipline: {
      labels: ['Yellow Cards', 'Red Cards'],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: [
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  });

  useEffect(() => {
    // Simulate fetching statistics data
    setTimeout(() => {
      const statData = {
        overall: {
          matches: 24,
          goals: 18,
          assists: 12,
          yellowCards: 3,
          redCards: 0,
          minutesPlayed: 1920
        },
        season: {
          matches: 8,
          goals: 7,
          assists: 5,
          yellowCards: 1,
          redCards: 0,
          minutesPlayed: 640
        },
        tournament: {
          name: 'Summer Championship',
          matches: 4,
          goals: 3,
          assists: 2,
          yellowCards: 0,
          redCards: 0,
          minutesPlayed: 320
        }
      };
      
      setStats(statData);
      setLoading(false);
      
      // Update chart data
      setChartData({
        performance: {
          labels: ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5'],
          datasets: [
            {
              label: 'Performance Rating',
              data: [75, 82, 78, 85, 88],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        contributions: {
          labels: ['Goals', 'Assists'],
          datasets: [
            {
              data: [statData[timeRange].goals, statData[timeRange].assists],
              backgroundColor: [
                'rgba(16, 185, 129, 0.8)',
                'rgba(59, 130, 246, 0.8)'
              ],
              borderColor: [
                'rgba(16, 185, 129, 1)',
                'rgba(59, 130, 246, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        discipline: {
          labels: ['Yellow Cards', 'Red Cards'],
          datasets: [
            {
              data: [statData[timeRange].yellowCards, statData[timeRange].redCards],
              backgroundColor: [
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
              ],
              borderColor: [
                'rgba(245, 158, 11, 1)',
                'rgba(239, 68, 68, 1)'
              ],
              borderWidth: 1
            }
          ]
        }
      });
    }, 1000);
  }, []);

  const statCards = [
    { name: 'Matches Played', value: stats ? stats[timeRange].matches : 0, icon: <FaFutbol className="text-blue-500" />, color: 'bg-blue-900' },
    { name: 'Goals', value: stats ? stats[timeRange].goals : 0, icon: <FaTrophy className="text-green-500" />, color: 'bg-green-900' },
    { name: 'Assists', value: stats ? stats[timeRange].assists : 0, icon: <FaHandshake className="text-indigo-500" />, color: 'bg-indigo-900' },
    { name: 'Yellow Cards', value: stats ? stats[timeRange].yellowCards : 0, icon: <FaFlag className="text-yellow-500" />, color: 'bg-yellow-900' },
    { name: 'Red Cards', value: stats ? stats[timeRange].redCards : 0, icon: <FaFlag className="text-red-500" />, color: 'bg-red-900' },
    { name: 'Minutes Played', value: stats ? stats[timeRange].minutesPlayed : 0, icon: <FaClock className="text-purple-500" />, color: 'bg-purple-900' }
  ];

  const goalsPerMatch = stats && stats[timeRange].matches > 0 ? (stats[timeRange].goals / stats[timeRange].matches).toFixed(2) : 0;
  const assistsPerMatch = stats && stats[timeRange].matches > 0 ? (stats[timeRange].assists / stats[timeRange].matches).toFixed(2) : 0;
  
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
              <FaChartBar className="text-red-500 text-3xl mr-3" />
              <h1 className="text-3xl font-bold leading-tight text-white">Statistics</h1>
            </div>
            <p className="text-gray-400">Track your performance metrics and statistics</p>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Time Range Selector */}
              <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <FaChartBar className="mr-2 text-blue-500" />
                  Time Range
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setTimeRange('overall')}
                    className={`px-5 py-2.5 text-sm font-medium rounded-full flex items-center transition-all duration-300 ${
                      timeRange === 'overall'
                        ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <FaChartBar className="mr-2" />
                    Overall
                  </button>
                  <button
                    onClick={() => setTimeRange('season')}
                    className={`px-5 py-2.5 text-sm font-medium rounded-full flex items-center transition-all duration-300 ${
                      timeRange === 'season'
                        ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <FaTrophy className="mr-2" />
                    This Season
                  </button>
                  <button
                    onClick={() => setTimeRange('tournament')}
                    className={`px-5 py-2.5 text-sm font-medium rounded-full flex items-center transition-all duration-300 ${
                      timeRange === 'tournament'
                        ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <FaFutbol className="mr-2" />
                    {stats?.tournament?.name || 'Current Tournament'}
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {statCards.map((stat) => (
                  <div key={stat.name} className="bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-700 transform transition-all duration-300 hover:scale-105">
                    <div className="px-5 py-6 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-2xl p-3 rounded-lg bg-gray-700">
                          {stat.icon}
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">{stat.name}</dt>
                            <dd className="flex items-baseline">
                              <div className="text-3xl font-bold text-white">{stat.value}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Performance Chart */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 lg:col-span-2">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-blue-500" />
                    Performance Trend
                  </h3>
                  <div className="h-64">
                    <Line data={chartData.performance} options={chartOptions} />
                  </div>
                </div>
                
                {/* Contributions Chart */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaTrophy className="mr-2 text-green-500" />
                    Contributions
                  </h3>
                  <div className="h-64">
                    <Pie data={chartData.contributions} options={pieChartOptions} />
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <FaChartBar className="mr-2 text-yellow-500" />
                  Performance Metrics
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-700 transform transition-all duration-300 hover:scale-105">
                    <div className="px-5 py-6 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-2xl p-3 rounded-lg bg-green-900">
                          <FaTrophy className="text-green-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Goals per Match</dt>
                            <dd className="flex items-baseline">
                              <div className="text-3xl font-bold text-white">{goalsPerMatch}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-700 transform transition-all duration-300 hover:scale-105">
                    <div className="px-5 py-6 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-2xl p-3 rounded-lg bg-indigo-900">
                          <FaHandshake className="text-indigo-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Assists per Match</dt>
                            <dd className="flex items-baseline">
                              <div className="text-3xl font-bold text-white">{assistsPerMatch}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-700 transform transition-all duration-300 hover:scale-105">
                    <div className="px-5 py-6 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-2xl p-3 rounded-lg bg-purple-900">
                          <FaChartBar className="text-purple-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Goal Participation</dt>
                            <dd className="flex items-baseline">
                              <div className="text-3xl font-bold text-white">
                                {stats ? stats[timeRange].goals + stats[timeRange].assists : 0}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discipline Chart */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 mb-8">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <FaFlag className="mr-2 text-red-500" />
                  Discipline Record
                </h3>
                <div className="h-64">
                  <Pie data={chartData.discipline} options={pieChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlayerStatistics;