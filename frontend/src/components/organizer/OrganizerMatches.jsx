import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaUserFriends, FaMapMarkerAlt, FaUser, FaChartBar, FaSave, FaTimes } from 'react-icons/fa';
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

const OrganizerMatches = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleMatch, setShowScheduleMatch] = useState(false);
  const [showEditMatch, setShowEditMatch] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [newMatch, setNewMatch] = useState({
    tournament: '',
    team1: '',
    team2: '',
    date: '',
    time: '',
    venue: '',
    judge: ''
  });

  useEffect(() => {
    // Simulate fetching matches data
    setTimeout(() => {
      setMatches([
        { 
          id: 1, 
          tournament: 'Summer Championship', 
          team1: 'Team Alpha', 
          team2: 'Team Beta',
          date: '2023-07-15',
          time: '14:00',
          venue: 'Main Arena',
          status: 'Scheduled',
          judge: 'John Smith'
        },
        { 
          id: 2, 
          tournament: 'Winter Cup', 
          team1: 'Team Gamma', 
          team2: 'Team Delta',
          date: '2023-07-16',
          time: '16:30',
          venue: 'Side Court',
          status: 'Completed',
          judge: 'Sarah Johnson'
        },
        { 
          id: 3, 
          tournament: 'Spring League', 
          team1: 'Team Alpha', 
          team2: 'Team Gamma',
          date: '2023-07-17',
          time: '10:00',
          venue: 'Main Arena',
          status: 'Postponed',
          judge: 'Michael Brown'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleScheduleMatch = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to schedule the match
    const match = {
      id: matches.length + 1,
      ...newMatch,
      status: 'Scheduled'
    };
    setMatches([...matches, match]);
    setNewMatch({ tournament: '', team1: '', team2: '', date: '', time: '', venue: '', judge: '' });
    setShowScheduleMatch(false);
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setShowEditMatch(true);
  };

  const handleUpdateMatch = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the match
    setMatches(matches.map(m => 
      m.id === editingMatch.id ? editingMatch : m
    ));
    setShowEditMatch(false);
    setEditingMatch(null);
  };

  const handleDeleteMatch = (id) => {
    // In a real app, this would make an API call to delete the match
    if (window.confirm('Are you sure you want to delete this match?')) {
      setMatches(matches.filter(match => match.id !== id));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMatch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewMatchChange = (e) => {
    const { name, value } = e.target;
    setNewMatch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMatchesByTournamentData = () => {
    const tournaments = [...new Set(matches.map(match => match.tournament))];
    const data = tournaments.map(tournament => 
      matches.filter(match => match.tournament === tournament).length
    );
    
    return {
      labels: tournaments,
      datasets: [
        {
          label: 'Matches',
          data: data,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getMatchesByVenueData = () => {
    const venues = [...new Set(matches.map(match => match.venue))];
    const data = venues.map(venue => 
      matches.filter(match => match.venue === venue).length
    );
    
    return {
      labels: venues,
      datasets: [
        {
          label: 'Matches by Venue',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF' // text-gray-400
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold leading-tight text-white flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-400" /> Matches
              </h1>
              <button
                onClick={() => setShowScheduleMatch(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2" /> Schedule Match
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Schedule Match Form */}
              {showScheduleMatch && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaPlus className="mr-2 text-indigo-400" /> Schedule New Match
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleScheduleMatch} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="tournament" className="block text-sm font-medium text-gray-300">
                            Tournament
                          </label>
                          <div className="mt-1">
                            <select
                              id="tournament"
                              name="tournament"
                              value={newMatch.tournament}
                              onChange={handleNewMatchChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select tournament</option>
                              <option value="Summer Championship">Summer Championship</option>
                              <option value="Winter Cup">Winter Cup</option>
                              <option value="Spring League">Spring League</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="team1" className="block text-sm font-medium text-gray-300">
                            Team 1
                          </label>
                          <div className="mt-1">
                            <select
                              id="team1"
                              name="team1"
                              value={newMatch.team1}
                              onChange={handleNewMatchChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select team</option>
                              <option value="Team Alpha">Team Alpha</option>
                              <option value="Team Beta">Team Beta</option>
                              <option value="Team Gamma">Team Gamma</option>
                              <option value="Team Delta">Team Delta</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="team2" className="block text-sm font-medium text-gray-300">
                            Team 2
                          </label>
                          <div className="mt-1">
                            <select
                              id="team2"
                              name="team2"
                              value={newMatch.team2}
                              onChange={handleNewMatchChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select team</option>
                              <option value="Team Alpha">Team Alpha</option>
                              <option value="Team Beta">Team Beta</option>
                              <option value="Team Gamma">Team Gamma</option>
                              <option value="Team Delta">Team Delta</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="date" className="block text-sm font-medium text-gray-300">
                            Match Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              name="date"
                              id="date"
                              value={newMatch.date}
                              onChange={handleNewMatchChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="time" className="block text-sm font-medium text-gray-300">
                            Match Time
                          </label>
                          <div className="mt-1">
                            <input
                              type="time"
                              name="time"
                              id="time"
                              value={newMatch.time}
                              onChange={handleNewMatchChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="venue" className="block text-sm font-medium text-gray-300">
                            Venue
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="venue"
                              id="venue"
                              value={newMatch.venue}
                              onChange={handleNewMatchChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowScheduleMatch(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" /> Schedule Match
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Match Form */}
              {showEditMatch && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaEdit className="mr-2 text-indigo-400" /> Edit Match
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleUpdateMatch} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="edit-tournament" className="block text-sm font-medium text-gray-300">
                            Tournament
                          </label>
                          <div className="mt-1">
                            <select
                              id="edit-tournament"
                              name="tournament"
                              value={editingMatch?.tournament || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select tournament</option>
                              <option value="Summer Championship">Summer Championship</option>
                              <option value="Winter Cup">Winter Cup</option>
                              <option value="Spring League">Spring League</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-team1" className="block text-sm font-medium text-gray-300">
                            Team 1
                          </label>
                          <div className="mt-1">
                            <select
                              id="edit-team1"
                              name="team1"
                              value={editingMatch?.team1 || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select team</option>
                              <option value="Team Alpha">Team Alpha</option>
                              <option value="Team Beta">Team Beta</option>
                              <option value="Team Gamma">Team Gamma</option>
                              <option value="Team Delta">Team Delta</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-team2" className="block text-sm font-medium text-gray-300">
                            Team 2
                          </label>
                          <div className="mt-1">
                            <select
                              id="edit-team2"
                              name="team2"
                              value={editingMatch?.team2 || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select team</option>
                              <option value="Team Alpha">Team Alpha</option>
                              <option value="Team Beta">Team Beta</option>
                              <option value="Team Gamma">Team Gamma</option>
                              <option value="Team Delta">Team Delta</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-date" className="block text-sm font-medium text-gray-300">
                            Match Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              name="date"
                              id="edit-date"
                              value={editingMatch?.date || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-time" className="block text-sm font-medium text-gray-300">
                            Match Time
                          </label>
                          <div className="mt-1">
                            <input
                              type="time"
                              name="time"
                              id="edit-time"
                              value={editingMatch?.time || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-venue" className="block text-sm font-medium text-gray-300">
                            Venue
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="venue"
                              id="edit-venue"
                              value={editingMatch?.venue || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-status" className="block text-sm font-medium text-gray-300">
                            Status
                          </label>
                          <div className="mt-1">
                            <select
                              id="edit-status"
                              name="status"
                              value={editingMatch?.status || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="Completed">Completed</option>
                              <option value="Postponed">Postponed</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-judge" className="block text-sm font-medium text-gray-300">
                            Judge
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="judge"
                              id="edit-judge"
                              value={editingMatch?.judge || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowEditMatch(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" /> Update Match
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Matches List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                <ul className="divide-y divide-gray-700">
                  {matches.map((match) => (
                    <li key={match.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-medium text-indigo-400 truncate">
                                {match.tournament}
                              </p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                match.status === 'Scheduled' 
                                  ? 'bg-blue-900 text-blue-300' 
                                  : match.status === 'Completed'
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-yellow-900 text-yellow-300'
                              }`}>
                                {match.status}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaUserFriends className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                {match.team1} vs {match.team2}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                {match.date} at {match.time}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                {match.venue}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <FaUser className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                Judge: {match.judge}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleEditMatch(match)}
                              className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-indigo-300 bg-gray-700 hover:bg-gray-600 mr-2"
                            >
                              <FaEdit className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMatch(match.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              <FaTrash className="mr-1" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Charts Section */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <FaChartBar className="mr-2 text-indigo-400" /> Match Analytics
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Matches by Tournament</h3>
                    <div className="h-64">
                      <Bar data={getMatchesByTournamentData()} options={chartOptions} />
                    </div>
                  </div>
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Matches by Venue</h3>
                    <div className="h-64">
                      <Pie data={getMatchesByVenueData()} options={chartOptions} />
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

export default OrganizerMatches;