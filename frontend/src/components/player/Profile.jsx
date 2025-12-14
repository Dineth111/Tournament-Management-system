import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaUsers, FaFlag, FaTrophy, FaKey, FaSave, FaTimes } from 'react-icons/fa';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    team: '',
    category: '',
    position: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // In a real application, you would fetch this data from your API
      // For now, we'll use the user data passed as props
      setProfileData({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        team: 'Team Alpha',
        category: 'U18 Male',
        position: 'Forward'
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccess('');
      setError('');
      // In a real application, you would send this data to your API
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setSuccess('Profile updated successfully');
      }, 500);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <FaUser className="text-red-500 text-2xl mr-2" />
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
        </div>
        <p className="text-gray-400">Manage your profile information and security settings</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative">
          <div className="flex items-center">
            <FaTimes className="mr-2" />
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-lg relative">
          <div className="flex items-center">
            <FaSave className="mr-2" />
            {success}
          </div>
        </div>
      )}

      <div className="bg-gray-800 shadow-xl overflow-hidden sm:rounded-xl border border-gray-700 mb-8">
        <div className="px-6 py-5 sm:p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaUser className="mr-2 text-red-500" />
            Profile Information
          </h2>
          <p className="mt-1 text-sm text-gray-400">Update your personal details</p>
        </div>
        <div className="px-6 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 flex items-center">
                  <FaUser className="mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 flex items-center">
                  <FaEnvelope className="mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="team" className="block text-sm font-medium text-gray-300 flex items-center">
                  <FaUsers className="mr-2" />
                  Team
                </label>
                <input
                  type="text"
                  name="team"
                  id="team"
                  value={profileData.team}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 flex items-center">
                  <FaFlag className="mr-2" />
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={profileData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="position" className="block text-sm font-medium text-gray-300 flex items-center">
                  <FaTrophy className="mr-2" />
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  id="position"
                  value={profileData.position}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 flex items-center">
                  <FaUser className="mr-2" />
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={profileData.role}
                  disabled
                  className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-gray-400"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-gray-800 shadow-xl overflow-hidden sm:rounded-xl border border-gray-700">
        <div className="px-6 py-5 sm:p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaKey className="mr-2 text-yellow-500" />
            Change Password
          </h2>
          <p className="mt-1 text-sm text-gray-400">Update your password for security</p>
        </div>
        <div className="px-6 py-5 sm:p-6">
          <form className="mt-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 flex items-center">
                  <FaKey className="mr-2" />
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 flex items-center">
                  <FaKey className="mr-2" />
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 flex items-center">
                  <FaKey className="mr-2" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  <FaKey className="mr-2" />
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;