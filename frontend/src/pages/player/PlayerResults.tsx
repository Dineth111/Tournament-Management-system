import { useState } from 'react';

interface Result {
  id: string;
  tournament: string;
  category: string;
  date: string;
  opponent: string;
  result: string;
  score: string;
  placement: string;
  points: number;
  round: string;
}

export default function PlayerResults() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  const [results] = useState<Result[]>([
    { id: '1', tournament: 'National Championship 2024', category: 'Kumite -65kg', date: '2024-12-15', opponent: 'John Smith', result: 'Win', score: '5-3', placement: '1st Place', points: 100, round: 'Final' },
    { id: '2', tournament: 'Regional Open 2024', category: 'Kata', date: '2024-11-25', opponent: 'Mike Johnson', result: 'Win', score: '5-2', placement: '1st Place', points: 75, round: 'Final' },
    { id: '3', tournament: 'Youth Tournament', category: 'Kumite -55kg', date: '2024-10-15', opponent: 'Tom Brown', result: 'Loss', score: '2-4', placement: '2nd Place', points: 50, round: 'Final' },
    { id: '4', tournament: 'Inter-School Competition', category: 'Team Kata', date: '2024-12-05', opponent: 'Chris Lee', result: 'Win', score: '5-1', placement: '1st Place', points: 60, round: 'Final' },
    { id: '5', tournament: 'City Open 2024', category: 'Kata', date: '2024-09-10', opponent: 'David Kim', result: 'Win', score: '5-2', placement: '1st Place', points: 75, round: 'Final' },
    { id: '6', tournament: 'State Championship 2024', category: 'Kumite -65kg', date: '2024-08-20', opponent: 'Alex Wilson', result: 'Loss', score: '1-5', placement: '3rd Place', points: 30, round: 'Semi Final' },
    { id: '7', tournament: 'Summer Cup 2024', category: 'Kata', date: '2024-07-15', opponent: 'James Miller', result: 'Win', score: '5-0', placement: '1st Place', points: 75, round: 'Final' },
  ]);

  const filteredResults = results.filter(result => {
    const matchesCategory = filterCategory === 'all' || result.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesYear = filterYear === 'all' || result.date.startsWith(filterYear);
    return matchesCategory && matchesYear;
  });

  const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
  const totalWins = results.filter(r => r.result === 'Win').length;
  const totalLosses = results.filter(r => r.result === 'Loss').length;
  const firstPlaceCount = results.filter(r => r.placement === '1st Place').length;

  // Get unique years for filter
  const years = Array.from(new Set(results.map(r => r.date.split('-')[0]))).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            My Results
          </h1>
          <p className="text-gray-600">View your competition results and performance history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Competitions</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{results.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Wins</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalWins}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Losses</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalLosses}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">1st Place Finishes</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{firstPlaceCount}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
              <select
                id="category-filter"
                name="category-filter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="kata">Kata</option>
                <option value="kumite">Kumite</option>
                <option value="team">Team Events</option>
              </select>
            </div>
            <div>
              <label htmlFor="year-filter" className="block text-sm font-semibold text-gray-700 mb-2">Filter by Year</label>
              <select
                id="year-filter"
                name="year-filter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tournament</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Opponent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Result</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Placement</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result, index) => (
                  <tr key={result.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-800">{result.tournament}</div>
                        <div className="text-sm text-gray-500">{result.round}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {result.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{result.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{result.opponent}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        result.result === 'Win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {result.result} {result.score}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        result.placement === '1st Place' ? 'bg-yellow-100 text-yellow-700' :
                        result.placement === '2nd Place' ? 'bg-gray-200 text-gray-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {result.placement}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                        +{result.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredResults.length === 0 && (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h3>
              <p className="text-gray-600">No results match your current filter criteria.</p>
            </div>
          )}
        </div>

        {/* Performance Chart */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Win/Loss Ratio</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-green-600">Wins</span>
                    <span className="text-sm font-bold text-gray-800">{totalWins} ({Math.round((totalWins / results.length) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(totalWins / results.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-red-600">Losses</span>
                    <span className="text-sm font-bold text-gray-800">{totalLosses} ({Math.round((totalLosses / results.length) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(totalLosses / results.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Placement Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-yellow-600">1st Place</span>
                    <span className="text-sm font-bold text-gray-800">{firstPlaceCount} ({Math.round((firstPlaceCount / results.length) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(firstPlaceCount / results.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600">2nd/3rd Place</span>
                    <span className="text-sm font-bold text-gray-800">{results.length - firstPlaceCount} ({Math.round(((results.length - firstPlaceCount) / results.length) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-gray-400 to-gray-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${((results.length - firstPlaceCount) / results.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
