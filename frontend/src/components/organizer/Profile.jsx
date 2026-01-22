import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaBuilding, FaPhone, FaMapMarkerAlt, FaGlobe, FaKey, FaSave, FaTimes, FaEdit } from 'react-icons/fa';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    organizationName: '',
    contactPerson: '',
    phone: '',
    address: '',
    website: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
        organizationName: 'Sports Management Inc.',
        contactPerson: 'John Smith',
        phone: '+1 (555) 123-4567',
        address: '123 Sports Avenue, City, State 12345',
        website: 'https://sportsmanagement.com'
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
        setIsEditing(false);
      }, 500);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset to original data
    fetchProfileData();
    setIsEditing(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FaUser className="mr-2 text-indigo-400" /> My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-400">Manage your profile information</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded relative">
            {success}
          </div>
        )}

        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-indigo-300 bg-gray-700 hover:bg-gray-600"
                >
                  <FaEdit className="mr-1" /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 flex items-center">
                      <FaUser className="mr-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 flex items-center">
                      <FaEnvelope className="mr-2" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-300 flex items-center">
                      <FaBuilding className="mr-2" /> Organization Name
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      id="organizationName"
                      value={profileData.organizationName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-300 flex items-center">
                      <FaUser className="mr-2" /> Contact Person
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      id="contactPerson"
                      value={profileData.contactPerson}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 flex items-center">
                      <FaPhone className="mr-2" /> Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300 flex items-center">
                      <FaMapMarkerAlt className="mr-2" /> Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300 flex items-center">
                      <FaGlobe className="mr-2" /> Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 flex items-center">
                      <FaUser className="mr-2" /> Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      id="role"
                      value={profileData.role}
                      disabled
                      className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-gray-400"
                    />
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-5">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaTimes className="mr-2" /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <div className="text-sm font-medium text-gray-400 flex items-center">
                    <FaUser className="mr-2" /> Full Name
                  </div>
                  <div className="mt-1 text-sm text-white">{profileData.name}</div>
                </div>

                <div className="sm:col-span-6">
                  <div className="text-sm font-medium text-gray-400 flex items-center">
                    <FaEnvelope className="mr-2" /> Email Address
                  </div>
                  <div className="mt-1 text-sm text-white">{profileData.email}</div>
                </div>

                <div className="sm:col-span-6">
                  <div className="text-sm font-medium text-gray-400 flex items-center">
                    <FaBuilding className="mr-2" /> Organization Name
                  </div>
                  <div className="mt-1 text-sm text-white">{profileData.organizationName}</div>
                </div>

                <div className="sm:col-span-3">
                  <div className="text-sm font-medium text-gray-400 flex items-center">
                    <FaUser className="mr-2" /> Contact Person
                  </div>
                  <div className="mt-1 text-sm text-white">{profileData.contactPerson}</div>
                </div>

                <div className="sm:col-span-3">
                  <div className="text-sm font-medium text-gray-400 flex items-center">
                    <FaPhone className="mr-2" /> Phone
                  </div>
                  <div className="mt-1 text-sm text-white">{profileData.phone}</div>
                </div>

                <div className="sm:col-span-6">
                  <div className="text-sm font-medium text-gray-400 flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Address
                  </div>
                  <div className="mt-1 text-sm text-white">{profileData.address}</div>
                </div>

                <div className="sm:col-span-6">
                  <div className="text-sm font-medium text-gray-400 flex items-center">
                    <FaGlobe className="mr-2" /> Website
                  </div>
                  <div className="mt-1 text-sm text-white">
                    <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                      {profileData.website}
                    </a>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <div className="text-sm font-medium text-gray-400 flex items-center">
                    <FaUser className="mr-2" /> Role
                  </div>
                  <div className="mt-1 text-sm text-white">{profileData.role}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-8 bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-white flex items-center">
              <FaKey className="mr-2 text-indigo-400" /> Change Password
            </h2>
            <p className="mt-1 text-sm text-gray-400">Update your password</p>
            
            <form className="mt-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaKey className="mr-2" /> Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaKey className="mr-2" /> New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaKey className="mr-2" /> Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="mt-8 border-t border-gray-700 pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaSave className="mr-2" /> Update Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;