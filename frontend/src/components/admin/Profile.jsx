import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaEnvelope, FaUserShield, FaKey, FaSave, FaTimes, FaCheck,
  FaLock, FaEye, FaEyeSlash, FaUserEdit, FaCamera, FaChartBar, FaCog,
  FaBell, FaPalette, FaGlobe
} from 'react-icons/fa';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    avatar: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        setProfileData({
          name: user?.name || 'Admin User',
          email: user?.email || 'admin@example.com',
          role: user?.role || 'admin',
          avatar: ''
        });
        setLoading(false);
      }, 500);
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
      // Simulate API call
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
      setPasswordSuccess('');
      setPasswordError('');
      
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
        return;
      }
      
      // Simulate API call
      setTimeout(() => {
        setPasswordSuccess('Password updated successfully');
        // Reset password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 500);
    } catch (err) {
      setPasswordError('Failed to update password');
    }
  };

  const handleAvatarChange = (e) => {
    // In a real application, you would handle file upload here
    const file = e.target.files[0];
    if (file) {
      // Simulate avatar update
      setProfileData(prev => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
      setSuccess('Avatar updated successfully');
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-400">Manage your profile information and preferences</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-xl shadow-lg flex items-center">
            <FaTimes className="mr-3 text-red-400" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900 border border-green-700 text-green-100 px-6 py-4 rounded-xl shadow-lg flex items-center">
            <FaCheck className="mr-3 text-green-400" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 flex items-center justify-center shadow-lg">
                    {profileData.avatar ? (
                      <img 
                        src={profileData.avatar} 
                        alt="Profile" 
                        className="h-32 w-32 rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-16 w-16 text-white" />
                    )}
                  </div>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full p-3 cursor-pointer shadow-lg hover:opacity-90 transition-opacity duration-200"
                  >
                    <FaCamera className="h-5 w-5 text-white" />
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-white">{profileData.name}</h2>
                <p className="text-gray-400 capitalize">{profileData.role}</p>
                <div className="mt-4 flex space-x-2">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white">
                    {profileData.role}
                  </span>
                </div>
              </div>
              
              {/* Profile Stats */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Profile Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaChartBar className="text-red-500 mr-2" />
                      <span className="text-gray-400">Activity</span>
                    </div>
                    <span className="font-bold text-white">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaBell className="text-yellow-500 mr-2" />
                      <span className="text-gray-400">Notifications</span>
                    </div>
                    <span className="font-bold text-white">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaCog className="text-blue-500 mr-2" />
                      <span className="text-gray-400">Settings</span>
                    </div>
                    <span className="font-bold text-white">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 mb-8">
              <div className="px-6 py-5 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaUserEdit className="mr-3 text-red-500" />
                  Profile Information
                </h2>
                <p className="text-gray-400 text-sm mt-1">Update your personal information</p>
              </div>
              <div className="px-6 py-5">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                        Role
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserShield className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="role"
                          id="role"
                          value={profileData.role}
                          disabled
                          className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-gray-700 pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="px-6 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
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
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 mb-8">
              <div className="px-6 py-5 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaKey className="mr-3 text-red-500" />
                  Change Password
                </h2>
                <p className="text-gray-400 text-sm mt-1">Update your password</p>
              </div>
              <div className="px-6 py-5">
                {passwordError && (
                  <div className="mb-6 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg flex items-center">
                    <FaTimes className="mr-2 text-red-400" />
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mb-6 bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-lg flex items-center">
                    <FaCheck className="mr-2 text-green-400" />
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <FaEyeSlash className="text-gray-400 hover:text-white" />
                          ) : (
                            <FaEye className="text-gray-400 hover:text-white" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaKey className="text-gray-400" />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <FaEyeSlash className="text-gray-400 hover:text-white" />
                          ) : (
                            <FaEye className="text-gray-400 hover:text-white" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaKey className="text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <FaEyeSlash className="text-gray-400 hover:text-white" />
                          ) : (
                            <FaEye className="text-gray-400 hover:text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-gray-700 pt-5">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="ml-3 inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
                      >
                        <FaKey className="mr-2" />
                        Update Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700">
              <div className="px-6 py-5 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaCog className="mr-3 text-red-500" />
                  Preferences
                </h2>
                <p className="text-gray-400 text-sm mt-1">Customize your experience</p>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Theme
                    </label>
                    <div className="flex items-center">
                      <div className="flex items-center mr-6">
                        <input
                          id="dark-theme"
                          name="theme"
                          type="radio"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-700"
                        />
                        <label htmlFor="dark-theme" className="ml-2 block text-sm text-white">
                          Dark
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="light-theme"
                          name="theme"
                          type="radio"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-700"
                        />
                        <label htmlFor="light-theme" className="ml-2 block text-sm text-white">
                          Light
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notifications
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaBell className="text-yellow-500 mr-2" />
                        <span className="text-white">Email Notifications</span>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Language
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaGlobe className="text-gray-400" />
                      </div>
                      <select
                        className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-600 text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="ml-3 inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
                    >
                      <FaSave className="mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;