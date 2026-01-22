import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaTrophy, FaCalendarAlt, FaChartBar, FaDownload, FaFilter, FaSearch, 
  FaMedal, FaStar, FaPlus, FaEye, FaEdit, FaChartLine, FaDumbbell, FaRunning 
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
import jsPDF from 'jspdf';

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

const CoachDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [coachStats, setCoachStats] = useState({
    team: 'Team Alpha',
    players: 0,
    tournaments: 0,
    wins: 0,
    losses: 0
  });
  
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingTraining, setUpcomingTraining] = useState([]);

  useEffect(() => {
    // Simulate fetching coach stats
    setTimeout(() => {
      setCoachStats({
        team: 'Team Alpha',
        players: 12,
        tournaments: 6,
        wins: 18,
        losses: 8
      });
      
      // Simulate recent matches
      setRecentMatches([
        { id: 1, opponent: 'Team Beta', result: 'Win', score: '3-1', date: '2023-07-20' },
        { id: 2, opponent: 'Team Gamma', result: 'Loss', score: '1-2', date: '2023-07-15' },
        { id: 3, opponent: 'Team Delta', result: 'Win', score: '2-0', date: '2023-07-10' }
      ]);
      
      // Simulate upcoming training
      setUpcomingTraining([
        { id: 1, title: 'Tactical Training', date: '2023-07-25', time: '10:00 AM' },
        { id: 2, title: 'Fitness Session', date: '2023-07-27', time: '4:00 PM' }
      ]);
    }, 1000);
  }, []);

  // Chart data for performance
  const performanceData = {
    labels: ['Wins', 'Losses', 'Draws'],
    datasets: [
      {
        label: 'Team Performance',
        data: [coachStats.wins, coachStats.losses, 2], // Assuming 2 draws
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

  // Chart data for player positions
  const playerPositionData = {
    labels: ['Forwards', 'Midfielders', 'Defenders', 'Goalkeepers'],
    datasets: [
      {
        label: 'Players by Position',
        data: [4, 4, 3, 1],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

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
    doc.text('Expert Karate - Coach Performance Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add coach info
    doc.setFontSize(16);
    doc.text(`Coach: ${user?.name}`, 20, 45);
    doc.text(`Team: ${coachStats.team}`, 20, 55);
    
    // Add stats summary
    doc.setFontSize(14);
    doc.text('Team Performance Statistics', 20, 70);
    
    doc.setFontSize(12);
    doc.text(`Total Players: ${coachStats.players}`, 20, 80);
    doc.text(`Total Tournaments: ${coachStats.tournaments}`, 20, 90);
    doc.text(`Wins: ${coachStats.wins}`, 20, 100);
    doc.text(`Losses: ${coachStats.losses}`, 20, 110);
    doc.text(`Win Rate: ${coachStats.wins + coachStats.losses > 0 
      ? Math.round((coachStats.wins / (coachStats.wins + coachStats.losses)) * 100) 
      : 0}%`, 20, 120);
    
    // Save the PDF
    doc.save(`coach-report-${user?.name.replace(/\s+/g, '-')}.pdf`);
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'Win': return 'text-green-500';
      case 'Loss': return 'text-red-500';
      default: return 'text-yellow-500';
    }
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
                  <FaUsers className="text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Coach Dashboard</h1>
                <p className="text-sm text-gray-400">Expert Karate Tournament Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/coach/profile')}
                className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaUsers className="mr-1" />
                Profile
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-white">Coach: {user?.name}</p>
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
            <h2 className="text-2xl font-bold text-white">Welcome back, Coach {user?.name}!</h2>
            <p className="text-gray-400">Managing {coachStats.team}</p>
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
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
                      <div className="text-2xl font-semibold text-white">{coachStats.players}</div>
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
                  <FaTrophy className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Tournaments</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{coachStats.tournaments}</div>
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
                  <FaMedal className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Wins</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{coachStats.wins}</div>
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
                  <FaStar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Losses</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{coachStats.losses}</div>
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
                  <FaChartBar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Win Rate</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">
                        {coachStats.wins + coachStats.losses > 0 
                          ? Math.round((coachStats.wins / (coachStats.wins + coachStats.losses)) * 100) 
                          : 0}%
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
          {/* Performance Chart */}
          <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Team Performance</h3>
            <div className="h-64">
              <Pie data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Player Positions Chart */}
          <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Players by Position</h3>
            <div className="h-64">
              <Bar data={playerPositionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 shadow rounded-lg p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">Manage Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <button
              onClick={() => handleNavigation('/coach/team')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaUsers className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Team</h4>
                <p className="text-xs text-gray-400 mt-1">View team</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/coach/players')}
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
              onClick={() => handleNavigation('/coach/tournaments')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaTrophy className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Tournaments</h4>
                <p className="text-xs text-gray-400 mt-1">View performance</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/coach/matches')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaCalendarAlt className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Matches</h4>
                <p className="text-xs text-gray-400 mt-1">Manage matches</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/coach/training')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaChartBar className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Training</h4>
                <p className="text-xs text-gray-400 mt-1">Schedule sessions</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity and Upcoming Training */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Matches */}
          <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Recent Matches</h3>
              <button 
                onClick={() => handleNavigation('/coach/matches')}
                className="text-sm text-red-400 hover:text-red-300 flex items-center"
              >
                <FaEye className="mr-1" /> View All
              </button>
            </div>
            <div className="flow-root">
              <ul className="divide-y divide-gray-700">
                {recentMatches.map((match) => (
                  <li key={match.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                            <FaMedal className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-white">vs {match.opponent}</p>
                          <p className="text-sm text-gray-400">{match.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`mr-2 font-medium ${getResultColor(match.result)}`}>
                          {match.result}
                        </span>
                        <span className="text-sm text-gray-400">{match.score}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Upcoming Training */}
          <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Upcoming Training</h3>
              <button 
                onClick={() => handleNavigation('/coach/training')}
                className="text-sm text-red-400 hover:text-red-300 flex items-center"
              >
                <FaEye className="mr-1" /> View All
              </button>
            </div>
            <div className="flow-root">
              <ul className="divide-y divide-gray-700">
                {upcomingTraining.map((session) => (
                  <li key={session.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <FaRunning className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-white">{session.title}</p>
                          <p className="text-sm text-gray-400">{session.date}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {session.time}
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
  );
};

export default CoachDashboard;