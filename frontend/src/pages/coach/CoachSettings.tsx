import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  matchReminders: boolean;
  performanceReports: boolean;
  teamUpdates: boolean;
}

interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  dojo: string;
  experience: string;
}

export default function CoachSettings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    dojo: '',
    experience: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    matchReminders: true,
    performanceReports: true,
    teamUpdates: true
  });
  
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    alert('Profile settings updated successfully!');
  };

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    alert('Notification settings updated successfully!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // In a real app, this would send data to the backend
    alert('Password updated successfully!');
    setPasswordSettings({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === 'notifications'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === 'password'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Password
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === 'team'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Team Preferences
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={profileSettings.firstName}
                        onChange={(e) => setProfileSettings({...profileSettings, firstName: e.target.value})}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={profileSettings.lastName}
                        onChange={(e) => setProfileSettings({...profileSettings, lastName: e.target.value})}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={profileSettings.email}
                        onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={profileSettings.phone}
                        onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={profileSettings.dojo}
                        onChange={(e) => setProfileSettings({...profileSettings, dojo: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                        Years of Coaching Experience
                      </label>
                      <input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={profileSettings.experience}
                        onChange={(e) => setProfileSettings({...profileSettings, experience: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={profileSettings.bio}
                        onChange={(e) => setProfileSettings({...profileSettings, bio: e.target.value})}
                        placeholder="Tell us about your coaching philosophy and experience..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition duration-200 font-semibold shadow-lg"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Settings</h2>
                <form onSubmit={handleNotificationUpdate}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                          aria-label="Toggle email notifications"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
                          aria-label="Toggle SMS notifications"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800">Match Reminders</h3>
                        <p className="text-sm text-gray-600">Get reminders before matches</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationSettings.matchReminders}
                          onChange={(e) => setNotificationSettings({...notificationSettings, matchReminders: e.target.checked})}
                          aria-label="Toggle match reminders"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800">Performance Reports</h3>
                        <p className="text-sm text-gray-600">Weekly performance reports for your team</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationSettings.performanceReports}
                          onChange={(e) => setNotificationSettings({...notificationSettings, performanceReports: e.target.checked})}
                          aria-label="Toggle performance reports"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800">Team Updates</h3>
                        <p className="text-sm text-gray-600">Notifications about team changes and updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notificationSettings.teamUpdates}
                          onChange={(e) => setNotificationSettings({...notificationSettings, teamUpdates: e.target.checked})}
                          aria-label="Toggle team updates"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition duration-200 font-semibold shadow-lg"
                    >
                      Save Notification Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={passwordSettings.currentPassword}
                        onChange={(e) => setPasswordSettings({...passwordSettings, currentPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={passwordSettings.newPassword}
                        onChange={(e) => setPasswordSettings({...passwordSettings, newPassword: e.target.value})}
                      />
                      <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={passwordSettings.confirmPassword}
                        onChange={(e) => setPasswordSettings({...passwordSettings, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition duration-200 font-semibold shadow-lg"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Team Preferences Tab */}
            {activeTab === 'team' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Training Schedule</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Monday</span>
                        <div className="flex space-x-2">
                          <div>
                            <label htmlFor="monday-start" className="sr-only">Monday Start Time</label>
                            <input
                              id="monday-start"
                              name="monday-start"
                              type="time"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              defaultValue="17:00"
                            />
                          </div>
                          <div>
                            <label htmlFor="monday-end" className="sr-only">Monday End Time</label>
                            <input
                              id="monday-end"
                              name="monday-end"
                              type="time"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              defaultValue="19:00"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Wednesday</span>
                        <div className="flex space-x-2">
                          <div>
                            <label htmlFor="wednesday-start" className="sr-only">Wednesday Start Time</label>
                            <input
                              id="wednesday-start"
                              name="wednesday-start"
                              type="time"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              defaultValue="17:00"
                            />
                          </div>
                          <div>
                            <label htmlFor="wednesday-end" className="sr-only">Wednesday End Time</label>
                            <input
                              id="wednesday-end"
                              name="wednesday-end"
                              type="time"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              defaultValue="19:00"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Friday</span>
                        <div className="flex space-x-2">
                          <div>
                            <label htmlFor="friday-start" className="sr-only">Friday Start Time</label>
                            <input
                              id="friday-start"
                              name="friday-start"
                              type="time"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              defaultValue="17:00"
                            />
                          </div>
                          <div>
                            <label htmlFor="friday-end" className="sr-only">Friday End Time</label>
                            <input
                              id="friday-end"
                              name="friday-end"
                              type="time"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              defaultValue="19:00"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Competition Categories</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="kata"
                          name="kata"
                          type="checkbox"
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                          defaultChecked
                        />
                        <label htmlFor="kata" className="ml-2 text-sm font-medium text-gray-700">
                          Kata
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="kumite"
                          name="kumite"
                          type="checkbox"
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                          defaultChecked
                        />
                        <label htmlFor="kumite" className="ml-2 text-sm font-medium text-gray-700">
                          Kumite
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="team-kata"
                          name="team-kata"
                          type="checkbox"
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="team-kata" className="ml-2 text-sm font-medium text-gray-700">
                          Team Kata
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="team-kumite"
                          name="team-kumite"
                          type="checkbox"
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="team-kumite" className="ml-2 text-sm font-medium text-gray-700">
                          Team Kumite
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tournament Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Age Groups</label>
                        <label htmlFor="age-groups" className="sr-only">Preferred Age Groups</label>
                        <select 
                          id="age-groups"
                          name="age-groups"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option>Junior (8-12)</option>
                          <option>Teen (13-17)</option>
                          <option>Senior (18+)</option>
                          <option>All Ages</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Belt Levels</label>
                        <label htmlFor="belt-levels" className="sr-only">Preferred Belt Levels</label>
                        <select 
                          id="belt-levels"
                          name="belt-levels"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option>White to Blue</option>
                          <option>White to Brown</option>
                          <option>White to Black</option>
                          <option>All Levels</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notification Lead Time</label>
                        <label htmlFor="notification-time" className="sr-only">Notification Lead Time</label>
                        <select 
                          id="notification-time"
                          name="notification-time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option>1 Week</option>
                          <option>2 Weeks</option>
                          <option>1 Month</option>
                          <option>2 Months</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition duration-200 font-semibold shadow-lg"
                  >
                    Save Team Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
