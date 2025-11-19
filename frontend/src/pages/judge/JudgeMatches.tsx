import { useState } from 'react';

interface Match {
  id: string;
  tournament: string;
  player1: string;
  player2: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  round: string;
}

export default function JudgeMatches() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [matches] = useState<Match[]>([
    { id: '1', tournament: 'National Championship 2024', player1: 'John Smith', player2: 'Mike Johnson', category: 'Kumite -65kg', date: '2024-12-15', time: '10:00 AM', venue: 'Ring 1', status: 'Upcoming', round: 'Quarter Final' },
    { id: '2', tournament: 'Regional Open 2024', player1: 'Sarah Lee', player2: 'Emma Davis', category: 'Kata', date: '2024-12-15', time: '02:30 PM', venue: 'Mat A', status: 'Upcoming', round: 'Semi Final' },
    { id: '3', tournament: 'Youth Tournament', player1: 'Tom Brown', player2: 'Chris Lee', category: 'Kumite -55kg', date: '2024-12-10', time: '11:00 AM', venue: 'Ring 2', status: 'Completed', round: 'Final' },
    { id: '4', tournament: 'Inter-School Competition', player1: 'Alex Wilson', player2: 'David Kim', category: 'Team Kata', date: '2024-12-05', time: '03:00 PM', venue: 'Main Arena', status: 'In Progress', round: 'Preliminary' },
    { id: '5', tournament: 'Black Belt Championship', player1: 'James Miller', player2: 'Robert Taylor', category: 'Kumite -75kg', date: '2024-12-18', time: '01:30 PM', venue: 'Ring 1', status: 'Upcoming', round: 'Quarter Final' },
  ]);

  const filteredMatches = matches.filter(match => {
    const matchesFilter = filterStatus === 'all' || match.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = match.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.player1.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.player2.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const upcomingCount = matches.filter(m => m.status === 'Upcoming').length;
  const inProgressCount = matches.filter(m => m.status === 'In Progress').length;
  const completedCount = matches.filter(m => m.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Assigned Matches
          </h1>
          <p className="text-gray-600">View and manage your assigned matches for judging</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{upcomingCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{inProgressCount}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{completedCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                placeholder="Search by tournament, players, or category..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  filterStatus === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                onClick={() => setFilterStatus('in progress')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  filterStatus === 'in progress' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Progress
              </button>
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className={`h-2 ${
                match.status === 'Upcoming' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                match.status === 'In Progress' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}></div>
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
                        match.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                        match.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
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
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                      {match.player1.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Player 1</p>
                      <p className="font-bold text-gray-800">{match.player1}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">VS</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold">
                      {match.player2.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Player 2</p>
                      <p className="font-bold text-gray-800">{match.player2}</p>
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
                  <div className="space-x-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition duration-200 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                    {match.status === 'Upcoming' && (
                      <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Start Judging
                      </button>
                    )}
                    {match.status === 'In Progress' && (
                      <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition duration-200 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Continue Judging
                      </button>
                    )}
                  </div>
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
