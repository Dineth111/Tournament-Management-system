import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaMedal, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, 
  FaCalendarAlt, FaUsers, FaUser, FaTrophy, FaChartBar
} from 'react-icons/fa';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchScores();
  }, [currentPage]);

  const fetchScores = async () => {
    try {
      setLoading(true);
      // Simulate API call with sample data
      const sampleScores = [
        {
          _id: 1,
          match: { 
            team1: { name: 'Dragon Warriors' }, 
            team2: { name: 'Phoenix Fighters' },
            date: '2025-06-15'
          },
          player: null,
          team: { name: 'Dragon Warriors' },
          value: 8.5,
          category: 'Kata',
          judge: { name: 'Sensei Yamamoto' },
          createdAt: '2025-06-15T10:30:00Z'
        },
        {
          _id: 2,
          match: { 
            team1: { name: 'Tiger Masters' }, 
            team2: { name: 'Eagle Champions' },
            date: '2025-12-01'
          },
          player: { name: 'John Smith' },
          team: null,
          value: 7.2,
          category: 'Kumite',
          judge: { name: 'Master Chen' },
          createdAt: '2025-12-01T14:45:00Z'
        },
        {
          _id: 3,
          match: { 
            team1: { name: 'Dragon Warriors' }, 
            team2: { name: 'Tiger Masters' },
            date: '2025-08-10'
          },
          player: null,
          team: { name: 'Tiger Masters' },
          value: 9.1,
          category: 'Kata',
          judge: { name: 'Judge Williams' },
          createdAt: '2025-08-10T11:20:00Z'
        },
        {
          _id: 4,
          match: { 
            team1: { name: 'Phoenix Fighters' }, 
            team2: { name: 'Eagle Champions' },
            date: '2025-04-20'
          },
          player: { name: 'Jane Doe' },
          team: null,
          value: 8.8,
          category: 'Kumite',
          judge: { name: 'Sensei Rodriguez' },
          createdAt: '2025-04-20T16:15:00Z'
        },
        {
          _id: 5,
          match: { 
            team1: { name: 'Dragon Warriors' }, 
            team2: { name: 'Eagle Champions' },
            date: '2025-09-05'
          },
          player: null,
          team: { name: 'Dragon Warriors' },
          value: 7.9,
          category: 'Kata',
          judge: { name: 'Master Johnson' },
          createdAt: '2025-09-05T13:30:00Z'
        }
      ];
      
      // Apply filters
      let filteredScores = sampleScores;
      if (searchTerm) {
        filteredScores = filteredScores.filter(score => 
          (score.team?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          score.player?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          score.match.team1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          score.match.team2.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (categoryFilter !== 'all') {
        filteredScores = filteredScores.filter(score => 
          score.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      
      setScores(filteredScores);
      setTotalPages(2);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch scores');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this score?')) {
      try {
        // Simulate API call
        setScores(scores.filter(score => score._id !== id));
      } catch (err) {
        setError('Failed to delete score');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'kata': return 'bg-blue-100 text-blue-800';
      case 'kumite': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'kata': return <FaChartBar className="text-blue-500" />;
      case 'kumite': return <FaMedal className="text-red-500" />;
      default: return <FaTrophy className="text-gray-500" />;
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Scores Management</h1>
          <p className="text-gray-400">Manage all scores in the system</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center">
              <FaTimes className="mr-3 text-red-400" />
              {error}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search scores..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
            <button className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105">
              <FaPlus className="mr-2" />
              Add New Score
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  <option value="kata">Kata</option>
                  <option value="kumite">Kumite</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setDateFilter('all');
                  }}
                  className="w-full px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scores Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Score List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {scores.length} scores</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Match
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Player/Team
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Judge
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {scores.map((score) => (
                  <tr key={score._id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                          <FaUsers className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">
                            {score.match?.team1?.name || 'Team 1'} <span className="text-gray-400">vs</span> {score.match?.team2?.name || 'Team 2'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {score.match ? new Date(score.match.date).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {score.player ? <FaUser className="text-blue-500" /> : <FaUsers className="text-green-500" />}
                        </div>
                        <div className="text-sm text-white">
                          {score.player ? score.player.name : score.team ? score.team.name : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-2xl font-bold text-white">{score.value || 'N/A'}</div>
                      <div className="w-24 bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-red-600 to-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(score.value / 10) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getCategoryIcon(score.category)}
                        </div>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(score.category)}`}>
                          {score.category || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-white">{score.judge?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaCalendarAlt className="text-yellow-500" />
                        </div>
                        <div className="text-sm text-white">
                          {score.createdAt ? new Date(score.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200">
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(score._id)}
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

            {scores.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaMedal className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No scores found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-750 border-t border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scores;