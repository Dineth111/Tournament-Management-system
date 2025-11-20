import { useState } from 'react';

interface MatchHistory {
  id: string;
  tournament: string;
  player1: string;
  player2: string;
  category: string;
  date: string;
  result: string;
  score: string;
  duration: string;
  venue: string;
}

export default function JudgeHistory() {
  const [filterTournament, setFilterTournament] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  const [history] = useState<MatchHistory[]>([
    { id: '1', tournament: 'National Championship 2024', player1: 'John Smith', player2: 'Mike Johnson', category: 'Kumite -65kg', date: '2024-12-15', result: 'John Smith won', score: '5-3', duration: '3:45', venue: 'Ring 1' },
    { id: '2', tournament: 'Regional Open 2024', player1: 'Sarah Lee', player2: 'Emma Davis', category: 'Kata', date: '2024-11-25', result: 'Sarah Lee won', score: '5-2', duration: '2:30', venue: 'Mat A' },
    { id: '3', tournament: 'Youth Tournament', player1: 'Tom Brown', player2: 'Chris Lee', category: 'Kumite -55kg', date: '2024-10-15', result: 'Chris Lee won', score: '2-4', duration: '4:15', venue: 'Ring 2' },
    { id: '4', tournament: 'Inter-School Competition', player1: 'Alex Wilson', player2: 'David Kim', category: 'Team Kata', date: '2024-09-05', result: 'Alex Wilson won', score: '5-1', duration: '5:20', venue: 'Main Arena' },
    { id: '5', tournament: 'Black Belt Championship', player1: 'James Miller', player2: 'Robert Taylor', category: 'Kumite -75kg', date: '2024-08-20', result: 'James Miller won', score: '4-2', duration: '3:55', venue: 'Ring 1' },
    { id: '6', tournament: 'City Open 2024', player1: 'Michael Chen', player2: 'Daniel Park', category: 'Kata', date: '2024-07-15', result: 'Daniel Park won', score: '3-5', duration: '2:45', venue: 'Mat B' },
  ]);

  const filteredHistory = history.filter(match => {
    const matchesTournament = filterTournament === 'all' || match.tournament.toLowerCase().includes(filterTournament.toLowerCase());
    const matchesYear = filterYear === 'all' || match.date.startsWith(filterYear);
    return matchesTournament && matchesYear;
  });

  // Get unique tournaments and years for filters
  const tournaments = Array.from(new Set(history.map(h => h.tournament)));
  const years = Array.from(new Set(history.map(h => h.date.split('-')[0]))).sort((a, b) => parseInt(b) - parseInt(a));

  const totalMatches = history.length;
  const kumiteMatches = history.filter(h => h.category.includes('Kumite')).length;
  const kataMatches = history.filter(h => h.category.includes('Kata')).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Judging History
          </h1>
          <p className="text-gray-600">View your past judging assignments and match results</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Matches Judged</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalMatches}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Kumite Matches</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{kumiteMatches}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Kata Matches</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{kataMatches}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tournament-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Tournament
              </label>
              <select
                id="tournament-filter"
                name="tournament-filter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={filterTournament}
                onChange={(e) => setFilterTournament(e.target.value)}
              >
                <option value="all">All Tournaments</option>
                {tournaments.map(tournament => (
                  <option key={tournament} value={tournament.toLowerCase()}>{tournament}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year-filter" className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Year
              </label>
              <select
                id="year-filter"
                name="year-filter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tournament</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Match</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Result</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Venue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHistory.map((match, index) => (
                  <tr key={match.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{match.tournament}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">{match.player1}</div>
                        <div className="text-gray-500">vs</div>
                        <div className="font-medium text-gray-800">{match.player2}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                        {match.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{match.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {match.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{match.duration}</td>
                    <td className="px-6 py-4 text-gray-700">{match.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredHistory.length === 0 && (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No History Found</h3>
              <p className="text-gray-600">No judging history matches your current filter criteria.</p>
            </div>
          )}
        </div>

        {/* Performance Chart */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Judging Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Match Type Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-600">Kumite</span>
                    <span className="text-sm font-bold text-gray-800">{kumiteMatches} ({Math.round((kumiteMatches / totalMatches) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(kumiteMatches / totalMatches) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-600">Kata</span>
                    <span className="text-sm font-bold text-gray-800">{kataMatches} ({Math.round((kataMatches / totalMatches) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(kataMatches / totalMatches) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h3>
              <div className="h-48 flex items-end justify-between space-x-2">
                {[65, 70, 45, 80, 60, 90, 55, 75, 85, 65, 95, 70].map((value, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-gray-200 rounded-t-lg">
                      <div
                        className="bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${value}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{['J','F','M','A','M','J','J','A','S','O','N','D'][index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
