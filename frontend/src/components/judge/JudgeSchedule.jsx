import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaFilter, FaSearch, FaCheckCircle, 
  FaClock, FaUsers, FaChartBar, FaList, 
  FaTrophy, FaStar, FaMapMarkerAlt, FaInfoCircle
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

const JudgeSchedule = ({ user }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'

  useEffect(() => {
    // Simulate fetching schedule data
    setTimeout(() => {
      setSchedule([
        { 
          id: 1, 
          tournament: 'Summer Championship',
          team1: 'Team Alpha',
          team2: 'Team Beta',
          date: '2023-07-20',
          time: '14:00',
          venue: 'Central Stadium',
          status: 'Upcoming',
          category: 'U18 Male'
        },
        { 
          id: 2, 
          tournament: 'Summer Championship',
          team1: 'Team Gamma',
          team2: 'Team Delta',
          date: '2023-07-20',
          time: '16:30',
          venue: 'Central Stadium',
          status: 'Upcoming',
          category: 'U18 Male'
        },
        { 
          id: 3, 
          tournament: 'Summer Championship',
          team1: 'Team Epsilon',
          team2: 'Team Zeta',
          date: '2023-07-21',
          time: '10:00',
          venue: 'North Field',
          status: 'Upcoming',
          category: 'U18 Male'
        },
        { 
          id: 4, 
          tournament: 'Winter Cup',
          team1: 'Team Alpha',
          team2: 'Team Gamma',
          date: '2023-12-15',
          time: '15:00',
          venue: 'Central Stadium',
          status: 'Scheduled',
          category: 'U16 Female'
        },
        { 
          id: 5, 
          tournament: 'Spring League',
          team1: 'Team Beta',
          team2: 'Team Delta',
          date: '2023-04-25',
          time: '11:00',
          venue: 'East Arena',
          status: 'Completed',
          category: 'U18 Male',
          score: '2-1'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-900 text-blue-300';
      case 'Scheduled': return 'bg-yellow-900 text-yellow-300';
      case 'Completed': return 'bg-green-900 text-green-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Upcoming': return <FaClock className="mr-1" />;
      case 'Scheduled': return <FaClock className="mr-1" />;
      case 'Completed': return <FaCheckCircle className="mr-1" />;
      default: return <FaClock className="mr-1" />;
    }
  };

  const filteredSchedule = schedule.filter(match => {
    const matchesFilter = filter === 'all' || match.status === filter;
    const matchesSearch = searchTerm === '' || 
      match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (matchId) => {
    // In a real app, this would navigate to a match details page
    alert(`View details for match ${matchId}`);
  };

  // Chart data for match status distribution
  const statusData = {
    labels: ['Upcoming', 'Scheduled', 'Completed'],
    datasets: [
      {
        data: [
          schedule.filter(m => m.status === 'Upcoming').length,
          schedule.filter(m => m.status === 'Scheduled').length,
          schedule.filter(m => m.status === 'Completed').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for matches by venue
  const venueData = {
    labels: ['Central Stadium', 'North Field', 'East Arena'],
    datasets: [
      {
        label: 'Matches',
        data: [
          schedule.filter(m => m.venue === 'Central Stadium').length,
          schedule.filter(m => m.venue === 'North Field').length,
          schedule.filter(m => m.venue === 'East Arena').length
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Group matches by date for calendar view
  const groupedByDate = filteredSchedule.reduce((acc, match) => {
    const date = match.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {});

  // Get unique dates and sort them
  const sortedDates = Object.keys(groupedByDate).sort();

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
            <h1 className="text-3xl font-bold leading-tight text-white flex items-center">
              <FaCalendarAlt className="mr-3 text-red-500" />
              Schedule
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
                            <div className="text-2xl font-semibold text-white">{schedule.length}</div>
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
                          <dt className="text-sm font-medium text-gray-400 truncate">Upcoming</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {schedule.filter(m => m.status === 'Upcoming').length}
                            </div>
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
                            <div className="text-2xl font-semibold text-white">
                              {[...new Set(schedule.map(m => m.tournament))].length}
                            </div>
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
                        <FaMapMarkerAlt className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Venues</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {[...new Set(schedule.map(m => m.venue))].length}
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
                {/* Status Distribution Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-red-500" />
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

                {/* Matches by Venue Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    Matches by Venue
                  </h3>
                  <div className="h-64">
                    <Bar 
                      data={venueData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            ticks: {
                              color: '#9CA3AF',
                              beginAtZero: true
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
                  </div>
                </div>
              </div>

              {/* View Toggle and Filter Controls */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setView('calendar')}
                      className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                        view === 'calendar'
                          ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FaCalendarAlt className="mr-2" />
                      Calendar View
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${
                        view === 'list'
                          ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FaList className="mr-2" />
                      List View
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="max-w-md">
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-600 rounded-md bg-gray-800 text-white"
                          placeholder="Search schedule..."
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                          filter === 'all'
                            ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <FaList className="mr-2" />
                        All
                      </button>
                      <button
                        onClick={() => setFilter('Upcoming')}
                        className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                          filter === 'Upcoming'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <FaClock className="mr-2" />
                        Upcoming
                      </button>
                      <button
                        onClick={() => setFilter('Scheduled')}
                        className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                          filter === 'Scheduled'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <FaClock className="mr-2" />
                        Scheduled
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Content */}
              {view === 'calendar' ? (
                /* Calendar View */
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Calendar View</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-400">
                      Your judging schedule organized by date
                    </p>
                  </div>
                  <div className="border-t border-gray-700">
                    <div className="p-6">
                      {sortedDates.length > 0 ? (
                        <div className="space-y-8">
                          {sortedDates.map(date => (
                            <div key={date} className="border border-gray-700 rounded-lg">
                              <div className="bg-gray-700 px-4 py-3 rounded-t-lg">
                                <h4 className="text-lg font-medium text-white">
                                  {new Date(date).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </h4>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {groupedByDate[date].map(match => (
                                    <div 
                                      key={match.id} 
                                      className="bg-gray-750 border border-gray-600 rounded-lg p-4 hover:border-red-500 transition-colors cursor-pointer"
                                      onClick={() => handleViewDetails(match.id)}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h5 className="font-medium text-white">
                                            {match.team1} <span className="text-gray-400">vs</span> {match.team2}
                                          </h5>
                                          <p className="text-sm text-gray-400 mt-1">{match.tournament}</p>
                                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                                            <FaInfoCircle className="mr-1" />
                                            {match.category}
                                          </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                                          {getStatusIcon(match.status)}
                                          {match.status}
                                        </span>
                                      </div>
                                      <div className="mt-3 flex items-center text-sm text-gray-300">
                                        <FaClock className="mr-2 text-gray-400" />
                                        {match.time}
                                      </div>
                                      <div className="mt-1 flex items-center text-sm text-gray-300">
                                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                                        {match.venue}
                                      </div>
                                      {match.status === 'Upcoming' && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            alert(`Score match ${match.id}`);
                                          }}
                                          className="mt-3 w-full inline-flex justify-center items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600"
                                        >
                                          <FaStar className="mr-1" />
                                          Score Match
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-300">No matches found</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your search or filter criteria.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Detailed Schedule</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-400">
                      List of all matches you are assigned to judge
                    </p>
                  </div>
                  <div className="border-t border-gray-700">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Match
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Tournament
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Venue
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                          {filteredSchedule.map((match) => (
                            <tr key={match.id} className="hover:bg-gray-750">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">
                                  {match.team1} <span className="text-gray-400">vs</span> {match.team2}
                                </div>
                                <div className="text-sm text-gray-400">{match.category}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{match.tournament}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-300">
                                  <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400" />
                                  <div>
                                    <div>{match.date}</div>
                                    <div className="text-gray-400">{match.time}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-300">
                                  <FaMapMarkerAlt className="flex-shrink-0 mr-2 text-gray-400" />
                                  {match.venue}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                                  {getStatusIcon(match.status)}
                                  {match.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleViewDetails(match.id)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 mr-2"
                                >
                                  <FaList className="mr-1" />
                                  View
                                </button>
                                {match.status === 'Upcoming' && (
                                  <button
                                    onClick={() => alert(`Score match ${match.id}`)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600"
                                  >
                                    <FaStar className="mr-1" />
                                    Score
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JudgeSchedule;