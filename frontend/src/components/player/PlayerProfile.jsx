import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUsers, FaFlag, FaMapMarkerAlt, FaPhone, FaEdit, FaSave, FaTimes, FaTrophy } from 'react-icons/fa';

const PlayerProfile = ({ user }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    team: '',
    category: '',
    position: '',
    age: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      const mockData = {
        name: user?.name || 'John Doe',
        email: user?.email || 'john.doe@example.com',
        team: 'Team Alpha',
        category: 'U18 Male',
        position: 'Forward',
        age: '22',
        phone: '+1 (555) 123-4567',
        address: '123 Sports Avenue, City, State'
      };
      setProfileData(mockData);
      setFormData(mockData);
      setLoading(false);
    }, 500);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate saving data
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <FaUser className="text-red-500 text-3xl mr-3" />
          <h1 className="text-3xl font-bold leading-tight text-white">Player Profile</h1>
        </div>
        <p className="text-gray-400 mb-8">Manage your personal information and team details</p>
        
        <div className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700">
          <div className="px-6 py-5 sm:px-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-xl leading-6 font-medium text-white flex items-center">
                <FaUser className="mr-2 text-red-500" />
                Profile Information
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-lg"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="px-6 py-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaUser className="mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaEnvelope className="mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="team" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaUsers className="mr-2" />
                    Team
                  </label>
                  <input
                    type="text"
                    name="team"
                    id="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaFlag className="mr-2" />
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaTrophy className="mr-2" />
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    id="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="age" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaUser className="mr-2" />
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaPhone className="mr-2" />
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-300 flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-5 py-2.5 border border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center py-2.5 px-5 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-gray-750 border border-gray-700 rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-5 flex items-center">
                    <FaUser className="mr-2 text-red-500" />
                    Personal Information
                  </h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-5">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaUser className="mr-2" />
                        Full Name
                      </dt>
                      <dd className="text-sm text-white">{profileData.name}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaEnvelope className="mr-2" />
                        Email
                      </dt>
                      <dd className="text-sm text-white">{profileData.email}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaUser className="mr-2" />
                        Age
                      </dt>
                      <dd className="text-sm text-white">{profileData.age}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaPhone className="mr-2" />
                        Phone
                      </dt>
                      <dd className="text-sm text-white">{profileData.phone}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        Address
                      </dt>
                      <dd className="text-sm text-white max-w-xs text-right">{profileData.address}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-750 border border-gray-700 rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-5 flex items-center">
                    <FaUsers className="mr-2 text-blue-500" />
                    Team Information
                  </h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-5">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaUsers className="mr-2" />
                        Team
                      </dt>
                      <dd className="text-sm text-white">{profileData.team}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaFlag className="mr-2" />
                        Category
                      </dt>
                      <dd className="text-sm text-white">{profileData.category}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-sm font-medium text-gray-400 flex items-center">
                        <FaTrophy className="mr-2" />
                        Position
                      </dt>
                      <dd className="text-sm text-white">{profileData.position}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;