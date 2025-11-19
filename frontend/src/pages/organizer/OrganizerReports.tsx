import { useState } from 'react';
import { exportTournamentReportsToPDF, exportPerformanceReportsToPDF, exportFinancialReportsToPDF } from '../../lib/pdfUtils';

interface TournamentReport {
  id: string;
  name: string;
  date: string;
  participants: number;
  categories: number;
  revenue: number;
  status: string;
}

interface PerformanceReport {
  category: string;
  totalMatches: number;
  completed: number;
  pending: number;
  completionRate: number;
}

export default function OrganizerReports() {
  const [activeTab, setActiveTab] = useState('tournaments');
  const [selectedTournament, setSelectedTournament] = useState('all');

  const [tournamentReports] = useState<TournamentReport[]>([
    { id: '1', name: 'National Championship 2024', date: '2024-12-15', participants: 150, categories: 12, revenue: 15000, status: 'Completed' },
    { id: '2', name: 'Regional Open 2024', date: '2024-11-25', participants: 85, categories: 8, revenue: 8500, status: 'Completed' },
    { id: '3', name: 'Youth Tournament', date: '2024-10-15', participants: 120, categories: 10, revenue: 12000, status: 'Completed' },
    { id: '4', name: 'Inter-School Competition', date: '2024-12-05', participants: 200, categories: 15, revenue: 20000, status: 'In Progress' },
    { id: '5', name: 'Black Belt Championship', date: '2025-01-20', participants: 60, categories: 6, revenue: 6000, status: 'Upcoming' },
  ]);

  const [performanceReports] = useState<PerformanceReport[]>([
    { category: 'Kumite -55kg', totalMatches: 25, completed: 20, pending: 5, completionRate: 80 },
    { category: 'Kumite -65kg', totalMatches: 30, completed: 28, pending: 2, completionRate: 93 },
    { category: 'Kumite -75kg', totalMatches: 20, completed: 18, pending: 2, completionRate: 90 },
    { category: 'Kata', totalMatches: 35, completed: 32, pending: 3, completionRate: 91 },
    { category: 'Team Kata', totalMatches: 15, completed: 14, pending: 1, completionRate: 93 },
  ]);

  const totalRevenue = tournamentReports.reduce((sum, t) => sum + t.revenue, 0);
  const totalParticipants = tournamentReports.reduce((sum, t) => sum + t.participants, 0);
  const completedTournaments = tournamentReports.filter(t => t.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tournament Reports
          </h1>
          <p className="text-gray-600">Analyze tournament performance and generate reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Participants</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalParticipants}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed Tournaments</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{completedTournaments}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('tournaments')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'tournaments'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tournament Reports
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'performance'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Performance Reports
              </button>
              <button
                onClick={() => setActiveTab('financial')}
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'financial'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Financial Reports
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Tournament Reports Tab */}
            {activeTab === 'tournaments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Tournament Performance</h2>
                  <div className="flex space-x-3">
                    <div>
                      <label htmlFor="tournament-filter" className="sr-only">Filter by tournament</label>
                      <select
                        id="tournament-filter"
                        name="tournament-filter"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={selectedTournament}
                        onChange={(e) => setSelectedTournament(e.target.value)}
                      >
                        <option value="all">All Tournaments</option>
                        {tournamentReports.map(tournament => (
                          <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                        ))}
                      </select>
                    </div>
                    <button 
                      onClick={() => exportTournamentReportsToPDF(tournamentReports)} // Add onClick handler
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-200 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Report
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tournament</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Participants</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Categories</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Revenue</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tournamentReports.map((tournament, index) => (
                        <tr key={tournament.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-800">{tournament.name}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{tournament.date}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{tournament.participants}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{tournament.categories}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">${tournament.revenue.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tournament.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              tournament.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {tournament.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Performance Reports Tab */}
            {activeTab === 'performance' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Match Performance</h2>
                  <button 
                    onClick={() => exportPerformanceReportsToPDF(performanceReports)} // Add onClick handler
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Report
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Completion Rates</h3>
                    <div className="space-y-4">
                      {performanceReports.map((report, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{report.category}</span>
                            <span className="text-sm font-bold text-gray-800">{report.completionRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${report.completionRate}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>{report.completed}/{report.totalMatches} matches</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Match Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow">
                        <div className="text-3xl font-bold text-indigo-600">
                          {performanceReports.reduce((sum, r) => sum + r.totalMatches, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Matches</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow">
                        <div className="text-3xl font-bold text-green-600">
                          {performanceReports.reduce((sum, r) => sum + r.completed, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow">
                        <div className="text-3xl font-bold text-amber-600">
                          {performanceReports.reduce((sum, r) => sum + r.pending, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow">
                        <div className="text-3xl font-bold text-purple-600">
                          {Math.round(performanceReports.reduce((sum, r) => sum + r.completionRate, 0) / performanceReports.length)}%
                        </div>
                        <div className="text-sm text-gray-600">Avg. Completion</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Matches</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Completed</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pending</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Completion Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {performanceReports.map((report, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 font-semibold text-gray-800">{report.category}</td>
                          <td className="px-6 py-4 text-gray-700">{report.totalMatches}</td>
                          <td className="px-6 py-4 text-gray-700">{report.completed}</td>
                          <td className="px-6 py-4 text-gray-700">{report.pending}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                  style={{ width: `${report.completionRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold text-gray-800">{report.completionRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Financial Reports Tab */}
            {activeTab === 'financial' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
                  <button 
                    onClick={() => exportFinancialReportsToPDF(tournamentReports)} // Add onClick handler
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Report
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100">Total Revenue</p>
                        <p className="text-3xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Avg. Revenue per Tournament</p>
                        <p className="text-3xl font-bold mt-2">${Math.round(totalRevenue / tournamentReports.length).toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100">Revenue Growth</p>
                        <p className="text-3xl font-bold mt-2">+12.5%</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-lg">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Tournament</h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {tournamentReports.map((tournament, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full bg-gray-200 rounded-t-lg relative group">
                          <div
                            className="bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg transition-all duration-500"
                            style={{ height: `${(tournament.revenue / Math.max(...tournamentReports.map(t => t.revenue))) * 100}%` }}
                          ></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            ${tournament.revenue.toLocaleString()}
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                          {tournament.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
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
