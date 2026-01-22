import React, { useState, useEffect } from 'react';
import { 
  FaFileAlt, FaFilter, FaSearch, FaCheckCircle, 
  FaClock, FaPlus, FaChartBar, FaList, 
  FaTrophy, FaDownload, FaEye, FaEdit,
  FaSort, FaSortUp, FaSortDown, FaTimes, FaSave, FaCalendarAlt
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

const JudgeReports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newReport, setNewReport] = useState({
    tournament: '',
    match: '',
    date: '',
    category: '',
    score: '',
    notes: ''
  });
  const [editingReport, setEditingReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  useEffect(() => {
    // Simulate fetching reports data
    setTimeout(() => {
      const initialReports = [
        { 
          id: 1, 
          tournament: 'Summer Championship',
          match: 'Team Alpha vs Team Beta',
          date: '2023-07-20',
          status: 'Submitted',
          score: '3-1',
          category: 'U18 Male'
        },
        { 
          id: 2, 
          tournament: 'Summer Championship',
          match: 'Team Gamma vs Team Delta',
          date: '2023-07-15',
          status: 'Submitted',
          score: '2-2',
          category: 'U18 Male'
        },
        { 
          id: 3, 
          tournament: 'Spring League',
          match: 'Team Epsilon vs Team Zeta',
          date: '2023-04-25',
          status: 'Submitted',
          score: '1-0',
          category: 'U18 Male'
        },
        { 
          id: 4, 
          tournament: 'Spring League',
          match: 'Team Alpha vs Team Gamma',
          date: '2023-04-20',
          status: 'Pending',
          score: null,
          category: 'U18 Male'
        },
        { 
          id: 5, 
          tournament: 'Winter Cup',
          match: 'Team Beta vs Team Delta',
          date: '2023-12-10',
          status: 'Draft',
          score: null,
          category: 'U16 Female'
        }
      ];
      console.log('Initial reports:', initialReports);
      setReports(initialReports);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-green-900 text-green-300';
      case 'Pending': return 'bg-yellow-900 text-yellow-300';
      case 'Draft': return 'bg-gray-700 text-gray-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Submitted': return <FaCheckCircle className="mr-1" />;
      case 'Pending': return <FaClock className="mr-1" />;
      case 'Draft': return <FaEdit className="mr-1" />;
      default: return <FaClock className="mr-1" />;
    }
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="ml-1 text-white" /> : 
      <FaSortDown className="ml-1 text-white" />;
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'all' || report.status === filter;
    const matchesSearch = searchTerm === '' || 
      report.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  console.log('Reports:', reports);
  console.log('Filtered reports:', filteredReports);
  console.log('Sorted reports:', sortedReports);

  const handleViewReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setViewingReport(report);
    setShowViewModal(true);
  };

  const handleEditReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setEditingReport(report);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingReport(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingReport(null);
  };

  const handleCreateReport = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewReport({
      tournament: '',
      match: '',
      date: '',
      category: '',
      score: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    // In a real app, this would send data to your backend
    const report = {
      id: reports.length + 1,
      ...newReport,
      status: 'Draft',
      date: newReport.date || new Date().toISOString().split('T')[0]
    };
    
    setReports(prev => [report, ...prev]);
    handleCloseModal();
    alert('Report created successfully!');
  };

  const handleUpdateReport = (e) => {
    e.preventDefault();
    // In a real app, this would send data to your backend
    setReports(prev => 
      prev.map(report => 
        report.id === editingReport.id 
          ? { ...editingReport, date: editingReport.date || new Date().toISOString().split('T')[0] }
          : report
      )
    );
    handleCloseEditModal();
    alert('Report updated successfully!');
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Expert Karate - Judge Reports Summary', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add judge info
    doc.setFontSize(14);
    doc.text(`Judge: ${user?.name || 'N/A'}`, 20, 40);
    
    // Add stats summary
    doc.setFontSize(12);
    doc.text(`Total Reports: ${reports.length}`, 20, 50);
    doc.text(`Submitted: ${reports.filter(r => r.status === 'Submitted').length}`, 20, 60);
    doc.text(`Pending: ${reports.filter(r => r.status === 'Pending').length}`, 20, 70);
    doc.text(`Draft: ${reports.filter(r => r.status === 'Draft').length}`, 20, 80);
    
    // Save the PDF
    doc.save(`judge-reports-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Chart data for report status distribution
  const statusData = {
    labels: ['Submitted', 'Pending', 'Draft'],
    datasets: [
      {
        data: [
          reports.filter(r => r.status === 'Submitted').length,
          reports.filter(r => r.status === 'Pending').length,
          reports.filter(r => r.status === 'Draft').length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for reports by tournament
  const tournamentData = {
    labels: ['Summer Championship', 'Spring League', 'Winter Cup'],
    datasets: [
      {
        label: 'Reports',
        data: [
          reports.filter(r => r.tournament === 'Summer Championship').length,
          reports.filter(r => r.tournament === 'Spring League').length,
          reports.filter(r => r.tournament === 'Winter Cup').length
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for reports over time
  const timelineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Reports',
        data: [0, 0, 0, 2, 0, 0, 2, 0, 1, 0, 1, 0],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Modals */}
      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Create New Report</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmitReport}>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tournament</label>
                    <input
                      type="text"
                      name="tournament"
                      value={newReport.tournament}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter tournament name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Match</label>
                    <input
                      type="text"
                      name="match"
                      value={newReport.match}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Team A vs Team B"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={newReport.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={newReport.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter category"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Score</label>
                  <input
                    type="text"
                    name="score"
                    value={newReport.score}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter final score (e.g., 3-1)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={newReport.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter any additional notes about the match..."
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaSave className="mr-2" />
                  Create Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Report Modal */}
      {showEditModal && editingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Edit Report</h3>
              <button 
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdateReport}>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tournament</label>
                    <input
                      type="text"
                      name="tournament"
                      value={editingReport.tournament}
                      onChange={(e) => setEditingReport({...editingReport, tournament: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter tournament name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Match</label>
                    <input
                      type="text"
                      name="match"
                      value={editingReport.match}
                      onChange={(e) => setEditingReport({...editingReport, match: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Team A vs Team B"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={editingReport.date}
                      onChange={(e) => setEditingReport({...editingReport, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={editingReport.category}
                      onChange={(e) => setEditingReport({...editingReport, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter category"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Score</label>
                  <input
                    type="text"
                    name="score"
                    value={editingReport.score || ''}
                    onChange={(e) => setEditingReport({...editingReport, score: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter final score (e.g., 3-1)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    name="status"
                    value={editingReport.status}
                    onChange={(e) => setEditingReport({...editingReport, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={editingReport.notes || ''}
                    onChange={(e) => setEditingReport({...editingReport, notes: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter any additional notes about the match..."
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaSave className="mr-2" />
                  Update Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewModal && viewingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Report Details</h3>
              <button 
                onClick={handleCloseViewModal}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tournament</label>
                  <div className="text-white">{viewingReport.tournament}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Match</label>
                  <div className="text-white">{viewingReport.match}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <div className="text-white">{viewingReport.date}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <div className="text-white">{viewingReport.category}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Score</label>
                  <div className="text-white">{viewingReport.score || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingReport.status)}`}>
                    {getStatusIcon(viewingReport.status)}
                    {viewingReport.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                <div className="text-white bg-gray-700 p-3 rounded-md min-h-[100px]">
                  {viewingReport.notes || 'No notes provided'}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseViewModal}
                className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Close
              </button>
              {viewingReport.status !== 'Submitted' && (
                <button
                  onClick={() => {
                    handleCloseViewModal();
                    handleEditReport(viewingReport.id);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaEdit className="mr-2" />
                  Edit Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold leading-tight text-white flex items-center">
                <FaFileAlt className="mr-3 text-red-500" />
                Reports
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={exportToPDF}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaDownload className="mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={handleCreateReport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaPlus className="mr-2" />
                  Create Report
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-md p-3">
                        <FaFileAlt className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Total Reports</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">{reports.length}</div>
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
                          <dt className="text-sm font-medium text-gray-400 truncate">Submitted</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {reports.filter(r => r.status === 'Submitted').length}
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
                        <FaClock className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">Pending</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {reports.filter(r => r.status === 'Pending').length}
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
                              {[...new Set(reports.map(r => r.tournament))].length}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Status Distribution Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-red-500" />
                    Report Status Distribution
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

                {/* Reports by Tournament Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaTrophy className="mr-2 text-red-500" />
                    Reports by Tournament
                  </h3>
                  <div className="h-64">
                    <Bar 
                      data={tournamentData} 
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

                {/* Timeline Chart */}
                <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-red-500" />
                    Reports Timeline
                  </h3>
                  <div className="h-64">
                    <Line 
                      data={timelineData} 
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

              {/* Filter and Search Controls */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex-1 max-w-md">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-600 rounded-md bg-gray-800 text-white"
                        placeholder="Search reports..."
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
                      <FaFileAlt className="mr-2" />
                      All Reports
                    </button>
                    <button
                      onClick={() => setFilter('Submitted')}
                      className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                        filter === 'Submitted'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FaCheckCircle className="mr-2" />
                      Submitted
                    </button>
                    <button
                      onClick={() => setFilter('Pending')}
                      className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                        filter === 'Pending'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FaClock className="mr-2" />
                      Pending
                    </button>
                    <button
                      onClick={() => setFilter('Draft')}
                      className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${
                        filter === 'Draft'
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <FaEdit className="mr-2" />
                      Draft
                    </button>
                  </div>
                </div>
              </div>

              {/* Reports List */}
              <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Match Reports</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-400">
                    List of all match reports you have submitted or need to submit
                  </p>
                </div>
                <div className="border-t border-gray-700">
                  <div className="overflow-x-auto">
                    {sortedReports.length === 0 ? (
                      <div className="text-center py-12">
                        <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-300">No reports found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm || filter !== 'all' 
                            ? 'No reports match your search criteria.' 
                            : 'Get started by creating a new report.'}
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={handleCreateReport}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700"
                          >
                            <FaPlus className="mr-2" />
                            Create Report
                          </button>
                        </div>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                          <tr>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 flex items-center"
                              onClick={() => handleSort('tournament')}
                            >
                              Tournament
                              {getSortIcon('tournament')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Match
                            </th>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 flex items-center"
                              onClick={() => handleSort('date')}
                            >
                              Date
                              {getSortIcon('date')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Score
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
                          {sortedReports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-750">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{report.tournament}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-red-400">{report.match}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-300">
                                  <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400" />
                                  {report.date}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{report.category}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">
                                  {report.score || 'N/A'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                                  {getStatusIcon(report.status)}
                                  {report.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleViewReport(report.id)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 mr-2"
                                >
                                  <FaEye className="mr-1" />
                                  View
                                </button>
                                {report.status !== 'Submitted' && (
                                  <button
                                    onClick={() => handleEditReport(report.id)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-700"
                                  >
                                    <FaEdit className="mr-1" />
                                    Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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

export default JudgeReports;