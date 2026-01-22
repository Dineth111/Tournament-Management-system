import React, { useState, useEffect } from 'react';
import { 
  FaTrophy, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, FaEye,
  FaCalendarAlt, FaUsers, FaChartBar, FaCheckCircle, FaClock, FaBan, FaCheck
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TournamentsManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    category: '',
    maxTeams: '',
    registrationFee: ''
  });

  // Sample tournament data
  const sampleTournaments = [
    {
      id: 1,
      name: 'Summer Championship 2025',
      description: 'Annual summer karate championship',
      startDate: '2025-06-15',
      endDate: '2025-06-17',
      category: 'Black Belt',
      maxTeams: 16,
      registeredTeams: 12,
      registrationFee: 50,
      status: 'active'
    },
    {
      id: 2,
      name: 'Winter League 2025',
      description: 'Winter league for all belt levels',
      startDate: '2025-12-01',
      endDate: '2025-12-03',
      category: 'All Levels',
      maxTeams: 32,
      registeredTeams: 8,
      registrationFee: 30,
      status: 'planning'
    },
    {
      id: 3,
      name: 'Youth Tournament',
      description: 'Tournament for junior karateka',
      startDate: '2025-08-10',
      endDate: '2025-08-12',
      category: 'Youth',
      maxTeams: 24,
      registeredTeams: 24,
      registrationFee: 25,
      status: 'full'
    },
    {
      id: 4,
      name: 'Master\'s Cup',
      description: 'Competition for 4th dan and above',
      startDate: '2025-04-20',
      endDate: '2025-04-22',
      category: 'Master',
      maxTeams: 8,
      registeredTeams: 6,
      registrationFee: 75,
      status: 'completed'
    }
  ];

  useEffect(() => {
    setTournaments(sampleTournaments);
    setFilteredTournaments(sampleTournaments);
  }, []);

  useEffect(() => {
    let result = tournaments;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(tournament => 
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(tournament => tournament.status === filterStatus);
    }
    
    setFilteredTournaments(result);
  }, [searchTerm, filterStatus, tournaments]);

  const handleAddTournament = (e) => {
    e.preventDefault();
    const tournament = {
      id: tournaments.length + 1,
      ...newTournament,
      registeredTeams: 0,
      status: 'planning'
    };
    setTournaments([...tournaments, tournament]);
    setNewTournament({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      category: '',
      maxTeams: '',
      registrationFee: ''
    });
    setShowAddModal(false);
  };

  const handleDeleteTournament = (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      setTournaments(tournaments.filter(tournament => tournament.id !== id));
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Expert Karate - Tournaments Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add table
    doc.autoTable({
      startY: 40,
      head: [['Name', 'Category', 'Start Date', 'End Date', 'Teams', 'Status']],
      body: filteredTournaments.map(tournament => [
        tournament.name,
        tournament.category,
        tournament.startDate,
        tournament.endDate,
        `${tournament.registeredTeams}/${tournament.maxTeams}`,
        tournament.status
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 38, 38] }, // Red header
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Save the PDF
    doc.save('tournaments-report.pdf');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaCheckCircle className="text-green-500" />;
      case 'planning': return <FaClock className="text-yellow-500" />;
      case 'full': return <FaBan className="text-red-500" />;
      case 'completed': return <FaCheck className="text-blue-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
              <FaTrophy className="text-white text-xl" />
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
              Tournaments Management
            </h1>
            <p className="text-sm text-gray-400">Manage karate tournaments</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        {/* Dashboard Controls */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Tournament Overview</h2>
            <p className="text-gray-400">Manage all karate tournaments in the system</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
            <button
              onClick={exportToPDF}
              className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
            >
              <FaDownload className="mr-2" />
              Export PDF
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
            >
              <FaPlus className="mr-2" />
              Add Tournament
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Search tournaments..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="full">Full</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="w-full px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
                      <div className="text-3xl font-bold text-white">{tournaments.length}</div>
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
                  <FaCheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Active Tournaments</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">
                        {tournaments.filter(t => t.status === 'active').length}
                      </div>
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
                  <FaClock className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Planning</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">
                        {tournaments.filter(t => t.status === 'planning').length}
                      </div>
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
                  <FaCheck className="h-8 w-8 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Completed</dt>
                    <dd className="flex items-baseline">
                      <div className="text-3xl font-bold text-white">
                        {tournaments.filter(t => t.status === 'completed').length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tournaments Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Tournament List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {filteredTournaments.length} tournaments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tournament
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Teams
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredTournaments.map((tournament) => (
                  <tr key={tournament.id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-red-600 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                          <FaTrophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{tournament.name}</div>
                          <div className="text-sm text-gray-400">{tournament.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaCalendarAlt className="text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm text-white">
                            {tournament.startDate} to {tournament.endDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaChartBar className="text-yellow-500" />
                        </div>
                        <div className="text-sm text-white">{tournament.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaUsers className="text-green-500" />
                        </div>
                        <div>
                          <div className="text-sm text-white">
                            {tournament.registeredTeams}/{tournament.maxTeams}
                          </div>
                          <div className="w-24 bg-gray-700 rounded-full h-2 mt-1">
                            <div 
                              className="bg-gradient-to-r from-red-600 to-yellow-500 h-2 rounded-full" 
                              style={{ width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getStatusIcon(tournament.status)}
                        </div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tournament.status)}`}>
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200">
                          <FaEye />
                        </button>
                        <button className="p-2 rounded-lg text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10 transition-colors duration-200">
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteTournament(tournament.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-400 hover:bg-opacity-10 transition-colors duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Tournament Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">Add New Tournament</h3>
            </div>
            <form onSubmit={handleAddTournament} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tournament Name</label>
                <input
                  type="text"
                  required
                  value={newTournament.name}
                  onChange={(e) => setNewTournament({...newTournament, name: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  placeholder="Enter tournament name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  value={newTournament.description}
                  onChange={(e) => setNewTournament({...newTournament, description: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  placeholder="Enter tournament description"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newTournament.startDate}
                    onChange={(e) => setNewTournament({...newTournament, startDate: e.target.value})}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newTournament.endDate}
                    onChange={(e) => setNewTournament({...newTournament, endDate: e.target.value})}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  required
                  value={newTournament.category}
                  onChange={(e) => setNewTournament({...newTournament, category: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="">Select category</option>
                  <option value="White Belt">White Belt</option>
                  <option value="Yellow Belt">Yellow Belt</option>
                  <option value="Orange Belt">Orange Belt</option>
                  <option value="Green Belt">Green Belt</option>
                  <option value="Blue Belt">Blue Belt</option>
                  <option value="Brown Belt">Brown Belt</option>
                  <option value="Black Belt">Black Belt</option>
                  <option value="All Levels">All Levels</option>
                  <option value="Youth">Youth</option>
                  <option value="Master">Master</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Max Teams</label>
                  <input
                    type="number"
                    required
                    min="2"
                    value={newTournament.maxTeams}
                    onChange={(e) => setNewTournament({...newTournament, maxTeams: e.target.value})}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter max teams"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Registration Fee ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newTournament.registrationFee}
                    onChange={(e) => setNewTournament({...newTournament, registrationFee: e.target.value})}
                    className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter fee"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
                >
                  Add Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentsManagement;