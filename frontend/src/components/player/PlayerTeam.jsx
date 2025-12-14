import React, { useState, useEffect } from 'react';
import { FaUsers, FaUser, FaChartBar, FaTrophy, FaMedal, FaFlag, FaStar } from 'react-icons/fa';
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

const PlayerTeam = ({ user }) => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  
  // Chart data
  const [chartData, setChartData] = useState({
    performance: {
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
    positions: {
      labels: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
      datasets: [
        {
          label: 'Players',
          data: [0, 0, 0, 0],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }
      ]
    }
  });

  useEffect(() => {
    // Simulate fetching team data
    setTimeout(() => {
      const teamInfo = {
        name: 'Team Alpha',
        coach: 'Michael Johnson',
        category: 'U18 Male',
        founded: '2015',
        wins: 12,
        losses: 3,
        draws: 1
      };
      
      const playerData = [
        { id: 1, name: 'John Doe', position: 'Forward', age: 22 },
        { id: 2, name: 'Jane Smith', position: 'Midfielder', age: 21 },
        { id: 3, name: 'Robert Brown', position: 'Defender', age: 23 },
        { id: 4, name: 'Emily Davis', position: 'Goalkeeper', age: 20 },
        { id: 5, name: 'David Wilson', position: 'Midfielder', age: 22 },
        { id: 6, name: 'Sarah Johnson', position: 'Forward', age: 21 }
      ];
      
      setTeamData(teamInfo);
      setPlayers(playerData);
      setLoading(false);
      
      // Update chart data
      setChartData({
        performance: {
          labels: ['Wins', 'Losses', 'Draws'],
          datasets: [
            {
              data: [teamInfo.wins, teamInfo.losses, teamInfo.draws],
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
        positions: {
          labels: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
          datasets: [
            {
              label: 'Players',
              data: [
                playerData.filter(p => p.position === 'Forward').length,
                playerData.filter(p => p.position === 'Midfielder').length,
                playerData.filter(p => p.position === 'Defender').length,
                playerData.filter(p => p.position === 'Goalkeeper').length
              ],
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }
          ]
        }
      });
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }
  
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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <FaUsers className="text-red-500 text-3xl mr-3" />
              <h1 className="text-3xl font-bold leading-tight text-white">My Team</h1>
            </div>
            <p className="text-gray-400">View your team information and player details</p>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Team Performance Chart */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-blue-500" />
                    Team Performance
                  </h3>
                  <div className="h-64">
                    <Pie data={chartData.performance} options={pieChartOptions} />
                  </div>
                </div>
                
                {/* Player Positions Chart */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaUser className="mr-2 text-green-500" />
                    Player Positions
                  </h3>
                  <div className="h-64">
                    <Bar data={chartData.positions} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              {/* Team Info Card */}
              <div className="bg-gray-800 shadow-lg overflow-hidden sm:rounded-xl mb-8 border border-gray-700">
                <div className="px-6 py-5 sm:px-6 border-b border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                    <FaUsers className="mr-2 text-red-500" />
                    Team Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">Details about your team</p>
                </div>
                <div className="">
                  <dl>
                    <div className="bg-gray-750 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaTrophy className="mr-2" />
                        Team Name
                      </dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{teamData?.name}</dd>
                    </div>
                    <div className="bg-gray-800 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaUser className="mr-2" />
                        Coach
                      </dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{teamData?.coach}</dd>
                    </div>
                    <div className="bg-gray-750 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaFlag className="mr-2" />
                        Category
                      </dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{teamData?.category}</dd>
                    </div>
                    <div className="bg-gray-800 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaStar className="mr-2" />
                        Founded
                      </dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{teamData?.founded}</dd>
                    </div>
                    <div className="bg-gray-750 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaMedal className="mr-2" />
                        Record
                      </dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                        <span className="font-bold text-green-500">{teamData?.wins}</span> Wins - 
                        <span className="font-bold text-red-500">{teamData?.losses}</span> Losses - 
                        <span className="font-bold text-yellow-500">{teamData?.draws}</span> Draws
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Team Players */}
              <div className="bg-gray-800 shadow-lg overflow-hidden sm:rounded-xl border border-gray-700">
                <div className="px-6 py-5 sm:px-6 border-b border-gray-700">
                  <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                    <FaUsers className="mr-2 text-blue-500" />
                    Team Players
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">List of players in your team</p>
                </div>
                <div className="">
                  <ul className="divide-y divide-gray-700">
                    {players.map((player) => (
                      <li key={player.id} className="hover:bg-gray-750 transition-colors duration-200">
                        <div className="px-6 py-4 flex items-center sm:px-6">
                          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                            <div className="truncate">
                              <div className="flex text-sm items-center">
                                <FaUser className="text-gray-500 mr-2" />
                                <p className="font-medium text-white truncate">{player.name}</p>
                                <p className="ml-2 flex-shrink-0 font-normal text-gray-400 bg-gray-700 px-2 py-1 rounded-md">{player.position}</p>
                              </div>
                              <div className="mt-2 flex items-center">
                                <div className="flex items-center text-sm text-gray-400">
                                  <FaStar className="text-gray-500 mr-2" />
                                  Age: {player.age}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-5 flex-shrink-0 text-gray-500">
                            <FaFlag />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlayerTeam;