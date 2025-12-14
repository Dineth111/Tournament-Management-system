import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, FaChartLine, FaChartPie, FaUsers, FaTrophy, FaCalendarAlt, 
  FaFlag, FaUserTie, FaGavel, FaUsersCog, FaDownload, FaFilter, FaSearch,
  FaUser, FaBell, FaMedal, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';

const Reports = () => {
  const [reportData, setReportData] = useState({
    totalUsers: 0,
    totalTournaments: 0,
    totalMatches: 0,
    totalTeams: 0,
    activeTournaments: 0,
    upcomingMatches: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('month');
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for charts
  const userData = [
    { name: 'Jan', users: 40 },
    { name: 'Feb', users: 60 },
    { name: 'Mar', users: 80 },
    { name: 'Apr', users: 70 },
    { name: 'May', users: 90 },
    { name: 'Jun', users: 120 },
  ];

  const tournamentData = [
    { name: 'Q1', tournaments: 4, matches: 12 },
    { name: 'Q2', tournaments: 6, matches: 18 },
    { name: 'Q3', tournaments: 8, matches: 24 },
    { name: 'Q4', tournaments: 5, matches: 15 },
  ];

  const roleData = [
    { name: 'Players', value: 45 },
    { name: 'Judges', value: 12 },
    { name: 'Coaches', value: 18 },
    { name: 'Organizers', value: 8 },
  ];

  const activityData = [
    { date: '2025-06-01', registrations: 12, tournaments: 2 },
    { date: '2025-06-02', registrations: 8, tournaments: 1 },
    { date: '2025-06-03', registrations: 15, tournaments: 3 },
    { date: '2025-06-04', registrations: 5, tournaments: 1 },
    { date: '2025-06-05', registrations: 18, tournaments: 2 },
    { date: '2025-06-06', registrations: 10, tournaments: 1 },
    { date: '2025-06-07', registrations: 14, tournaments: 3 },
  ];

  const COLORS = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  const CHART_COLORS = ['#ef4444', '#f97316', '#10b981', '#8b5cf6', '#06b6d4', '#f59e0b'];

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        setReportData({
          totalUsers: 142,
          totalTournaments: 24,
          totalMatches: 87,
          totalTeams: 32,
          activeTournaments: 5,
          upcomingMatches: 12
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch report data');
      setLoading(false);
    }
  };

  const exportReport = () => {
    // In a real application, this would export the report data
    alert('Report exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">System overview and statistics</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center">
              <FaTimesCircle className="mr-3 text-red-400" />
              {error}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="block px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <button 
              onClick={exportReport}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
            >
              <FaDownload className="mr-2" />
              Export Report
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User Type</label>
                <select className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300">
                  <option>All Users</option>
                  <option>Players</option>
                  <option>Judges</option>
                  <option>Coaches</option>
                  <option>Organizers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Category</label>
                <select className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300">
                  <option>All Categories</option>
                  <option>Black Belt</option>
                  <option>Brown Belt</option>
                  <option>Blue Belt</option>
                  <option>Green Belt</option>
                  <option>Youth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                <select className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-5 py-6 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl p-4 shadow-lg">
                  <FaUsers className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Total Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">{reportData.totalUsers}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Tournaments Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-5 py-6 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl p-4 shadow-lg">
                  <FaTrophy className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Total Tournaments</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">{reportData.totalTournaments}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Matches Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-5 py-6 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl p-4 shadow-lg">
                  <FaCalendarAlt className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Total Matches</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">{reportData.totalMatches}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Teams Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-5 py-6 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl p-4 shadow-lg">
                  <FaFlag className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Total Teams</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">{reportData.totalTeams}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Active Tournaments Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-5 py-6 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl p-4 shadow-lg">
                  <FaCheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Active Tournaments</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">{reportData.activeTournaments}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Matches Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-5 py-6 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl p-4 shadow-lg">
                  <FaBell className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Upcoming Matches</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">{reportData.upcomingMatches}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">User Growth</h3>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaDownload />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      borderColor: '#374151', 
                      color: 'white',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Users" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tournament & Matches Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Tournaments & Matches</h3>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaDownload />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tournamentData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      borderColor: '#374151', 
                      color: 'white',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend />
                  <Bar dataKey="tournaments" fill="#ef4444" name="Tournaments" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="matches" fill="#f59e0b" name="Matches" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Section Continued */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Roles Distribution */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">User Roles Distribution</h3>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaDownload />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      borderColor: '#374151', 
                      color: 'white',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Recent Activity</h3>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaDownload />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      borderColor: '#374151', 
                      color: 'white',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" stroke="#ef4444" activeDot={{ r: 8 }} name="Registrations" />
                  <Line type="monotone" dataKey="tournaments" stroke="#f59e0b" name="Tournaments" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <button className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaDownload />
            </button>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-700">
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                      <FaTrophy className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">New tournament created</p>
                    <p className="text-sm text-gray-400">Summer Championship 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                      <FaUsers className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">New player registered</p>
                    <p className="text-sm text-gray-400">John Smith (Black Belt)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">5 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                      <FaCalendarAlt className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">Match scheduled</p>
                    <p className="text-sm text-gray-400">Black Belt Kata Finals</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">1 day ago</p>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                      <FaGavel className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">New judge assigned</p>
                    <p className="text-sm text-gray-400">Sensei Yamamoto</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">2 days ago</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;