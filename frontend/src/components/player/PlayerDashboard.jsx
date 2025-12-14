import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaCalendarAlt, FaUsers, FaDownload, FaFilter, FaSearch, FaMedal, FaStar, FaUser, FaCrown, FaFlag, FaFutbol } from 'react-icons/fa';
import jsPDF from 'jspdf';

const PlayerDashboard = ({ user, onLogout }) => {
  console.log('PlayerDashboard component rendered with props:', { user, onLogout });
  
  const navigate = useNavigate();
  const [playerStats, setPlayerStats] = useState({
    tournaments: 12,
    matches: 42,
    wins: 28,
    losses: 14,
    rank: 3,
    belt: 'Black Belt'
  });
  
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Expert Karate - Player Performance Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add player info
    doc.setFontSize(16);
    doc.text(`Player: ${user?.name || 'Player'}`, 20, 45);
    doc.text(`Belt Rank: ${playerStats.belt}`, 20, 55);
    doc.text(`Current Rank: #${playerStats.rank}`, 20, 65);
    
    // Add stats summary
    doc.setFontSize(14);
    doc.text('Performance Statistics', 20, 80);
    
    doc.setFontSize(12);
    doc.text(`Total Tournaments: ${playerStats.tournaments}`, 20, 90);
    doc.text(`Total Matches: ${playerStats.matches}`, 20, 100);
    doc.text(`Wins: ${playerStats.wins}`, 20, 110);
    doc.text(`Losses: ${playerStats.losses}`, 20, 120);
    doc.text(`Win Rate: ${playerStats.wins + playerStats.losses > 0 
      ? Math.round((playerStats.wins / (playerStats.wins + playerStats.losses)) * 100) 
      : 0}%`, 20, 130);
    
    // Save the PDF
    doc.save(`player-report-${(user?.name || 'player').replace(/\s+/g, '-')}.pdf`);
  };

  // Test if component is rendering
  console.log('PlayerDashboard rendering with user:', user);

  // Handle case where user is undefined or missing critical data
  if (!user || !user.id) {
    console.log('No valid user data, showing error state');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Error</h2>
          <p className="text-gray-400 mb-4">Unable to load player dashboard. Please log in again.</p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
          >
            <FaUser className="mr-2" />
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering full dashboard');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">Player Dashboard</h1>
                <p className="text-sm text-gray-400">Expert Karate Tournament Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/player/profile')}
                className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaUser className="mr-1" />
                Profile
              </button>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">Player: {user?.name || 'Player'}</p>
                <p className="text-sm text-gray-400">{user?.email || 'player@example.com'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaUser className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mr-4">
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'Player'}!</h2>
              <p className="text-gray-400">Track your karate tournament progress</p>
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-red-600 to-yellow-500 text-white mr-2">
                  <FaCrown className="mr-1" /> {playerStats.belt}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                  <FaTrophy className="mr-1" /> Rank #{playerStats.rank}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
            <button
              onClick={exportToPDF}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
            >
              <FaDownload className="mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Search tournaments..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-gray-800 overflow-hidden shadow rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-lg p-3">
                  <FaTrophy className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Tournaments</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{playerStats.tournaments}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-lg p-3">
                  <FaCalendarAlt className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Matches</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{playerStats.matches}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-green-600 to-teal-500 rounded-lg p-3">
                  <FaMedal className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Wins</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{playerStats.wins}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-3">
                  <FaFlag className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Losses</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{playerStats.losses}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg p-3">
                  <FaCrown className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Rank</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">#{playerStats.rank}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 shadow rounded-xl p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <FaStar className="mr-2 text-yellow-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleNavigation('/player/tournaments')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-red-500 transform hover:-translate-y-1"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-4">
                <FaTrophy className="h-8 w-8 text-white" />
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-lg font-medium text-white">My Tournaments</h4>
                <p className="text-sm text-gray-400 mt-1">View registered tournaments</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/player/team')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-red-500 transform hover:-translate-y-1"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full p-4">
                <FaUsers className="h-8 w-8 text-white" />
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-lg font-medium text-white">My Team</h4>
                <p className="text-sm text-gray-400 mt-1">View team information</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/player/matches')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-red-500 transform hover:-translate-y-1"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-green-600 to-teal-500 rounded-full p-4">
                <FaCalendarAlt className="h-8 w-8 text-white" />
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-lg font-medium text-white">My Matches</h4>
                <p className="text-sm text-gray-400 mt-1">View upcoming matches</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 shadow rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <FaFutbol className="mr-2 text-green-500" />
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="divide-y divide-gray-700">
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                      <FaMedal className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium text-white">Won match against Team Beta</p>
                    <p className="text-sm text-gray-400">Black Belt Kumite</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">
                      Victory
                    </span>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <FaTrophy className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium text-white">Registered for Summer Championship</p>
                    <p className="text-sm text-gray-400">Tournament Registration</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-300">
                      Registration
                    </span>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                      <FaCalendarAlt className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium text-white">Match scheduled for tomorrow</p>
                    <p className="text-sm text-gray-400">Brown Belt Kata Finals</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-900 text-yellow-300">
                      Scheduled
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerDashboard;