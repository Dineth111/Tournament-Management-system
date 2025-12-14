import React, { useState, useEffect } from 'react';
import { FaChartBar, FaTrophy, FaUsers, FaUser, FaFilePdf, FaDownload, FaEye, FaSave, FaTimes, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
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

const OrganizerReports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tournaments');
  const [showAddReport, setShowAddReport] = useState(false);
  const [showEditReport, setShowEditReport] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [newReport, setNewReport] = useState({
    type: 'tournament',
    name: '',
    teams: '',
    matches: '',
    startDate: '',
    endDate: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    // Simulate fetching reports data
    setTimeout(() => {
      setReports({
        tournaments: [
          { id: 1, name: 'Summer Championship', teams: 8, matches: 28, startDate: '2023-07-15', endDate: '2023-07-30', status: 'Completed' },
          { id: 2, name: 'Winter Cup', teams: 12, matches: 66, startDate: '2023-12-10', endDate: '2023-12-25', status: 'Ongoing' },
          { id: 3, name: 'Spring League', teams: 10, matches: 45, startDate: '2023-04-20', endDate: '2023-05-15', status: 'Completed' }
        ],
        teams: [
          { id: 1, name: 'Team Alpha', coach: 'Michael Johnson', players: 18, tournaments: 3, wins: 12, losses: 3, draws: 1 },
          { id: 2, name: 'Team Beta', coach: 'Sarah Williams', players: 16, tournaments: 2, wins: 8, losses: 5, draws: 2 },
          { id: 3, name: 'Team Gamma', coach: 'David Brown', players: 17, tournaments: 1, wins: 5, losses: 7, draws: 1 },
          { id: 4, name: 'Team Delta', coach: 'Jennifer Davis', players: 15, tournaments: 2, wins: 7, losses: 6, draws: 1 }
        ],
        players: [
          { id: 1, name: 'John Doe', team: 'Team Alpha', matches: 15, goals: 8, assists: 5 },
          { id: 2, name: 'Jane Smith', team: 'Team Beta', matches: 14, goals: 6, assists: 7 },
          { id: 3, name: 'Robert Brown', team: 'Team Gamma', matches: 12, goals: 4, assists: 3 },
          { id: 4, name: 'Emily Davis', team: 'Team Delta', matches: 13, goals: 7, assists: 4 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleGenerateReport = (reportType) => {
    // In a real app, this would generate and download a report
    alert(`Generating ${reportType} report...`);
  };

  const handleViewDetails = (itemId) => {
    // In a real app, this would navigate to detailed report page
    alert(`Viewing details for item ${itemId}`);
  };

  const handleAddReport = (e) => {
    e.preventDefault();
    const newReportItem = {
      id: reports[activeTab] ? reports[activeTab].length + 1 : 1,
      ...newReport
    };
    
    setReports(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newReportItem]
    }));
    
    setNewReport({
      type: 'tournament',
      name: '',
      teams: '',
      matches: '',
      startDate: '',
      endDate: '',
      status: 'Scheduled'
    });
    setShowAddReport(false);
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setShowEditReport(true);
  };

  const handleUpdateReport = (e) => {
    e.preventDefault();
    setReports(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(report => 
        report.id === editingReport.id ? editingReport : report
      )
    }));
    setShowEditReport(false);
    setEditingReport(null);
  };

  const handleDeleteReport = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(report => report.id !== id)
      }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewReportChange = (e) => {
    const { name, value } = e.target;
    setNewReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTournamentStatusData = () => {
    if (!reports.tournaments) return { labels: [], datasets: [] };
    
    const statuses = [...new Set(reports.tournaments.map(tournament => tournament.status))];
    const data = statuses.map(status => 
      reports.tournaments.filter(tournament => tournament.status === status).length
    );
    
    return {
      labels: statuses,
      datasets: [
        {
          label: 'Tournaments by Status',
          data: data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const getTeamPerformanceData = () => {
    if (!reports.teams) return { labels: [], datasets: [] };
    
    const teamNames = reports.teams.map(team => team.name);
    const wins = reports.teams.map(team => team.wins);
    const losses = reports.teams.map(team => team.losses);
    
    return {
      labels: teamNames,
      datasets: [
        {
          label: 'Wins',
          data: wins,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Losses',
          data: losses,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getPlayerStatsData = () => {
    if (!reports.players) return { labels: [], datasets: [] };
    
    const playerNames = reports.players.map(player => player.name);
    const goals = reports.players.map(player => player.goals);
    const assists = reports.players.map(player => player.assists);
    
    return {
      labels: playerNames,
      datasets: [
        {
          label: 'Goals',
          data: goals,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1
        },
        {
          label: 'Assists',
          data: assists,
          borderColor: 'rgba(255, 205, 86, 1)',
          backgroundColor: 'rgba(255, 205, 86, 0.2)',
          tension: 0.1
        }
      ]
    };
  };

  // Add chart options for consistent styling
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
                <FaChartBar className="mr-2 text-indigo-400" /> Reports
              </h1>
              <button
                onClick={() => setShowAddReport(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2" /> Add Report
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Add Report Form */}
              {showAddReport && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaPlus className="mr-2" /> Add New Report
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleAddReport} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Report Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={newReport.name}
                              onChange={handleNewReportChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                            Report Type
                          </label>
                          <div className="mt-1">
                            <select
                              id="type"
                              name="type"
                              value={newReport.type}
                              onChange={handleNewReportChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="tournament">Tournament</option>
                              <option value="team">Team</option>
                              <option value="player">Player</option>
                            </select>
                          </div>
                        </div>

                        {activeTab === 'tournaments' && (
                          <>
                            <div className="sm:col-span-3">
                              <label htmlFor="teams" className="block text-sm font-medium text-gray-300">
                                Number of Teams
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="teams"
                                  id="teams"
                                  value={newReport.teams}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="matches" className="block text-sm font-medium text-gray-300">
                                Number of Matches
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="matches"
                                  id="matches"
                                  value={newReport.matches}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
                                Start Date
                              </label>
                              <div className="mt-1">
                                <input
                                  type="date"
                                  name="startDate"
                                  id="startDate"
                                  value={newReport.startDate}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
                                End Date
                              </label>
                              <div className="mt-1">
                                <input
                                  type="date"
                                  name="endDate"
                                  id="endDate"
                                  value={newReport.endDate}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                                Status
                              </label>
                              <div className="mt-1">
                                <select
                                  id="status"
                                  name="status"
                                  value={newReport.status}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                >
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="Ongoing">Ongoing</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          </>
                        )}

                        {activeTab === 'teams' && (
                          <>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach" className="block text-sm font-medium text-gray-300">
                                Coach Name
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="coach"
                                  id="coach"
                                  value={newReport.coach || ''}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="players" className="block text-sm font-medium text-gray-300">
                                Number of Players
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="players"
                                  id="players"
                                  value={newReport.players || ''}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="tournaments" className="block text-sm font-medium text-gray-300">
                                Tournaments Participated
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="tournaments"
                                  id="tournaments"
                                  value={newReport.tournaments || ''}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {activeTab === 'players' && (
                          <>
                            <div className="sm:col-span-3">
                              <label htmlFor="team" className="block text-sm font-medium text-gray-300">
                                Team
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="team"
                                  id="team"
                                  value={newReport.team || ''}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="matches" className="block text-sm font-medium text-gray-300">
                                Matches Played
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="matches"
                                  id="matches"
                                  value={newReport.matches || ''}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="goals" className="block text-sm font-medium text-gray-300">
                                Goals Scored
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="goals"
                                  id="goals"
                                  value={newReport.goals || ''}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="assists" className="block text-sm font-medium text-gray-300">
                                Assists
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="assists"
                                  id="assists"
                                  value={newReport.assists || ''}
                                  onChange={handleNewReportChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddReport(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" /> Add Report
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Report Form */}
              {showEditReport && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaEdit className="mr-2" /> Edit Report
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleUpdateReport} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300">
                            Report Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="edit-name"
                              value={editingReport?.name || ''}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        {activeTab === 'tournaments' && (
                          <>
                            <div className="sm:col-span-3">
                              <label htmlFor="edit-teams" className="block text-sm font-medium text-gray-300">
                                Number of Teams
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="teams"
                                  id="edit-teams"
                                  value={editingReport?.teams || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="edit-matches" className="block text-sm font-medium text-gray-300">
                                Number of Matches
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="matches"
                                  id="edit-matches"
                                  value={editingReport?.matches || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="edit-startDate" className="block text-sm font-medium text-gray-300">
                                Start Date
                              </label>
                              <div className="mt-1">
                                <input
                                  type="date"
                                  name="startDate"
                                  id="edit-startDate"
                                  value={editingReport?.startDate || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="edit-endDate" className="block text-sm font-medium text-gray-300">
                                End Date
                              </label>
                              <div className="mt-1">
                                <input
                                  type="date"
                                  name="endDate"
                                  id="edit-endDate"
                                  value={editingReport?.endDate || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
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
                                  value={editingReport?.status || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                >
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="Ongoing">Ongoing</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          </>
                        )}

                        {activeTab === 'teams' && (
                          <>
                            <div className="sm:col-span-3">
                              <label htmlFor="edit-coach" className="block text-sm font-medium text-gray-300">
                                Coach Name
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="coach"
                                  id="edit-coach"
                                  value={editingReport?.coach || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="edit-players" className="block text-sm font-medium text-gray-300">
                                Number of Players
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="players"
                                  id="edit-players"
                                  value={editingReport?.players || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="edit-tournaments" className="block text-sm font-medium text-gray-300">
                                Tournaments Participated
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="tournaments"
                                  id="edit-tournaments"
                                  value={editingReport?.tournaments || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {activeTab === 'players' && (
                          <>
                            <div className="sm:col-span-3">
                              <label htmlFor="edit-team" className="block text-sm font-medium text-gray-300">
                                Team
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="team"
                                  id="edit-team"
                                  value={editingReport?.team || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="edit-matches" className="block text-sm font-medium text-gray-300">
                                Matches Played
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="matches"
                                  id="edit-matches"
                                  value={editingReport?.matches || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="edit-goals" className="block text-sm font-medium text-gray-300">
                                Goals Scored
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="goals"
                                  id="edit-goals"
                                  value={editingReport?.goals || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="edit-assists" className="block text-sm font-medium text-gray-300">
                                Assists
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="assists"
                                  id="edit-assists"
                                  value={editingReport?.assists || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowEditReport(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" /> Update Report
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Report Tabs */}
              <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('tournaments')}
                    className={`${
                      activeTab === 'tournaments'
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <FaTrophy className="mr-2" /> Tournament Reports
                  </button>
                  <button
                    onClick={() => setActiveTab('teams')}
                    className={`${
                      activeTab === 'teams'
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <FaUsers className="mr-2" /> Team Reports
                  </button>
                  <button
                    onClick={() => setActiveTab('players')}
                    className={`${
                      activeTab === 'players'
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <FaUser className="mr-2" /> Player Reports
                  </button>
                </nav>
              </div>

              {/* Report Content */}
              <div className="mt-6">
                {activeTab === 'tournaments' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <FaTrophy className="mr-2" /> Tournament Reports
                      </h2>
                      <button
                        onClick={() => handleGenerateReport('tournament')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaFilePdf className="mr-2" /> Generate Report
                      </button>
                    </div>
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                      <ul className="divide-y divide-gray-700">
                        {reports.tournaments && reports.tournaments.map((tournament) => (
                          <li key={tournament.id}>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-lg font-medium text-indigo-400 truncate">
                                      {tournament.name}
                                    </p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      tournament.status === 'Completed' 
                                        ? 'bg-green-900 text-green-300' 
                                        : tournament.status === 'Ongoing'
                                        ? 'bg-blue-900 text-blue-300'
                                        : 'bg-gray-700 text-gray-300'
                                    }`}>
                                      {tournament.status}
                                    </span>
                                  </div>
                                  <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                      </svg>
                                      {tournament.startDate} to {tournament.endDate}
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                      </svg>
                                      {tournament.teams} teams
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                      </svg>
                                      {tournament.matches} matches
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleEditReport(tournament)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-indigo-300 bg-gray-700 hover:bg-gray-600 mr-2"
                                  >
                                    <FaEdit className="mr-1" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReport(tournament.id)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 mr-2"
                                  >
                                    <FaTrash className="mr-1" /> Delete
                                  </button>
                                  <button
                                    onClick={() => handleViewDetails(tournament.id)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
                                  >
                                    <FaEye className="mr-1" /> View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'teams' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <FaUsers className="mr-2" /> Team Reports
                      </h2>
                      <button
                        onClick={() => handleGenerateReport('team')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaFilePdf className="mr-2" /> Generate Report
                      </button>
                    </div>
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                      <ul className="divide-y divide-gray-700">
                        {reports.teams && reports.teams.map((team) => (
                          <li key={team.id}>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-lg font-medium text-indigo-400 truncate">
                                      {team.name}
                                    </p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300">
                                      {team.coach}
                                    </span>
                                  </div>
                                  <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                      </svg>
                                      {team.players} players
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                      </svg>
                                      {team.tournaments} tournaments
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      {team.wins}-{team.losses}-{team.draws}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleEditReport(team)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-indigo-300 bg-gray-700 hover:bg-gray-600 mr-2"
                                  >
                                    <FaEdit className="mr-1" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReport(team.id)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 mr-2"
                                  >
                                    <FaTrash className="mr-1" /> Delete
                                  </button>
                                  <button
                                    onClick={() => handleViewDetails(team.id)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
                                  >
                                    <FaEye className="mr-1" /> View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'players' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <FaUser className="mr-2" /> Player Reports
                      </h2>
                      <button
                        onClick={() => handleGenerateReport('player')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaFilePdf className="mr-2" /> Generate Report
                      </button>
                    </div>
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                      <ul className="divide-y divide-gray-700">
                        {reports.players && reports.players.map((player) => (
                          <li key={player.id}>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-lg font-medium text-indigo-400 truncate">
                                      {player.name}
                                    </p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-300">
                                      {player.team}
                                    </span>
                                  </div>
                                  <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                      </svg>
                                      {player.matches} matches
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      {player.goals} goals
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-400">
                                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      {player.assists} assists
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleEditReport(player)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-indigo-300 bg-gray-700 hover:bg-gray-600 mr-2"
                                  >
                                    <FaEdit className="mr-1" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReport(player.id)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 mr-2"
                                  >
                                    <FaTrash className="mr-1" /> Delete
                                  </button>
                                  <button
                                    onClick={() => handleViewDetails(player.id)}
                                    className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
                                  >
                                    <FaEye className="mr-1" /> View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Charts Section */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <FaChartBar className="mr-2" /> Reports Analytics
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {activeTab === 'tournaments' && (
                    <>
                      <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                        <h3 className="text-md font-medium text-white mb-4">Tournaments by Status</h3>
                        <div className="h-64">
                          <Pie data={getTournamentStatusData()} options={chartOptions} />
                        </div>
                      </div>
                      <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                        <h3 className="text-md font-medium text-white mb-4">Tournaments Overview</h3>
                        <div className="h-64">
                          <Bar 
                            data={{
                              labels: reports.tournaments ? reports.tournaments.map(t => t.name) : [],
                              datasets: [
                                {
                                  label: 'Teams',
                                  data: reports.tournaments ? reports.tournaments.map(t => t.teams) : [],
                                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                  borderColor: 'rgba(54, 162, 235, 1)',
                                  borderWidth: 1
                                },
                                {
                                  label: 'Matches',
                                  data: reports.tournaments ? reports.tournaments.map(t => t.matches) : [],
                                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                  borderColor: 'rgba(255, 99, 132, 1)',
                                  borderWidth: 1
                                }
                              ]
                            }} 
                            options={chartOptions}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'teams' && (
                    <>
                      <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                        <h3 className="text-md font-medium text-white mb-4">Team Performance</h3>
                        <div className="h-64">
                          <Bar data={getTeamPerformanceData()} options={chartOptions} />
                        </div>
                      </div>
                      <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                        <h3 className="text-md font-medium text-white mb-4">Teams Overview</h3>
                        <div className="h-64">
                          <Line 
                            data={{
                              labels: reports.teams ? reports.teams.map(t => t.name) : [],
                              datasets: [
                                {
                                  label: 'Players',
                                  data: reports.teams ? reports.teams.map(t => t.players) : [],
                                  borderColor: 'rgba(54, 162, 235, 1)',
                                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                  tension: 0.1
                                },
                                {
                                  label: 'Tournaments',
                                  data: reports.teams ? reports.teams.map(t => t.tournaments) : [],
                                  borderColor: 'rgba(255, 205, 86, 1)',
                                  backgroundColor: 'rgba(255, 205, 86, 0.2)',
                                  tension: 0.1
                                }
                              ]
                            }} 
                            options={chartOptions}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'players' && (
                    <>
                      <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                        <h3 className="text-md font-medium text-white mb-4">Player Statistics</h3>
                        <div className="h-64">
                          <Line data={getPlayerStatsData()} options={chartOptions} />
                        </div>
                      </div>
                      <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                        <h3 className="text-md font-medium text-white mb-4">Players Overview</h3>
                        <div className="h-64">
                          <Bar 
                            data={{
                              labels: reports.players ? reports.players.map(p => p.name) : [],
                              datasets: [
                                {
                                  label: 'Matches',
                                  data: reports.players ? reports.players.map(p => p.matches) : [],
                                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                  borderColor: 'rgba(54, 162, 235, 1)',
                                  borderWidth: 1
                                }
                              ]
                            }} 
                            options={chartOptions}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Report Stats */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white">Report Summary</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                          <FaTrophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Tournaments</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">{reports.tournaments ? reports.tournaments.length : 0}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <FaUsers className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Teams</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">{reports.teams ? reports.teams.length : 0}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <FaUser className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Players</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">{reports.players ? reports.players.length : 0}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Matches</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {reports.tournaments ? reports.tournaments.reduce((sum, t) => sum + t.matches, 0) : 0}
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

export default OrganizerReports;
