import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaCalendarAlt, FaUsers, FaChartBar, FaDownload, FaFilter, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import jsPDF from 'jspdf';

const OrganizerDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [organizerStats, setOrganizerStats] = useState({
    tournaments: 0,
    teams: 0,
    players: 0,
    matches: 0
  });
  
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate fetching organizer stats
    setTimeout(() => {
      setOrganizerStats({
        tournaments: 8,
        teams: 32,
        players: 142,
        matches: 86
      });
    }, 1000);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Expert Karate - Organizer Dashboard Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add organizer info
    doc.setFontSize(16);
    doc.text(`Organizer: ${user?.name}`, 20, 45);
    
    // Add stats summary
    doc.setFontSize(14);
    doc.text('Tournament Statistics', 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Total Tournaments: ${organizerStats.tournaments}`, 20, 70);
    doc.text(`Total Teams: ${organizerStats.teams}`, 20, 80);
    doc.text(`Total Players: ${organizerStats.players}`, 20, 90);
    doc.text(`Total Matches: ${organizerStats.matches}`, 20, 100);
    
    // Save the PDF
    doc.save(`organizer-report-${user?.name.replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <FaTrophy className="text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Organizer Dashboard</h1>
                <p className="text-sm text-gray-400">Expert Karate Tournament Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/organizer/profile')}
                className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaUsers className="mr-1" />
                Profile
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-white">Organizer: {user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Controls */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h2>
            <p className="text-gray-400">Manage your karate tournaments</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
            <button
              onClick={exportToPDF}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                  <FaTrophy className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Tournaments</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{organizerStats.tournaments}</div>
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
                    <dt className="text-sm font-medium text-gray-400 truncate">Teams</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{organizerStats.teams}</div>
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
                    <dt className="text-sm font-medium text-gray-400 truncate">Players</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{organizerStats.players}</div>
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
                  <FaCalendarAlt className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Matches</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{organizerStats.matches}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 shadow rounded-lg p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">Manage Tournaments</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleNavigation('/organizer/tournaments')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaTrophy className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Tournaments</h4>
                <p className="text-xs text-gray-400 mt-1">Create & manage</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/organizer/teams')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaUsers className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Teams</h4>
                <p className="text-xs text-gray-400 mt-1">Manage teams</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/organizer/players')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaUsers className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Players</h4>
                <p className="text-xs text-gray-400 mt-1">Manage players</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/organizer/matches')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaCalendarAlt className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Matches</h4>
                <p className="text-xs text-gray-400 mt-1">Schedule & manage</p>
              </div>
            </button>
          </div>
        </div>

        {/* Upcoming Tournaments */}
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Upcoming Tournaments</h3>
            <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <FaPlus className="mr-1" />
              New Tournament
            </button>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-700">
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">Summer Championship</p>
                    <p className="text-sm text-gray-400">Starts in 3 days • 16 teams registered</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <FaEdit />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-gradient-to-r from-purple-600 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">W</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">Winter League</p>
                    <p className="text-sm text-gray-400">Starts in 2 weeks • 8 teams registered</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <FaEdit />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-gradient-to-r from-pink-600 to-rose-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Y</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">Youth Tournament</p>
                    <p className="text-sm text-gray-400">Starts in 1 month • Registration open</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <FaEdit />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <FaTrash />
                    </button>
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

export default OrganizerDashboard;