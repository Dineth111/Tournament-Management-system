import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Player {
  id: string;
  name: string;
  score: number;
  warnings: number;
  penalties: number;
}

export default function JudgeScoring() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  
  const [matchInfo] = useState({
    tournament: 'National Championship 2024',
    category: 'Kumite -65kg',
    round: 'Quarter Final',
    venue: 'Ring 1'
  });

  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'John Smith', score: 0, warnings: 0, penalties: 0 },
    { id: '2', name: 'Mike Johnson', score: 0, warnings: 0, penalties: 0 }
  ]);

  const [currentRound, setCurrentRound] = useState(1);
  const [isMatchActive, setIsMatchActive] = useState(true);

  const addPoint = (playerId: string, points: number) => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, score: player.score + points } 
        : player
    ));
  };

  const addWarning = (playerId: string) => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, warnings: player.warnings + 1 } 
        : player
    ));
  };

  const addPenalty = (playerId: string) => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, penalties: player.penalties + 1 } 
        : player
    ));
  };

  const resetMatch = () => {
    setPlayers(players.map(player => ({
      ...player,
      score: 0,
      warnings: 0,
      penalties: 0
    })));
    setCurrentRound(1);
    setIsMatchActive(true);
  };

  const endMatch = () => {
    setIsMatchActive(false);
    // In a real app, this would save the match results
    alert('Match ended successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Live Scoring
              </h1>
              <p className="text-gray-600">Judge match in real-time</p>
            </div>
            <button
              onClick={() => navigate('/judge/matches')}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:from-gray-700 hover:to-gray-900 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Matches
            </button>
          </div>
        </div>

        {/* Match Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tournament</p>
              <p className="font-semibold text-gray-800">{matchInfo.tournament}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold text-gray-800">{matchInfo.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Round</p>
              <p className="font-semibold text-gray-800">{matchInfo.round}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Venue</p>
              <p className="font-semibold text-gray-800">{matchInfo.venue}</p>
            </div>
          </div>
        </div>

        {/* Match Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg">
                <span className="font-semibold">Round {currentRound}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Timer:</span>
                <span className="font-mono text-2xl font-bold text-orange-600">02:45</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentRound(currentRound + 1)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition duration-200"
              >
                Next Round
              </button>
              <button
                onClick={resetMatch}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition duration-200"
              >
                Reset Match
              </button>
              <button
                onClick={endMatch}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200"
              >
                End Match
              </button>
            </div>
          </div>
        </div>

        {/* Players Scoreboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {players.map((player, index) => (
            <div key={player.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className={`h-3 ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-gray-500 to-gray-700'}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 ${
                      index === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-gray-500 to-gray-700'
                    }`}>
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{player.name}</h3>
                      <p className="text-gray-500">Player {index + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold text-gray-800">{player.score}</div>
                    <div className="text-sm text-gray-500">Points</div>
                  </div>
                </div>

                {/* Warnings and Penalties */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700 font-semibold">Warnings</span>
                      <span className="text-2xl font-bold text-amber-700">{player.warnings}</span>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-red-700 font-semibold">Penalties</span>
                      <span className="text-2xl font-bold text-red-700">{player.penalties}</span>
                    </div>
                  </div>
                </div>

                {/* Scoring Buttons */}
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addPoint(player.id, 1)}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition duration-200 font-semibold"
                    >
                      +1 Point
                    </button>
                    <button
                      onClick={() => addPoint(player.id, 2)}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition duration-200 font-semibold"
                    >
                      +2 Points
                    </button>
                    <button
                      onClick={() => addPoint(player.id, 3)}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition duration-200 font-semibold"
                    >
                      +3 Points
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addWarning(player.id)}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition duration-200 font-semibold"
                    >
                      Warning
                    </button>
                    <button
                      onClick={() => addPenalty(player.id)}
                      className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition duration-200 font-semibold"
                    >
                      Penalty
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Match Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Match Status</h3>
              <p className="text-gray-600">
                {isMatchActive ? 'Match is currently active' : 'Match has ended'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              isMatchActive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {isMatchActive ? 'LIVE' : 'ENDED'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
