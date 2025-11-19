import { useState } from 'react';

interface Registration {
  id: string;
  playerName: string;
  email: string;
  phone: string;
  tournament: string;
  category: string;
  belt: string;
  weight: string;
  date: string;
  status: string;
  paymentStatus: string;
}

export default function OrganizerRegistrations() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [registrations] = useState<Registration[]>([
    { id: '1', playerName: 'John Smith', email: 'john@email.com', phone: '+1234567890', tournament: 'National Championship 2024', category: 'Kumite -65kg', belt: 'Black Belt', weight: '65kg', date: '2024-12-01', status: 'Confirmed', paymentStatus: 'Paid' },
    { id: '2', playerName: 'Sarah Lee', email: 'sarah@email.com', phone: '+1234567891', tournament: 'Regional Open 2024', category: 'Kata', belt: 'Brown Belt', weight: '55kg', date: '2024-11-28', status: 'Pending', paymentStatus: 'Pending' },
    { id: '3', playerName: 'Mike Johnson', email: 'mike@email.com', phone: '+1234567892', tournament: 'Youth Tournament', category: 'Kumite -55kg', belt: 'Blue Belt', weight: '55kg', date: '2024-11-25', status: 'Confirmed', paymentStatus: 'Paid' },
    { id: '4', playerName: 'Emma Davis', email: 'emma@email.com', phone: '+1234567893', tournament: 'Inter-School Competition', category: 'Team Kata', belt: 'Green Belt', weight: '60kg', date: '2024-12-05', status: 'Confirmed', paymentStatus: 'Paid' },
    { id: '5', playerName: 'Tom Brown', email: 'tom@email.com', phone: '+1234567894', tournament: 'Black Belt Championship', category: 'Kumite -75kg', belt: 'Black Belt', weight: '75kg', date: '2024-12-10', status: 'Pending', paymentStatus: 'Unpaid' },
    { id: '6', playerName: 'Chris Lee', email: 'chris@email.com', phone: '+1234567895', tournament: 'City Open 2024', category: 'Kata', belt: 'Brown Belt', weight: '70kg', date: '2024-11-30', status: 'Confirmed', paymentStatus: 'Paid' },
  ]);

  const filteredRegistrations = registrations.filter(reg => {
    const matchesFilter = filterStatus === 'all' || reg.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = reg.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const confirmedCount = registrations.filter(r => r.status === 'Confirmed').length;
  const pendingCount = registrations.filter(r => r.status === 'Pending').length;
  const paidCount = registrations.filter(r => r.paymentStatus === 'Paid').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tournament Registrations
          </h1>
          <p className="text-gray-600">Manage and track player registrations for tournaments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{registrations.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{confirmedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{pendingCount}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by player name, tournament, or category..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('confirmed')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  filterStatus === 'confirmed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tournament</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Belt/Weight</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRegistrations.map((reg, index) => (
                  <tr key={reg.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                          {reg.playerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{reg.playerName}</div>
                          <div className="text-sm text-gray-500">{reg.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{reg.tournament}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {reg.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">{reg.belt}</div>
                        <div className="text-gray-500">{reg.weight}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{reg.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reg.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reg.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 
                        reg.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-800 p-1" aria-label="View registration details">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1" aria-label="Confirm registration">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-1" aria-label="Delete registration">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRegistrations.length === 0 && (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Registrations Found</h3>
              <p className="text-gray-600">No registrations match your current filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
