import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

interface PlayerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  belt: string;
  weight: string;
  height: string;
  dojo: string;
  experience: string;
  achievements: string;
}

export default function PlayerProfile() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState<PlayerProfile>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    belt: 'White Belt',
    weight: '',
    height: '',
    dojo: '',
    experience: '',
    achievements: ''
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const beltColors: Record<string, string> = {
    'White Belt': 'bg-gray-100 text-gray-800',
    'Yellow Belt': 'bg-yellow-100 text-yellow-800',
    'Orange Belt': 'bg-orange-100 text-orange-800',
    'Green Belt': 'bg-green-100 text-green-800',
    'Blue Belt': 'bg-blue-100 text-blue-800',
    'Brown Belt': 'bg-amber-700 text-white',
    'Black Belt': 'bg-gray-800 text-white',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your personal information and karate details</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold mr-6">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <div className="flex items-center mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${beltColors[profile.belt]}`}>
                      {profile.belt}
                    </span>
                    <span className="ml-3 text-gray-600">
                      {profile.weight}kg | {profile.height}cm
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition duration-200 font-semibold"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Content */}
            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="belt" className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Belt Rank
                    </label>
                    <select
                      id="belt"
                      name="belt"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.belt}
                      onChange={(e) => setProfile({...profile, belt: e.target.value})}
                    >
                      <option value="White Belt">White Belt</option>
                      <option value="Yellow Belt">Yellow Belt</option>
                      <option value="Orange Belt">Orange Belt</option>
                      <option value="Green Belt">Green Belt</option>
                      <option value="Blue Belt">Blue Belt</option>
                      <option value="Brown Belt">Brown Belt</option>
                      <option value="Black Belt">Black Belt</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      id="weight"
                      name="weight"
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.weight}
                      onChange={(e) => setProfile({...profile, weight: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      id="height"
                      name="height"
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.height}
                      onChange={(e) => setProfile({...profile, height: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="dojo" className="block text-sm font-semibold text-gray-700 mb-2">
                      Dojo/Affiliation
                    </label>
                    <input
                      id="dojo"
                      name="dojo"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.dojo}
                      onChange={(e) => setProfile({...profile, dojo: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.experience}
                      onChange={(e) => setProfile({...profile, experience: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="achievements" className="block text-sm font-semibold text-gray-700 mb-2">
                      Achievements
                    </label>
                    <textarea
                      id="achievements"
                      name="achievements"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.achievements}
                      onChange={(e) => setProfile({...profile, achievements: e.target.value})}
                      placeholder="List your karate achievements, tournament wins, etc."
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition duration-200 font-semibold shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">First Name</p>
                          <p className="font-medium text-gray-800">{profile.firstName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Name</p>
                          <p className="font-medium text-gray-800">{profile.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-800">{profile.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-800">{profile.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="font-medium text-gray-800">{profile.dateOfBirth || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Karate Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Belt Rank</p>
                          <p className="font-medium text-gray-800">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${beltColors[profile.belt]}`}>
                              {profile.belt}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Weight</p>
                          <p className="font-medium text-gray-800">{profile.weight ? `${profile.weight} kg` : 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Height</p>
                          <p className="font-medium text-gray-800">{profile.height ? `${profile.height} cm` : 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium text-gray-800">{profile.experience ? `${profile.experience} years` : 'Not provided'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Dojo/Affiliation</p>
                          <p className="font-medium text-gray-800">{profile.dojo || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Achievements</h3>
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                    {profile.achievements ? (
                      <p className="text-gray-800 whitespace-pre-line">{profile.achievements}</p>
                    ) : (
                      <p className="text-gray-500 italic">No achievements added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
