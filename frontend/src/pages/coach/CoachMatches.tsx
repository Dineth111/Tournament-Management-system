import { useState } from 'react';

interface Match {
  id: string;
  tournament: string;
  player: string;
  opponent: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  round: string;
}

export default function CoachMatches() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [matches] = useState<Match[]>([
    { id: '1', tournament: 'National Championship 2024', player: 'Kamal Silva', opponent: 'John Doe', category: 'Kumite -65kg', date: '2024-12-15', time: '10:00 AM', venue: 'Sports Complex A', status: 'Upcoming', round: 'Quarter Final' },
    { id: '2', tournament: 'Inter-School Tournament', player: 'Nimal Perera', opponent: 'Jane Smith', category: 'Kata Senior', date: '2024-12-10', time: '02:00 PM', venue: 'Dojo Hall B', status: 'Upcoming', round: 'Semi Final' },
    { id: '3', tournament: 'Regional Open 2024', player: 'Saman Fernando', opponent: 'Mike Johnson', category: 'Kumite -75kg', date: '2024-11-28', time: '11:30 AM', venue: 'Arena Stadium', status: 'Completed', round: 'Final' },
    { id: '4', tournament: 'Youth Championship', player: 'Amal Jayasinghe', opponent: 'Tom Brown', category: 'Kumite -60kg', date: '2024-12-05', time: '03:30 PM', venue: 'Central Gym', status: 'Upcoming', round: 'Quarter Final' },
    { id: '5', tournament: 'State Kata Championship', player: 'Ruwan Dias', opponent: 'Chris Lee', category: 'Kata Junior', date: '2024-11-20', time: '09:00 AM', venue: 'Training Center', status: 'Completed', round: 'Semi Final' },
    { id: '6', tournament: 'National Championship 2024', player: 'Kasun Bandara', opponent: 'Alex Wilson', category: 'Kumite -70kg', date: '2024-12-18', time: '01:00 PM', venue: 'Sports Complex A', status: 'Upcoming', round: 'Quarter Final' },
  ]);

  const filteredMatches = matches.filter(match => {
    const matchesFilter = filterStatus === 'all' || match.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = match.player.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const upcomingCount = matches.filter(m => m.status === 'Upcoming').length;
  const completedCount = matches.filter(m => m.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Match Schedule
          </h1>
          <p className="text-gray-600">View and track your team's upcoming and completed matches</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Matches</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{matches.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{upcomingCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{completedCount}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                placeholder="Search by player, tournament, or category..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  filterStatus === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('upcoming')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  filterStatus === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  filterStatus === 'completed' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className={`h-2 ${match.status === 'Upcoming' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-green-500 to-teal-500'}`}></div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{match.tournament}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {match.round}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        {match.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        match.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {match.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-600 mb-1">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">{match.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">{match.time}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold">
                      {match.player.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Your Player</p>
                      <p className="font-bold text-gray-800">{match.player}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">VS</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold">
                      {match.opponent.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Opponent</p>
                      <p className="font-bold text-gray-800">{match.opponent}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-semibold">{match.venue}</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition duration-200 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Matches Found</h3>
            <p className="text-gray-600">No matches match your current filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
