import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, FaTrophy, FaCalendarAlt, FaChartBar, FaDownload, 
  FaFilter, FaSearch, FaMedal, FaStar, FaUsers, FaClock, 
  FaCheckCircle, FaExclamationCircle, FaPlus, FaList, 
  FaFileAlt, FaUser, FaSignOutAlt, FaChartLine, FaChartPie,
  FaInfoCircle
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
import jsPDF from 'jspdf';

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

const JudgeDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [judgeStats, setJudgeStats] = useState({
    tournaments: 0,
    matches: 0,
    completed: 0,
    pending: 0
  });
  
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  useEffect(() => {
    // Simulate fetching judge stats
    setTimeout(() => {
      setJudgeStats({
        tournaments: 5,
        matches: 24,
        completed: 18,
        pending: 6
      });
      
      // Set up performance data for charts
      setPerformanceData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Matches Judged',
            data: [3, 5, 4, 6, 7, 8, 6],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          }
        ]
      });
      
      // Set up upcoming matches
      setUpcomingMatches([
        { 
          id: 1, 
          teams: 'Team Alpha vs Team Beta',
          time: 'Today at 3:00 PM',
          venue: 'Court 1',
          status: 'Pending',
          tournament: 'Summer Championship'
        },
        { 
          id: 2, 
          teams: 'Team Gamma vs Team Delta',
          time: 'Tomorrow at 10:00 AM',
          venue: 'Court 2',
          status: 'Scheduled',
          tournament: 'Summer Championship'
        },
        { 
          id: 3, 
          teams: 'Team Epsilon vs Team Zeta',
          time: 'Tomorrow at 2:00 PM',
          venue: 'Court 3',
          status: 'Scheduled',
          tournament: 'Winter Cup'
        }
      ]);
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
    doc.text('Expert Karate - Judge Performance Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add judge info
    doc.setFontSize(16);
    doc.text(`Judge: ${user?.name}`, 20, 45);
    
    // Add stats summary
    doc.setFontSize(14);
    doc.text('Judging Statistics', 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Total Tournaments: ${judgeStats.tournaments}`, 20, 70);
    doc.text(`Total Matches: ${judgeStats.matches}`, 20, 80);
    doc.text(`Completed: ${judgeStats.completed}`, 20, 90);
    doc.text(`Pending: ${judgeStats.pending}`, 20, 100);
    
    // Save the PDF
    doc.save(`judge-report-${user?.name.replace(/\s+/g, '-')}.pdf`);
  };

  // Chart data for match status distribution
  const statusData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [judgeStats.completed, judgeStats.pending],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(241, 196, 15, 0.8)'
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(241, 196, 15, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-900 text-yellow-300';
      case 'Scheduled': return 'bg-blue-900 text-blue-300';
      case 'Completed': return 'bg-green-900 text-green-300';
      default: return 'bg-gray-900 text-gray-300';
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
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Judge Dashboard</h1>
                <p className="text-sm text-gray-400">Expert Karate Tournament Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/judge/profile')}
                className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaUser className="mr-1" />
                Profile
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gray-700 rounded-full p-2">
                  <FaUser className="text-gray-300" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">Judge: {user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaSignOutAlt className="mr-2" />
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
            <h2 className="text-2xl font-bold text-white">Welcome back, Judge {user?.name}!</h2>
            <p className="text-gray-400">Ready to judge your next match?</p>
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
                    placeholder="Search matches..."
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
                      <div className="text-2xl font-semibold text-white">{judgeStats.tournaments}</div>
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
                    <dt className="text-sm font-medium text-gray-400 truncate">Total Matches</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{judgeStats.matches}</div>
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
                      <div className="text-2xl font-semibold text-white">{judgeStats.completed}</div>
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
                    <dt className="text-sm font-medium text-gray-400 truncate">Pending</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{judgeStats.pending}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Performance Chart */}
          <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700 lg:col-span-2">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <FaChartLine className="mr-2 text-red-500" />
              Judging Performance
            </h3>
            <div className="h-64">
              {performanceData && (
                <Line 
                  data={performanceData} 
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
                          color: '#9CA3AF'
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
              )}
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <FaChartPie className="mr-2 text-red-500" />
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
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 shadow rounded-lg p-6 mb-8 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">Judging Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleNavigation('/judge/tournaments')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaTrophy className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Tournaments</h4>
                <p className="text-xs text-gray-400 mt-1">View assignments</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/judge/matches')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaCalendarAlt className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Matches</h4>
                <p className="text-xs text-gray-400 mt-1">Score matches</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/judge/schedule')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaClock className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Schedule</h4>
                <p className="text-xs text-gray-400 mt-1">View calendar</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('/judge/reports')}
              className="flex flex-col items-center justify-center p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600 hover:border-red-500"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3">
                <FaFileAlt className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-medium text-white">Reports</h4>
                <p className="text-xs text-gray-400 mt-1">View reports</p>
              </div>
            </button>
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white flex items-center">
              <FaCalendarAlt className="mr-2 text-red-500" />
              Upcoming Matches to Judge
            </h3>
            <button 
              onClick={() => handleNavigation('/judge/matches')}
              className="text-gray-400 hover:text-white flex items-center text-sm"
            >
              <FaList className="mr-1" /> View All
            </button>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-700">
              {upcomingMatches.map((match) => (
                <li key={match.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-md bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{match.id}</span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{match.teams}</p>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <FaInfoCircle className="mr-1 text-gray-500" />
                        {match.tournament}
                      </div>
                      <p className="text-sm text-gray-400">{match.time} • {match.venue}</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                        {match.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JudgeDashboard;