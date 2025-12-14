import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaTrophy, FaCalendarAlt, FaChartBar, FaDownload, FaFilter, FaSearch, FaPlus, FaEdit, FaTrash,
  FaUserFriends, FaUserTie, FaGavel, FaFlag, FaUsersCog, FaMedal, FaBell, FaChartLine, FaCogs, FaUserShield
} from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    players: 0,
    judges: 0,
    coaches: 0,
    organizers: 0,
    tournaments: 0,
    matches: 0,
    teams: 0,
    categories: 0
  });
  
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for charts
  const tournamentData = [
    { name: 'Jan', tournaments: 4, matches: 12 },
    { name: 'Feb', tournaments: 6, matches: 18 },
    { name: 'Mar', tournaments: 8, matches: 24 },
    { name: 'Apr', tournaments: 5, matches: 15 },
    { name: 'May', tournaments: 9, matches: 27 },
    { name: 'Jun', tournaments: 12, matches: 36 },
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
    // Simulate fetching stats
    setTimeout(() => {
      setStats({
        players: 142,
        judges: 24,
        coaches: 18,
        organizers: 12,
        tournaments: 36,
        matches: 218,
        teams: 32,
        categories: 8
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

  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Expert Karate - Admin Dashboard Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add stats summary
    doc.setFontSize(16);
    doc.text('System Statistics', 20, 45);
    
    doc.setFontSize(12);
    doc.text(`Total Players: ${stats.players}`, 20, 55);
    doc.text(`Total Tournaments: ${stats.tournaments}`, 20, 65);
    doc.text(`Total Matches: ${stats.matches}`, 20, 75);
    doc.text(`Total Teams: ${stats.teams}`, 20, 85);
    
    // Save the PDF
    doc.save('admin-dashboard-report.pdf');
  };

  const filteredData = tournamentData.filter(item => {
    if (!filter) return true;
    return item.name.toLowerCase().includes(filter.toLowerCase());
  });

  // Quick action cards data
  const quickActions = [
    { title: 'Manage Users', icon: <FaUsers className="h-6 w-6" />, path: '/admin/users', color: 'from-purple-600 to-indigo-600' },
    { title: 'Manage Tournaments', icon: <FaTrophy className="h-6 w-6" />, path: '/admin/tournaments', color: 'from-red-600 to-orange-600' },
    { title: 'Manage Matches', icon: <FaCalendarAlt className="h-6 w-6" />, path: '/admin/matches', color: 'from-blue-600 to-cyan-600' },
    { title: 'Manage Teams', icon: <FaUserFriends className="h-6 w-6" />, path: '/admin/teams', color: 'from-green-600 to-emerald-600' },
    { title: 'Manage Players', icon: <FaUserTie className="h-6 w-6" />, path: '/admin/players', color: 'from-yellow-600 to-amber-600' },
    { title: 'Manage Judges', icon: <FaGavel className="h-6 w-6" />, path: '/admin/judges', color: 'from-pink-600 to-rose-600' },
    { title: 'Manage Categories', icon: <FaFlag className="h-6 w-6" />, path: '/admin/categories', color: 'from-teal-600 to-cyan-600' },
    { title: 'View Reports', icon: <FaChartBar className="h-6 w-6" />, path: '/admin/reports', color: 'from-indigo-600 to-violet-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  <FaTrophy className="text-white text-xl" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-400">Expert Karate Tournament Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/admin/profile')}
                className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaUserShield className="mr-1" />
                Profile
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
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
            <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
            <p className="text-gray-400">Manage your karate tournament system</p>
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
          <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
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
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-5 py-6 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl p-4 shadow-lg">
                  <FaUsers className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Total Players</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">{stats.players}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

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
                      <div className="text-3xl font-bold text-white">{stats.tournaments}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

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
                      <div className="text-3xl font-bold text-white">{stats.matches}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="px-5 py-6 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl p-4 shadow-lg">
                  <FaUserFriends className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Total Teams</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">{stats.teams}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Tournaments & Matches Overview</h3>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaDownload />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
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

          {/* Pie Chart */}
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
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(action.path)}
                className={`flex flex-col items-center justify-center p-6 bg-gradient-to-br ${action.color} rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg`}
              >
                <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-full p-3 mb-3">
                  {action.icon}
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-white">{action.title}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <button className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaDownload />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activityData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
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
                <Area type="monotone" dataKey="registrations" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Registrations" />
                <Area type="monotone" dataKey="tournaments" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Tournaments" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <button className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaPlus />
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
      </main>
    </div>
  );
};

export default AdminDashboard;