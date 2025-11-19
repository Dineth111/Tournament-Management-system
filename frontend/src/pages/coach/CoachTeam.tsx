import { useState } from 'react';
import toast from 'react-hot-toast';

interface Player {
  id: string;
  name: string;
  age: number;
  belt: string;
  weight: string;
  category: string;
  wins: number;
  losses: number;
  status: string;
  email: string;
  phone: string;
}

export default function CoachTeam() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPlayer, setNewPlayer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    belt: '',
    weight: '',
    category: ''
  });

  const [players] = useState<Player[]>([
    { id: '1', name: 'Kamal Silva', age: 16, belt: 'Black Belt', weight: '65kg', category: 'Kumite', wins: 12, losses: 3, status: 'Active', email: 'kamal@email.com', phone: '+94771234567' },
    { id: '2', name: 'Nimal Perera', age: 14, belt: 'Brown Belt', weight: '55kg', category: 'Kata', wins: 8, losses: 2, status: 'Active', email: 'nimal@email.com', phone: '+94771234568' },
    { id: '3', name: 'Saman Fernando', age: 18, belt: 'Black Belt', weight: '75kg', category: 'Kumite', wins: 15, losses: 4, status: 'Active', email: 'saman@email.com', phone: '+94771234569' },
    { id: '4', name: 'Amal Jayasinghe', age: 15, belt: 'Brown Belt', weight: '60kg', category: 'Kumite', wins: 10, losses: 5, status: 'Active', email: 'amal@email.com', phone: '+94771234570' },
    { id: '5', name: 'Ruwan Dias', age: 13, belt: 'Blue Belt', weight: '50kg', category: 'Kata', wins: 6, losses: 1, status: 'Active', email: 'ruwan@email.com', phone: '+94771234571' },
    { id: '6', name: 'Kasun Bandara', age: 17, belt: 'Black Belt', weight: '70kg', category: 'Kumite', wins: 14, losses: 3, status: 'Injured', email: 'kasun@email.com', phone: '+94771234572' },
  ]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Player added to team successfully!');
    setShowAddModal(false);
    setNewPlayer({ firstName: '', lastName: '', email: '', phone: '', age: '', belt: '', weight: '', category: '' });
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.belt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const beltColors: Record<string, string> = {
    'Black Belt': 'bg-gray-800 text-white',
    'Brown Belt': 'bg-amber-700 text-white',
    'Blue Belt': 'bg-blue-600 text-white',
    'Green Belt': 'bg-green-600 text-white',
    'Yellow Belt': 'bg-yellow-500 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                My Team
              </h1>
              <p className="text-gray-600">Manage and track your student athletes</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition duration-200 flex items-center shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{players.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Players</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{players.filter(p => p.status === 'Active').length}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Wins</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{players.reduce((sum, p) => sum + p.wins, 0)}</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg">
                <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Win Rate</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {Math.round((players.reduce((sum, p) => sum + p.wins, 0) / (players.reduce((sum, p) => sum + p.wins + p.losses, 0)) * 100))}%
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, belt, or category..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Players Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Age</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Belt</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Weight</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Record</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPlayers.map((player, index) => (
                  <tr key={player.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold mr-3">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{player.name}</div>
                          <div className="text-sm text-gray-500">{player.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{player.age}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${beltColors[player.belt] || 'bg-gray-200 text-gray-800'}`}>
                        {player.belt}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{player.weight}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {player.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="text-green-600 font-semibold">{player.wins}W</span>
                        {' - '}
                        <span className="text-red-600 font-semibold">{player.losses}L</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        player.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {player.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1" aria-label="View player details">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1" aria-label="Edit player">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Add New Student</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:bg-white/20 rounded-lg p-2 transition duration-200" aria-label="Close modal">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddPlayer} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newPlayer.firstName}
                    onChange={(e) => setNewPlayer({ ...newPlayer, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newPlayer.lastName}
                    onChange={(e) => setNewPlayer({ ...newPlayer, lastName: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newPlayer.email}
                    onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newPlayer.phone}
                    onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newPlayer.age}
                    onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="belt" className="block text-sm font-semibold text-gray-700 mb-2">Belt Rank</label>
                  <select
                    id="belt"
                    name="belt"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newPlayer.belt}
                    onChange={(e) => setNewPlayer({ ...newPlayer, belt: e.target.value })}
                  >
                    <option value="">Select Belt</option>
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
                  <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    id="weight"
                    name="weight"
                    type="text"
                    required
                    placeholder="e.g., 65"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newPlayer.weight}
                    onChange={(e) => setNewPlayer({ ...newPlayer, weight: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={newPlayer.category}
                    onChange={(e) => setNewPlayer({ ...newPlayer, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="Kata">Kata</option>
                    <option value="Kumite">Kumite</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition duration-200"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
