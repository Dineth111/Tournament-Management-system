import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaEnvelope, FaShieldAlt, FaGraduationCap, 
  FaTrophy, FaSave, FaKey, FaTimes, FaCheck 
} from 'react-icons/fa';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    specialization: '',
    experience: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
        specialization: 'Karate',
        experience: '5 years'
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      // In a real application, you would send this data to your API
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setSuccess('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 500);
    } catch (err) {
      setError('Failed to update password');
    }
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
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-white flex items-center">
              <FaUser className="mr-3 text-red-500" />
              My Profile
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {error && (
                <div className="mb-6 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg flex items-center">
                  <FaTimes className="mr-2" />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-lg flex items-center">
                  <FaCheck className="mr-2" />
                  {success}
                </div>
              )}

              <div className="bg-gray-800 shadow rounded-lg border border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-medium text-white mb-6">Profile Information</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <FaUser className="mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <FaEnvelope className="mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <FaGraduationCap className="mr-2" />
                          Specialization
                        </label>
                        <input
                          type="text"
                          name="specialization"
                          id="specialization"
                          value={profileData.specialization}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <FaTrophy className="mr-2" />
                          Experience
                        </label>
                        <input
                          type="text"
                          name="experience"
                          id="experience"
                          value={profileData.experience}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <FaShieldAlt className="mr-2" />
                          Role
                        </label>
                        <input
                          type="text"
                          name="role"
                          id="role"
                          value={profileData.role}
                          disabled
                          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white opacity-75"
                        />
                      </div>
                    </div>

                    <div className="mt-8 border-t border-gray-700 pt-5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="bg-gray-700 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
              <div className="mt-8 bg-gray-800 shadow rounded-lg border border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-medium text-white mb-6 flex items-center">
                    <FaKey className="mr-2 text-red-500" />
                    Change Password
                  </h2>
                  
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-8 border-t border-gray-700 pt-5">
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;