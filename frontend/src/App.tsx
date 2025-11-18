import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Judges from './pages/Judges';
import Tournaments from './pages/Tournaments';
import Matches from './pages/Matches';
import Coaches from './pages/Coaches';
import Welcome from './pages/Welcome';
import CoachTeam from './pages/coach/CoachTeam';
import CoachMatches from './pages/coach/CoachMatches';
import CoachPerformance from './pages/coach/CoachPerformance';
import CoachSettings from './pages/coach/CoachSettings';
import PlayerProfile from './pages/player/PlayerProfile';
import PlayerTournaments from './pages/player/PlayerTournaments';
import PlayerMatches from './pages/player/PlayerMatches';
import PlayerResults from './pages/player/PlayerResults';
import JudgeMatches from './pages/judge/JudgeMatches';
import JudgeScoring from './pages/judge/JudgeScoring';
import JudgeHistory from './pages/judge/JudgeHistory';
import OrganizerRegistrations from './pages/organizer/OrganizerRegistrations';
import OrganizerReports from './pages/organizer/OrganizerReports';
import { useAuthStore } from './store/authStore';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role.toLowerCase())) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Common Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/players" element={<ProtectedRoute allowedRoles={['admin', 'organizer']}><Players /></ProtectedRoute>} />
        <Route path="/judges" element={<ProtectedRoute allowedRoles={['admin', 'organizer']}><Judges /></ProtectedRoute>} />
        <Route path="/coaches" element={<ProtectedRoute allowedRoles={['admin']}><Coaches /></ProtectedRoute>} />
        <Route path="/tournaments" element={<ProtectedRoute allowedRoles={['admin', 'organizer', 'coach']}><Tournaments /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute allowedRoles={['admin', 'organizer']}><Matches /></ProtectedRoute>} />
        {/* <Route path="/payments" element={<ProtectedRoute allowedRoles={['admin', 'organizer']}><Payments /></ProtectedRoute>} /> */}
        
        {/* Judge Routes */}
        <Route path="/judge/matches" element={<ProtectedRoute allowedRoles={['judge']}><JudgeMatches /></ProtectedRoute>} />
        <Route path="/judge/scoring" element={<ProtectedRoute allowedRoles={['judge']}><JudgeScoring /></ProtectedRoute>} />
        <Route path="/judge/history" element={<ProtectedRoute allowedRoles={['judge']}><JudgeHistory /></ProtectedRoute>} />
        
        {/* Player Routes */}
        <Route path="/player/profile" element={<ProtectedRoute allowedRoles={['player']}><PlayerProfile /></ProtectedRoute>} />
        <Route path="/player/tournaments" element={<ProtectedRoute allowedRoles={['player']}><PlayerTournaments /></ProtectedRoute>} />
        <Route path="/player/matches" element={<ProtectedRoute allowedRoles={['player']}><PlayerMatches /></ProtectedRoute>} />
        <Route path="/player/results" element={<ProtectedRoute allowedRoles={['player']}><PlayerResults /></ProtectedRoute>} />
        
        {/* Coach Routes */}
        <Route path="/coach/team" element={<ProtectedRoute allowedRoles={['coach']}><CoachTeam /></ProtectedRoute>} />
        <Route path="/coach/tournaments" element={<ProtectedRoute allowedRoles={['coach']}><Tournaments /></ProtectedRoute>} />
        <Route path="/coach/matches" element={<ProtectedRoute allowedRoles={['coach']}><CoachMatches /></ProtectedRoute>} />
        <Route path="/coach/performance" element={<ProtectedRoute allowedRoles={['coach']}><CoachPerformance /></ProtectedRoute>} />
        <Route path="/coach/settings" element={<ProtectedRoute allowedRoles={['coach']}><CoachSettings /></ProtectedRoute>} />
        
        {/* Organizer Routes */}
        <Route path="/organizer/registrations" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerRegistrations /></ProtectedRoute>} />
        <Route path="/organizer/reports" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerReports /></ProtectedRoute>} />
        
        {/* <Route path="/scoring/:matchId" element={<ProtectedRoute><LiveScoring /></ProtectedRoute>} /> */}
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
