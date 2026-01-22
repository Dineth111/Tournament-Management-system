import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaChartBar, FaPlus, FaEdit, FaTrash, FaEye, 
  FaRunning, FaDumbbell, FaClock, FaMapMarkerAlt, FaUsers,
  FaSave, FaTimes, FaFilter, FaSearch
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

const CoachTraining = ({ user }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showEditSession, setShowEditSession] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching training sessions data
    setTimeout(() => {
      setSessions([
        { 
          id: 1, 
          title: 'Tactical Training', 
          date: '2023-07-20', 
          time: '10:00',
          duration: '90 mins',
          location: 'Main Field',
          description: 'Focus on defensive positioning and set pieces',
          attendees: 18
        },
        { 
          id: 2, 
          title: 'Fitness Session', 
          date: '2023-07-22', 
          time: '16:00',
          duration: '60 mins',
          location: 'Gymnasium',
          description: 'Strength and conditioning workout',
          attendees: 20
        },
        { 
          id: 3, 
          title: 'Technical Skills', 
          date: '2023-07-25', 
          time: '14:00',
          duration: '120 mins',
          location: 'Training Pitch 1',
          description: 'Ball control and passing drills',
          attendees: 19
        },
        { 
          id: 4, 
          title: 'Match Preparation', 
          date: '2023-07-27', 
          time: '15:00',
          duration: '90 mins',
          location: 'Main Stadium',
          description: 'Preparation for upcoming match against Team Beta',
          attendees: 21
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Chart data for attendance
  const attendanceData = {
    labels: sessions.slice(0, 4).map(s => s.title),
    datasets: [
      {
        label: 'Attendance',
        data: sessions.slice(0, 4).map(s => s.attendees),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for session types
  const sessionTypesData = {
    labels: ['Tactical', 'Fitness', 'Technical', 'Match Prep'],
    datasets: [
      {
        label: 'Session Types',
        data: [
          sessions.filter(s => s.title.includes('Tactical')).length,
          sessions.filter(s => s.title.includes('Fitness')).length,
          sessions.filter(s => s.title.includes('Technical')).length,
          sessions.filter(s => s.title.includes('Preparation')).length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(147, 51, 234, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(147, 51, 234, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for attendance over time
  const attendanceOverTimeData = {
    labels: sessions.map(s => s.date),
    datasets: [
      {
        label: 'Attendance Over Time',
        data: sessions.map(s => s.attendees),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to add the session
    const session = {
      id: sessions.length + 1,
      ...newSession,
      attendees: 0
    };
    setSessions([...sessions, session]);
    setNewSession({ title: '', date: '', time: '', duration: '', location: '', description: '' });
    setShowAddSession(false);
  };

  const handleEditSession = (session) => {
    setCurrentSession(session);
    setNewSession({
      title: session.title,
      date: session.date,
      time: session.time,
      duration: session.duration,
      location: session.location,
      description: session.description
    });
    setShowEditSession(true);
  };

  const handleUpdateSession = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the session
    setSessions(sessions.map(session => 
      session.id === currentSession.id 
        ? { ...session, ...newSession } 
        : session
    ));
    setNewSession({ title: '', date: '', time: '', duration: '', location: '', description: '' });
    setShowEditSession(false);
    setCurrentSession(null);
  };

  const handleRemoveSession = (sessionId) => {
    // In a real app, this would make an API call to remove the session
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filter === 'all' ? true : 
      (filter === 'upcoming' && new Date(session.date) >= new Date()) ||
      (filter === 'past' && new Date(session.date) < new Date());
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold leading-tight text-white">Training Sessions</h1>
              <button
                onClick={() => setShowAddSession(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaPlus className="mr-2" />
                Add Session
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        placeholder="Search training sessions..."
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="block px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">All Sessions</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Attendance Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Session Attendance</h3>
                  <div className="h-64">
                    <Bar data={attendanceData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Session Types Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Session Types</h3>
                  <div className="h-64">
                    <Pie data={sessionTypesData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Attendance Over Time */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4">Attendance Over Time</h3>
                  <div className="h-64">
                    <Line data={attendanceOverTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>

              {/* Add/Edit Session Form */}
              {(showAddSession || showEditSession) && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-white">
                        {showEditSession ? 'Edit Training Session' : 'Add New Training Session'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddSession(false);
                          setShowEditSession(false);
                          setNewSession({ title: '', date: '', time: '', duration: '', location: '', description: '' });
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={showEditSession ? handleUpdateSession : handleAddSession} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                            Session Title
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="title"
                              id="title"
                              value={newSession.title}
                              onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="date" className="block text-sm font-medium text-gray-300">
                            Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              name="date"
                              id="date"
                              value={newSession.date}
                              onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="time" className="block text-sm font-medium text-gray-300">
                            Time
                          </label>
                          <div className="mt-1">
                            <input
                              type="time"
                              name="time"
                              id="time"
                              value={newSession.time}
                              onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-300">
                            Duration
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="duration"
                              id="duration"
                              value={newSession.duration}
                              onChange={(e) => setNewSession({...newSession, duration: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              placeholder="e.g., 90 mins"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                            Location
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="location"
                              id="location"
                              value={newSession.location}
                              onChange={(e) => setNewSession({...newSession, location: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                            Description
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="description"
                              name="description"
                              rows={3}
                              value={newSession.description}
                              onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddSession(false);
                            setShowEditSession(false);
                            setNewSession({ title: '', date: '', time: '', duration: '', location: '', description: '' });
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FaSave className="mr-2" />
                          {showEditSession ? 'Update Session' : 'Add Session'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Training Sessions List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Training Schedule</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">List of all scheduled training sessions for your team</p>
                </div>
                <ul className="divide-y divide-gray-700">
                  {filteredSessions.map((session) => (
                    <li key={session.id} className="hover:bg-gray-700">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-medium text-red-400 truncate">
                                {session.title}
                              </p>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-600 to-yellow-500 text-white">
                                <FaUsers className="mr-1" />
                                {session.attendees} players
                              </span>
                            </div>
                            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                {session.date} at {session.time} ({session.duration})
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                {session.location}
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                              {session.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditSession(session)}
                              className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600"
                            >
                              <FaEdit className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemoveSession(session.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              <FaTrash className="mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Training Stats */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white">Training Overview</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                          <FaCalendarAlt className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Sessions</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">{sessions.length}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                          <FaClock className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">This Week</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {sessions.filter(session => {
                                  const sessionDate = new Date(session.date);
                                  const today = new Date();
                                  const oneWeekFromNow = new Date();
                                  oneWeekFromNow.setDate(today.getDate() + 7);
                                  return sessionDate >= today && sessionDate <= oneWeekFromNow;
                                }).length}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                          <FaUsers className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Avg. Attendance</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {sessions.length > 0 
                                  ? Math.round(sessions.reduce((sum, session) => sum + session.attendees, 0) / sessions.length)
                                  : 0}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                          <FaRunning className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Hours</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {sessions.reduce((total, session) => {
                                  const duration = parseInt(session.duration);
                                  return total + (isNaN(duration) ? 0 : duration);
                                }, 0)}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoachTraining;