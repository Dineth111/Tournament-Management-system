import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaUsers, FaDollarSign, FaChartBar, FaList, FaSave, FaTimes, FaSearch } from 'react-icons/fa';
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

const OrganizerTournaments = ({ user }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTournament, setShowAddTournament] = useState(false);
  const [showEditTournament, setShowEditTournament] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [newTournament, setNewTournament] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    category: '',
    maxTeams: '',
    registrationFee: ''
  });

  useEffect(() => {
    // Simulate fetching tournaments data
    setTimeout(() => {
      setTournaments([
        { 
          id: 1, 
          name: 'Summer Championship', 
          startDate: '2023-07-15', 
          endDate: '2023-07-30',
          status: 'Ongoing',
          category: 'U18 Male',
          teams: 8,
          maxTeams: 16,
          registrationFee: '$50'
        },
        { 
          id: 2, 
          name: 'Winter Cup', 
          startDate: '2023-12-10', 
          endDate: '2023-12-25',
          status: 'Registration Open',
          category: 'U18 Male',
          teams: 3,
          maxTeams: 12,
          registrationFee: '$75'
        },
        { 
          id: 3, 
          name: 'Spring League', 
          startDate: '2023-04-20', 
          endDate: '2023-05-15',
          status: 'Completed',
          category: 'U18 Male',
          teams: 10,
          maxTeams: 12,
          registrationFee: '$40'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddTournament = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to add the tournament
    const tournament = {
      id: tournaments.length + 1,
      ...newTournament,
      teams: 0,
      status: 'Planning'
    };
    setTournaments([...tournaments, tournament]);
    setNewTournament({ name: '', description: '', startDate: '', endDate: '', category: '', maxTeams: '', registrationFee: '' });
    setShowAddTournament(false);
  };

  const handleEditTournament = (tournament) => {
    setEditingTournament(tournament);
    setShowEditTournament(true);
  };

  const handleUpdateTournament = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the tournament
    setTournaments(tournaments.map(t => 
      t.id === editingTournament.id ? editingTournament : t
    ));
    setShowEditTournament(false);
    setEditingTournament(null);
  };

  const handleDeleteTournament = (id) => {
    // In a real app, this would make an API call to delete the tournament
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      setTournaments(tournaments.filter(tournament => tournament.id !== id));
    }
  };

  const handleCloseEditModal = () => {
    setShowEditTournament(false);
    setEditingTournament(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTournament(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'bg-gray-100 text-gray-800';
      case 'Registration Open': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart data for tournament status distribution
  const statusData = {
    labels: ['Planning', 'Registration Open', 'Ongoing', 'Completed'],
    datasets: [
      {
        data: [
          tournaments.filter(t => t.status === 'Planning').length,
          tournaments.filter(t => t.status === 'Registration Open').length,
          tournaments.filter(t => t.status === 'Ongoing').length,
          tournaments.filter(t => t.status === 'Completed').length
        ],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)', // gray for Planning
          'rgba(59, 130, 246, 0.8)',  // blue for Registration Open
          'rgba(16, 185, 129, 0.8)',  // green for Ongoing
          'rgba(139, 92, 246, 0.8)'   // purple for Completed
        ],
        borderColor: [
          'rgba(156, 163, 175, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for tournaments by category
  const categoryData = {
    labels: [...new Set(tournaments.map(t => t.category))],
    datasets: [
      {
        label: 'Tournaments',
        data: [...new Set(tournaments.map(t => t.category))].map(category => 
          tournaments.filter(t => t.category === category).length
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Enhanced chart options for better visualization
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9CA3AF', // text-gray-400
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)', // gray-800 with opacity
        titleColor: '#F9FAFB', // gray-50
        bodyColor: '#E5E7EB', // gray-200
        borderColor: '#374151', // gray-700
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6
      }
    }
  };

  // New chart for tournaments over time
  const tournamentsOverTimeData = {
    labels: tournaments.map(t => t.name),
    datasets: [
      {
        label: 'Teams Registered',
        data: tournaments.map(t => t.teams),
        backgroundColor: 'rgba(16, 185, 129, 0.6)', // green
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Max Teams',
        data: tournaments.map(t => t.maxTeams),
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  // New chart for registration fees
  const feeData = {
    labels: tournaments.map(t => t.name),
    datasets: [
      {
        label: 'Registration Fee ($)',
        data: tournaments.map(t => {
          if (!t.registrationFee) return 0;
          // Extract numeric value from fee string (e.g., "$50" -> 50)
          const match = t.registrationFee.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        }),
        backgroundColor: 'rgba(245, 158, 11, 0.6)', // amber
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2
      }
    ]
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
                <FaList className="mr-2 text-indigo-400" />
                Tournaments
              </h1>
              <button
                onClick={() => setShowAddTournament(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2" />
                Create Tournament
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Add Tournament Form */}
              {showAddTournament && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaPlus className="mr-2 text-indigo-400" />
                      Create New Tournament
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleAddTournament} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Tournament Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={newTournament.name}
                              onChange={(e) => setNewTournament({...newTournament, name: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                            Category
                          </label>
                          <div className="mt-1">
                            <select
                              id="category"
                              name="category"
                              value={newTournament.category}
                              onChange={(e) => setNewTournament({...newTournament, category: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select category</option>
                              <option value="U8 Male">U8 Male</option>
                              <option value="U10 Male">U10 Male</option>
                              <option value="U12 Male">U12 Male</option>
                              <option value="U14 Male">U14 Male</option>
                              <option value="U16 Male">U16 Male</option>
                              <option value="U18 Male">U18 Male</option>
                              <option value="U8 Female">U8 Female</option>
                              <option value="U10 Female">U10 Female</option>
                              <option value="U12 Female">U12 Female</option>
                              <option value="U14 Female">U14 Female</option>
                              <option value="U16 Female">U16 Female</option>
                              <option value="U18 Female">U18 Female</option>
                            </select>
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
                              value={newTournament.startDate}
                              onChange={(e) => setNewTournament({...newTournament, startDate: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
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
                              value={newTournament.endDate}
                              onChange={(e) => setNewTournament({...newTournament, endDate: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="maxTeams" className="block text-sm font-medium text-gray-300">
                            Maximum Teams
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="maxTeams"
                              id="maxTeams"
                              value={newTournament.maxTeams}
                              onChange={(e) => setNewTournament({...newTournament, maxTeams: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="registrationFee" className="block text-sm font-medium text-gray-300">
                            Registration Fee
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="registrationFee"
                              id="registrationFee"
                              value={newTournament.registrationFee}
                              onChange={(e) => setNewTournament({...newTournament, registrationFee: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              placeholder="e.g., $50"
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
                              value={newTournament.description}
                              onChange={(e) => setNewTournament({...newTournament, description: e.target.value})}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddTournament(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" />
                          Create Tournament
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Tournament Form */}
              {showEditTournament && editingTournament && (
                <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-700">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white flex items-center">
                      <FaEdit className="mr-2 text-indigo-400" />
                      Edit Tournament
                    </h3>
                  </div>
                  <div className="border-t border-gray-700">
                    <form onSubmit={handleUpdateTournament} className="px-4 py-5 sm:p-6">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300">
                            Tournament Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="edit-name"
                              value={editingTournament.name}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-category" className="block text-sm font-medium text-gray-300">
                            Category
                          </label>
                          <div className="mt-1">
                            <select
                              id="edit-category"
                              name="category"
                              value={editingTournament.category}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="">Select category</option>
                              <option value="U8 Male">U8 Male</option>
                              <option value="U10 Male">U10 Male</option>
                              <option value="U12 Male">U12 Male</option>
                              <option value="U14 Male">U14 Male</option>
                              <option value="U16 Male">U16 Male</option>
                              <option value="U18 Male">U18 Male</option>
                              <option value="U8 Female">U8 Female</option>
                              <option value="U10 Female">U10 Female</option>
                              <option value="U12 Female">U12 Female</option>
                              <option value="U14 Female">U14 Female</option>
                              <option value="U16 Female">U16 Female</option>
                              <option value="U18 Female">U18 Female</option>
                            </select>
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
                              value={editingTournament.startDate}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
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
                              value={editingTournament.endDate}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-maxTeams" className="block text-sm font-medium text-gray-300">
                            Maximum Teams
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="maxTeams"
                              id="edit-maxTeams"
                              value={editingTournament.maxTeams}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="edit-registrationFee" className="block text-sm font-medium text-gray-300">
                            Registration Fee
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="registrationFee"
                              id="edit-registrationFee"
                              value={editingTournament.registrationFee}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              placeholder="e.g., $50"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300">
                            Description
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="edit-description"
                              name="description"
                              rows={3}
                              value={editingTournament.description || ''}
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
                              value={editingTournament.status}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                              required
                            >
                              <option value="Planning">Planning</option>
                              <option value="Registration Open">Registration Open</option>
                              <option value="Ongoing">Ongoing</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCloseEditModal}
                          className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaSave className="mr-2" />
                          Update Tournament
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Tournaments List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                <ul className="divide-y divide-gray-700">
                  {tournaments.map((tournament) => (
                    <li key={tournament.id} className="hover:bg-gray-750">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-medium text-indigo-300 truncate">
                                {tournament.name}
                              </p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
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
                                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                {tournament.category}
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                              {tournament.description || 'No description provided'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="mr-3 text-sm text-gray-400">
                              {tournament.teams}/{tournament.maxTeams} teams
                            </div>
                            <div className="mr-3 text-sm text-gray-400">
                              {tournament.registrationFee}
                            </div>
                            <button
                              onClick={() => handleEditTournament(tournament)}
                              className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FaEdit className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTournament(tournament.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <FaTrash className="mr-1" />
                              Delete
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
                  <FaChartBar className="mr-2 text-indigo-400" />
                  Tournament Analytics
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Tournament Status Distribution</h3>
                    <div className="h-64">
                      <Pie data={statusData} options={chartOptions} />
                    </div>
                  </div>
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Tournaments by Category</h3>
                    <div className="h-64">
                      <Bar data={categoryData} options={chartOptions} />
                    </div>
                  </div>
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Teams Registered vs Max Teams</h3>
                    <div className="h-64">
                      <Bar data={tournamentsOverTimeData} options={chartOptions} />
                    </div>
                  </div>
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-4 border border-gray-700">
                    <h3 className="text-md font-medium text-white mb-4">Registration Fees</h3>
                    <div className="h-64">
                      <Bar data={feeData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Stats */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-white">Tournament Overview</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Tournaments</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">{tournaments.length}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Ongoing</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {tournaments.filter(t => t.status === 'Ongoing').length}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Registration Open</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {tournaments.filter(t => t.status === 'Registration Open').length}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-400 truncate">Completed</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-white">
                                {tournaments.filter(t => t.status === 'Completed').length}
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

export default OrganizerTournaments;