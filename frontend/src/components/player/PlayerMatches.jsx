import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTrophy, FaChartBar, FaFilter, FaMedal, FaFlag, FaFutbol, FaStar } from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const PlayerMatches = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Chart data
  const [chartData, setChartData] = useState({
    results: {
      labels: ['Wins', 'Losses', 'Draws'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)'
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
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
    }
  });

  useEffect(() => {
    // Simulate fetching matches data
    setTimeout(() => {
      const matchData = [
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
      ];
      
      setMatches(matchData);
      setLoading(false);
      
      // Update chart data
      const wins = matchData.filter(m => m.result === 'Win').length;
      const losses = matchData.filter(m => m.result === 'Loss').length;
      const draws = matchData.filter(m => m.result === 'Draw').length;
      
      setChartData({
        results: {
          labels: ['Wins', 'Losses', 'Draws'],
          datasets: [
            {
              data: [wins, losses, draws],
              backgroundColor: [
                'rgba(16, 185, 129, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(245, 158, 11, 0.8)'
              ],
              borderColor: [
                'rgba(16, 185, 129, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
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
        }
      });
    }, 1000);
  }, []);

  const getResultColor = (result) => {
    switch (result) {
      case 'Win': return 'bg-green-900 text-green-300';
      case 'Loss': return 'bg-red-900 text-red-300';
      case 'Draw': return 'bg-yellow-900 text-yellow-300';
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
  
  const lineChartOptions = {
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

  const filteredMatches = filter === 'all' 
    ? matches 
    : matches.filter(match => match.status === filter);

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
              <FaFutbol className="text-red-500 text-3xl mr-3" />
              <h1 className="text-3xl font-bold leading-tight text-white">Matches</h1>
            </div>
            <p className="text-gray-400">Track your match history and upcoming fixtures</p>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Results Distribution Chart */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-blue-500" />
                    Match Results
                  </h3>
                  <div className="h-64">
                    <Bar data={chartData.results} options={chartOptions} />
                  </div>
                </div>
                
                {/* Performance Chart */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaStar className="mr-2 text-yellow-500" />
                    Performance Trend
                  </h3>
                  <div className="h-64">
                    <Line data={chartData.performance} options={lineChartOptions} />
                  </div>
                </div>
              </div>
              
              {/* Filter Controls */}
              <div className="mb-6 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                      filter === 'all'
                        ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <FaFutbol className="mr-2" />
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
                    <FaCalendarAlt className="mr-2" />
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
                    <FaMedal className="mr-2" />
                    Completed
                  </button>
                </div>
              </div>

              {/* Matches List */}
              <div className="bg-gray-800 shadow-lg overflow-hidden sm:rounded-xl border border-gray-700">
                <ul className="divide-y divide-gray-700">
                  {filteredMatches.map((match) => (
                    <li key={match.id} className="hover:bg-gray-750 transition-colors duration-200">
                      <div className="px-6 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FaFlag className="text-red-500 mr-2" />
                                <p className="text-lg font-medium text-white truncate">
                                  vs {match.opponent}
                                </p>
                              </div>
                              {match.status === 'Completed' && match.result && (
                                <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getResultColor(match.result)}`}>
                                  <FaMedal className="mr-1" />
                                  {match.result}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center mt-1">
                              <FaTrophy className="text-gray-500 mr-2 text-sm" />
                              <p className="text-sm text-gray-400 truncate">
                                {match.tournament}
                              </p>
                            </div>
                            <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaCalendarAlt className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                                {match.date} at {match.time}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaFlag className="flex-shrink-0 mr-2 h-4 w-4 text-gray-500" />
                                {match.venue}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {match.status === 'Completed' && match.score && (
                              <span className="mr-3 text-xl font-bold text-white">
                                {match.score}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              match.status === 'Upcoming' 
                                ? 'bg-blue-900 text-blue-300' 
                                : 'bg-green-900 text-green-300'
                            }`}>
                              {match.status}
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

export default PlayerMatches;