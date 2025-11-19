import { useState } from 'react';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function Matches() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLiveScoreModal, setShowLiveScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [drawConfig, setDrawConfig] = useState({
    tournamentId: '',
    eventType: 'kata',
    ageGroup: '',
    beltRank: '',
    weightCategory: '',
  });

  const matches = [
    {
      id: 1,
      matchNumber: 'M001',
      tournament: 'State Championship 2024',
      player1: { name: 'John Smith', dojo: 'Dragon Dojo', belt: 'Black Belt' },
      player2: { name: 'Mike Johnson', dojo: 'Phoenix MA', belt: 'Black Belt' },
      category: 'Kata - Senior',
      round: 'Semi-Final',
      status: 'In Progress',
      scheduledTime: '2024-02-15 10:00 AM',
      arena: 'Arena A',
    },
    {
      id: 2,
      matchNumber: 'M002',
      tournament: 'Junior Kata Competition',
      player1: { name: 'Sarah Lee', dojo: 'Tiger Academy', belt: 'Brown Belt' },
      player2: { name: 'Emma Davis', dojo: 'Dragon Dojo', belt: 'Brown Belt' },
      category: 'Kumite - Junior',
      round: 'Quarter-Final',
      status: 'Scheduled',
      scheduledTime: '2024-02-15 11:30 AM',
      arena: 'Arena B',
    },
    {
      id: 3,
      matchNumber: 'M003',
      tournament: 'Black Belt Tournament',
      player1: { name: 'Tom Wilson', dojo: 'Elite Karate', belt: 'Purple Belt' },
      player2: { name: 'Chris Brown', dojo: 'Warriors', belt: 'Purple Belt' },
      category: 'Kata - Cadet',
      round: 'Final',
      status: 'Completed',
      scheduledTime: '2024-02-14 02:00 PM',
      arena: 'Main Arena',
      winner: 'Tom Wilson',
    },
  ];

  const handleGenerateDraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/matches/generate-draw', drawConfig);
      toast.success('Match draw generated successfully!');
      setShowGenerateModal(false);
      setDrawConfig({
        tournamentId: '',
        eventType: 'kata',
        ageGroup: '',
        beltRank: '',
        weightCategory: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate draw');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (match: any) => {
    setSelectedMatch(match);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would update the match
      toast.success('Match updated successfully!');
      setShowEditModal(false);
      setSelectedMatch(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update match');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (matchId: number) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await api.delete(`/matches/${matchId}`);
        toast.success('Match deleted successfully!');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete match');
      }
    }
  };

  const handleViewDetails = (match: any) => {
    setSelectedMatch(match);
    setShowEditModal(true);
  };

  const handleLiveScore = (match: any) => {
    setSelectedMatch(match);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setShowLiveScoreModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-green-100 text-green-700';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-gray-100 text-gray-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredMatches = selectedStatus === 'all'
    ? matches
    : matches.filter(m => m.status.toLowerCase().replace(' ', '-') === selectedStatus);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center">
                <svg className="w-10 h-10 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Matches Management
              </h1>
              <p className="text-gray-500 mt-2">Manage and track all tournament matches</p>
            </div>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition duration-200 font-semibold shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Generate AI Draw
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Matches</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">156</p>
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
                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Scheduled</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">45</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">99</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'all', label: 'All Matches' },
              { id: 'in-progress', label: 'In Progress' },
              { id: 'scheduled', label: 'Scheduled' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-6 py-4 font-semibold transition-colors duration-200 border-b-2 whitespace-nowrap ${
                  selectedStatus === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matches Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Match</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tournament</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Players</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Schedule</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold mr-3">
                          {match.matchNumber.slice(1)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{match.matchNumber}</p>
                          <p className="text-sm text-gray-500">{match.round}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">{match.tournament}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-sm font-medium text-gray-700">{match.player1.name}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm font-medium text-gray-700">{match.player2.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {match.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium">{match.scheduledTime}</p>
                          <p className="text-xs text-gray-500">{match.arena}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                        {match.status}
                      </span>
                      {match.winner && (
                        <p className="text-xs text-green-600 mt-1 font-semibold">Winner: {match.winner}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(match)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200" 
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleEdit(match)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition duration-200" 
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {match.status === 'In Progress' && (
                          <button 
                            onClick={() => handleLiveScore(match)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200" 
                            title="Live Score"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generate Draw Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center">
                    <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI-Powered Match Draw Generator
                  </h2>
                  <button 
                    onClick={() => setShowGenerateModal(false)} 
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition duration-200"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-blue-100 mt-2">Automatically generate fair match draws based on player attributes</p>
              </div>

              <form onSubmit={handleGenerateDraw} className="p-6 space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">AI Algorithm Features:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Fair pairing based on age, belt rank, and weight</li>
                        <li>Avoid same-dojo matchups when possible</li>
                        <li>Balanced bracket distribution</li>
                        <li>Tournament seeding optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tournament *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={drawConfig.tournamentId}
                      onChange={(e) => setDrawConfig({ ...drawConfig, tournamentId: e.target.value })}
                      aria-label="Select Tournament"
                    >
                      <option value="">Select Tournament</option>
                      <option value="1">State Championship 2024</option>
                      <option value="2">Junior Kata Competition</option>
                      <option value="3">Black Belt Tournament</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={drawConfig.eventType}
                      onChange={(e) => setDrawConfig({ ...drawConfig, eventType: e.target.value })}
                      aria-label="Event Type"
                    >
                      <option value="kata">Kata</option>
                      <option value="kumite">Kumite</option>
                      <option value="team">Team Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age Group *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={drawConfig.ageGroup}
                      onChange={(e) => setDrawConfig({ ...drawConfig, ageGroup: e.target.value })}
                      aria-label="Age Group"
                    >
                      <option value="">Select Age Group</option>
                      <option value="cadet">Cadet (12-14)</option>
                      <option value="junior">Junior (15-17)</option>
                      <option value="senior">Senior (18+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Belt Rank *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={drawConfig.beltRank}
                      onChange={(e) => setDrawConfig({ ...drawConfig, beltRank: e.target.value })}
                      aria-label="Belt Rank"
                    >
                      <option value="">Select Belt Rank</option>
                      <option value="white">White Belt</option>
                      <option value="yellow">Yellow Belt</option>
                      <option value="orange">Orange Belt</option>
                      <option value="green">Green Belt</option>
                      <option value="blue">Blue Belt</option>
                      <option value="purple">Purple Belt</option>
                      <option value="brown">Brown Belt</option>
                      <option value="black">Black Belt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight Category *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      value={drawConfig.weightCategory}
                      onChange={(e) => setDrawConfig({ ...drawConfig, weightCategory: e.target.value })}
                      aria-label="Weight Category"
                    >
                      <option value="">Select Weight Category</option>
                      <option value="lightweight">Lightweight (-60kg)</option>
                      <option value="middleweight">Middleweight (60-75kg)</option>
                      <option value="heavyweight">Heavyweight (75kg+)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Draw...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Generate AI Draw
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Match Modal */}
        {showEditModal && selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center">
                    <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {selectedMatch ? 'Edit Match' : 'View Match Details'}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedMatch(null);
                    }} 
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition duration-200"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="matchNumber" className="block text-sm font-semibold text-gray-700 mb-2">Match Number</label>
                    <input
                      id="matchNumber"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedMatch.matchNumber}
                      readOnly
                      aria-label="Match Number"
                    />
                  </div>
                  <div>
                    <label htmlFor="tournament" className="block text-sm font-semibold text-gray-700 mb-2">Tournament</label>
                    <input
                      id="tournament"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedMatch.tournament}
                      readOnly
                      aria-label="Tournament"
                    />
                  </div>
                  <div>
                    <label htmlFor="player1" className="block text-sm font-semibold text-gray-700 mb-2">Player 1</label>
                    <input
                      id="player1"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedMatch.player1.name}
                      readOnly
                      aria-label="Player 1 Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="player2" className="block text-sm font-semibold text-gray-700 mb-2">Player 2</label>
                    <input
                      id="player2"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedMatch.player2.name}
                      readOnly
                      aria-label="Player 2 Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <input
                      id="category"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedMatch.category}
                      readOnly
                      aria-label="Match Category"
                    />
                  </div>
                  <div>
                    <label htmlFor="round" className="block text-sm font-semibold text-gray-700 mb-2">Round</label>
                    <input
                      id="round"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedMatch.round}
                      readOnly
                      aria-label="Match Round"
                    />
                  </div>
                  <div>
                    <label htmlFor="scheduledTime" className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Time</label>
                    <input
                      id="scheduledTime"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedMatch.scheduledTime}
                      readOnly
                      aria-label="Scheduled Time"
                    />
                  </div>
                  <div>
                    <label htmlFor="arena" className="block text-sm font-semibold text-gray-700 mb-2">Arena</label>
                    <input
                      id="arena"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={selectedMatch.arena}
                      readOnly
                      aria-label="Arena"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedMatch(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
                  >
                    Close
                  </button>
                  {selectedMatch && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition duration-200 font-semibold shadow-lg disabled:opacity-50 flex items-center"
                    >
                      {loading ? 'Updating...' : 'Update Match'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Live Score Modal */}
        {showLiveScoreModal && selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center">
                    <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Live Score - {selectedMatch.matchNumber}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowLiveScoreModal(false);
                      setSelectedMatch(null);
                    }} 
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition duration-200"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-800">{selectedMatch.tournament}</h3>
                  <p className="text-gray-600">{selectedMatch.category} - {selectedMatch.round}</p>
                  <p className="text-sm text-gray-500">{selectedMatch.scheduledTime} at {selectedMatch.arena}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="bg-red-50 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">{player1Score}</div>
                    <div className="text-lg font-semibold text-gray-800">{selectedMatch.player1.name}</div>
                    <div className="text-sm text-gray-600">{selectedMatch.player1.dojo}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{player2Score}</div>
                    <div className="text-lg font-semibold text-gray-800">{selectedMatch.player2.name}</div>
                    <div className="text-sm text-gray-600">{selectedMatch.player2.dojo}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Recent Actions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Match started</span>
                      <span className="text-gray-500">10:00 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>First point - {selectedMatch.player1.name}</span>
                      <span className="text-gray-500">10:05 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Warning - {selectedMatch.player2.name}</span>
                      <span className="text-gray-500">10:12 AM</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPlayer1Score(player1Score + 1)}
                    className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                    aria-label={`Add point for ${selectedMatch.player1.name}`}
                  >
                    Add Point - {selectedMatch.player1.name}
                  </button>
                  <button 
                    onClick={() => setPlayer2Score(player2Score + 1)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                    aria-label={`Add point for ${selectedMatch.player2.name}`}
                  >
                    Add Point - {selectedMatch.player2.name}
                  </button>
                  <button 
                    onClick={() => toast.success('Warning issued')}
                    className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200 font-medium"
                    aria-label="Issue warning"
                  >
                    Warning
                  </button>
                  <button 
                    onClick={() => {
                      toast.success(`Match ended. Winner: ${player1Score > player2Score ? selectedMatch.player1.name : selectedMatch.player2.name}`);
                      setShowLiveScoreModal(false);
                      setSelectedMatch(null);
                      setPlayer1Score(0);
                      setPlayer2Score(0);
                    }}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium"
                    aria-label="End match"
                  >
                    End Match
                  </button>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLiveScoreModal(false);
                      setSelectedMatch(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}