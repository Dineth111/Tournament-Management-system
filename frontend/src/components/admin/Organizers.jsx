import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, 
  FaBuilding, FaPhone, FaEnvelope, FaCheckCircle, FaBan, FaCheck
} from 'react-icons/fa';

const Organizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrganizers();
  }, [currentPage]);

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      // Simulate API call with sample data
      const sampleOrganizers = [
        {
          _id: 1,
          user: { name: 'Alex Morgan', email: 'alex@karateorg.com' },
          organizationName: 'National Karate Federation',
          contactPerson: 'Sarah Johnson',
          phone: '+1 (555) 123-4567',
          isActive: true,
          tournamentsOrganized: 15,
          members: 240
        },
        {
          _id: 2,
          user: { name: 'Michael Chen', email: 'michael@dragonkarate.com' },
          organizationName: 'Dragon Karate Academy',
          contactPerson: 'Lisa Wong',
          phone: '+1 (555) 987-6543',
          isActive: true,
          tournamentsOrganized: 8,
          members: 180
        },
        {
          _id: 3,
          user: { name: 'Robert Wilson', email: 'robert@tigerdojo.com' },
          organizationName: 'Tiger Dojo',
          contactPerson: 'Emma Davis',
          phone: '+1 (555) 456-7890',
          isActive: false,
          tournamentsOrganized: 12,
          members: 150
        },
        {
          _id: 4,
          user: { name: 'Jennifer Lee', email: 'jennifer@phoenixkarate.com' },
          organizationName: 'Phoenix Karate Club',
          contactPerson: 'Mark Thompson',
          phone: '+1 (555) 234-5678',
          isActive: true,
          tournamentsOrganized: 6,
          members: 95
        },
        {
          _id: 5,
          user: { name: 'David Brown', email: 'david@blackbelt.org' },
          organizationName: 'Black Belt Association',
          contactPerson: 'Karen White',
          phone: '+1 (555) 876-5432',
          isActive: true,
          tournamentsOrganized: 22,
          members: 320
        }
      ];
      
      // Apply filters
      let filteredOrganizers = sampleOrganizers;
      if (searchTerm) {
        filteredOrganizers = filteredOrganizers.filter(organizer => 
          organizer.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          organizer.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          organizer.user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredOrganizers = filteredOrganizers.filter(organizer => organizer.isActive === isActive);
      }
      
      setOrganizers(filteredOrganizers);
      setTotalPages(2);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch organizers');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this organizer?')) {
      try {
        // Simulate API call
        setOrganizers(organizers.filter(organizer => organizer._id !== id));
      } catch (err) {
        setError('Failed to delete organizer');
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

  const toggleOrganizerStatus = async (id) => {
    try {
      // Simulate API call
      setOrganizers(organizers.map(organizer => 
        organizer._id === id ? { ...organizer, isActive: !organizer.isActive } : organizer
      ));
    } catch (err) {
      setError('Failed to update organizer status');
    }
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-white mb-2">Organizers Management</h1>
          <p className="text-gray-400">Manage all organizers in the system</p>
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
                  placeholder="Search organizers..."
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
              Add New Organizer
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="w-full px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Organizers Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Organizer List</h2>
            <p className="text-gray-400 text-sm mt-1">Showing {organizers.length} organizers</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Organizer
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Organization
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Stats
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
                {organizers.map((organizer) => (
                  <tr key={organizer._id} className="hover:bg-gray-750 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">
                            {organizer.user?.name?.charAt(0)?.toUpperCase() || 'O'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{organizer.user?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{organizer.user?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <FaBuilding className="text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{organizer.organizationName || 'N/A'}</div>
                          <div className="text-sm text-gray-400">Contact: {organizer.contactPerson || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                          <div className="mr-2">
                            <FaPhone className="text-green-500" />
                          </div>
                          <div className="text-sm text-white">{organizer.phone || 'N/A'}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-2">
                            <FaEnvelope className="text-yellow-500" />
                          </div>
                          <div className="text-sm text-white">{organizer.user?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <span className="font-bold text-red-400">{organizer.tournamentsOrganized || 0}</span> tournaments
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="font-bold text-blue-400">{organizer.members || 0}</span> members
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(organizer.isActive)}`}>
                        {organizer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => toggleOrganizerStatus(organizer._id)}
                          className={`p-2 rounded-lg ${organizer.isActive ? 'text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10' : 'text-green-400 hover:bg-green-400 hover:bg-opacity-10'} transition-colors duration-200`}
                          title={organizer.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {organizer.isActive ? <FaBan /> : <FaCheck />}
                        </button>
                        <button className="p-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 transition-colors duration-200">
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(organizer._id)}
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

            {organizers.length === 0 && !loading && (
              <div className="text-center py-12">
                <FaUsers className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No organizers found</h3>
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

export default Organizers;