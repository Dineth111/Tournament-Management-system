import { useState } from 'react';

interface PlayerPerformance {
  id: string;
  name: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
  belt: string;
  category: string;
}

export default function CoachPerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [teamPerformance] = useState<PlayerPerformance[]>([
    { id: '1', name: 'Kamal Silva', matches: 15, wins: 12, losses: 3, winRate: 80, points: 345, belt: 'Black Belt', category: 'Kumite' },
    { id: '2', name: 'Nimal Perera', matches: 10, wins: 8, losses: 2, winRate: 80, points: 280, belt: 'Brown Belt', category: 'Kata' },
    { id: '3', name: 'Saman Fernando', matches: 19, wins: 15, losses: 4, winRate: 79, points: 420, belt: 'Black Belt', category: 'Kumite' },
    { id: '4', name: 'Amal Jayasinghe', matches: 15, wins: 10, losses: 5, winRate: 67, points: 310, belt: 'Brown Belt', category: 'Kumite' },
    { id: '5', name: 'Ruwan Dias', matches: 7, wins: 6, losses: 1, winRate: 86, points: 195, belt: 'Blue Belt', category: 'Kata' },
    { id: '6', name: 'Kasun Bandara', matches: 17, wins: 14, losses: 3, winRate: 82, points: 385, belt: 'Black Belt', category: 'Kumite' },
  ]);

  const totalMatches = teamPerformance.reduce((sum, p) => sum + p.matches, 0);
  const totalWins = teamPerformance.reduce((sum, p) => sum + p.wins, 0);
  const totalLosses = teamPerformance.reduce((sum, p) => sum + p.losses, 0);
  const avgWinRate = Math.round(teamPerformance.reduce((sum, p) => sum + p.winRate, 0) / teamPerformance.length);
  const totalPoints = teamPerformance.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Team Performance
              </h1>
              <p className="text-gray-600">Track and analyze your team's performance metrics</p>
            </div>
            <div className="mt-4 md:mt-0">
              <label htmlFor="period" className="sr-only">Select Time Period</label>
              <select
                id="period"
                name="period"
                className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Matches</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalMatches}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Wins</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalWins}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Losses</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalLosses}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Win Rate</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{avgWinRate}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Points</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalPoints}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Win/Loss Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-green-600">Wins</span>
                  <span className="text-sm font-bold text-gray-800">{totalWins} ({Math.round((totalWins / totalMatches) * 100)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-teal-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(totalWins / totalMatches) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-red-600">Losses</span>
                  <span className="text-sm font-bold text-gray-800">{totalLosses} ({Math.round((totalLosses / totalMatches) * 100)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(totalLosses / totalMatches) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Category Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-purple-600">Kumite</span>
                  <span className="text-sm font-bold text-gray-800">4 Players</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: '67%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-600">Kata</span>
                  <span className="text-sm font-bold text-gray-800">2 Players</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: '33%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Performance Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600">
            <h2 className="text-2xl font-bold text-white">Individual Player Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Belt</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Matches</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Record</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Win Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamPerformance
                  .sort((a, b) => b.points - a.points)
                  .map((player, index) => (
                    <tr key={player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 text-white font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold mr-3">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="font-semibold text-gray-800">{player.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-xs font-semibold">
                          {player.belt}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {player.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">{player.matches}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="text-green-600 font-semibold">{player.wins}W</span>
                          {' - '}
                          <span className="text-red-600 font-semibold">{player.losses}L</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                player.winRate >= 80 ? 'bg-green-500' : player.winRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${player.winRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-700">{player.winRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                          {player.points}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
