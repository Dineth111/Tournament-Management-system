import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WelcomePage from './components/WelcomePage';
import PlayerDashboard from './components/player/PlayerDashboard';
import PlayerProfile from './components/player/Profile';
import PlayerTeam from './components/player/PlayerTeam';
import PlayerTournaments from './components/player/PlayerTournaments';
import PlayerMatches from './components/player/PlayerMatches';
import PlayerStatistics from './components/player/PlayerStatistics';
// Import admin components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/Users';
import AdminPlayers from './components/admin/Players';
import AdminCoaches from './components/admin/Coaches';
import AdminJudges from './components/admin/Judges';
import AdminOrganizers from './components/admin/Organizers';
import AdminTeams from './components/admin/Teams';
import AdminTournaments from './components/admin/Tournaments';
import AdminMatches from './components/admin/Matches';
import AdminCategories from './components/admin/Categories';
import AdminScores from './components/admin/Scores';
import AdminReports from './components/admin/Reports';
import AdminNotifications from './components/admin/Notifications';
import AdminProfile from './components/admin/Profile';
// Import coach components
import CoachDashboard from './components/coach/CoachDashboard';
import CoachPlayers from './components/coach/CoachPlayers';
import CoachTeam from './components/coach/CoachTeam';
import CoachTournaments from './components/coach/CoachTournaments';
import CoachMatches from './components/coach/CoachMatches';
import CoachTraining from './components/coach/CoachTraining';
import CoachProfile from './components/coach/Profile';
// Import judge components
import JudgeDashboard from './components/judge/JudgeDashboard';
import JudgeTournaments from './components/judge/JudgeTournaments';
import JudgeMatches from './components/judge/JudgeMatches';
import JudgeSchedule from './components/judge/JudgeSchedule';
import JudgeReports from './components/judge/JudgeReports';
import JudgeProfile from './components/judge/Profile';
// Import organizer components
import OrganizerDashboard from './components/organizer/OrganizerDashboard';
import OrganizerTournaments from './components/organizer/OrganizerTournaments';
import OrganizerMatches from './components/organizer/OrganizerMatches';
import OrganizerPlayers from './components/organizer/OrganizerPlayers';
import OrganizerTeams from './components/organizer/OrganizerTeams';
import OrganizerReports from './components/organizer/OrganizerReports';
import OrganizerProfile from './components/organizer/Profile';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotWidget from './components/chatbot/ChatbotWidget';
import authService from './services/authService';

type UserRole = 'admin' | 'player' | 'judge' | 'coach' | 'organizer';
type User = { id: string; name: string; email: string; role: UserRole };

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        console.log('Checking auth status...');
        const response = await authService.getCurrentUser();
        console.log('Auth status response:', response);
        if (response.success && response.data && response.data.user) {
          setUser(response.data.user);
          console.log('User set:', response.data.user);
        } else {
          console.log('Auth check failed or no user data:', response.data?.message || 'No user data');
          // Clear user state if there's an issue
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    console.log('Login success, setting user:', userData);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null); // Force clear user state even if logout fails
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Debug log to see what user data we have
  console.log('App rendering with user:', user);

  return (
    <>
      <ChatbotWidget user={user} />
      <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={<WelcomePage />} 
      />
      <Route 
        path="/login" 
        element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <LoginForm onLoginSuccess={handleLoginSuccess} />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <RegisterForm onLoginSuccess={handleLoginSuccess} />} 
      />
      
      {/* Player routes */}
      <Route 
        path="/player" 
        element={
          <ProtectedRoute allowedRoles={['player']} user={user}>
            <PlayerDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/player/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['player']} user={user}>
            <PlayerDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/player/profile" 
        element={
          <ProtectedRoute allowedRoles={['player']} user={user}>
            <PlayerProfile user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/player/team" 
        element={
          <ProtectedRoute allowedRoles={['player']} user={user}>
            <PlayerTeam user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/player/tournaments" 
        element={
          <ProtectedRoute allowedRoles={['player']} user={user}>
            <PlayerTournaments user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/player/matches" 
        element={
          <ProtectedRoute allowedRoles={['player']} user={user}>
            <PlayerMatches user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/player/statistics" 
        element={
          <ProtectedRoute allowedRoles={['player']} user={user}>
            <PlayerStatistics user={user} />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/players" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminPlayers />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/coaches" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminCoaches user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/judges" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminJudges />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/organizers" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminOrganizers />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/teams" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminTeams user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/tournaments" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminTournaments />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/matches" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminMatches user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/categories" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminCategories />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/scores" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminScores />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/reports" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminReports />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/notifications" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminNotifications />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/profile" 
        element={
          <ProtectedRoute allowedRoles={['admin']} user={user}>
            <AdminProfile user={user} />
          </ProtectedRoute>
        } 
      />
      
      {/* Coach routes */}
      <Route 
        path="/coach" 
        element={
          <ProtectedRoute allowedRoles={['coach']} user={user}>
            <CoachDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coach/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['coach']} user={user}>
            <CoachDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coach/players" 
        element={
          <ProtectedRoute allowedRoles={['coach']} user={user}>
            <CoachPlayers user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coach/team" 
        element={
          <ProtectedRoute allowedRoles={['coach']} user={user}>
            <CoachTeam user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coach/tournaments" 
        element={
          <ProtectedRoute allowedRoles={['coach']} user={user}>
            <CoachTournaments user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coach/matches" 
        element={
          <ProtectedRoute allowedRoles={['coach']} user={user}>
            <CoachMatches user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coach/training" 
        element={
          <ProtectedRoute allowedRoles={['coach']} user={user}>
            <CoachTraining user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coach/profile" 
        element={
          <ProtectedRoute allowedRoles={['coach']} user={user}>
            <CoachProfile user={user} />
          </ProtectedRoute>
        } 
      />
      
      {/* Judge routes */}
      <Route 
        path="/judge" 
        element={
          <ProtectedRoute allowedRoles={['judge']} user={user}>
            <JudgeDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/judge/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['judge']} user={user}>
            <JudgeDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/judge/tournaments" 
        element={
          <ProtectedRoute allowedRoles={['judge']} user={user}>
            <JudgeTournaments user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/judge/matches" 
        element={
          <ProtectedRoute allowedRoles={['judge']} user={user}>
            <JudgeMatches user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/judge/schedule" 
        element={
          <ProtectedRoute allowedRoles={['judge']} user={user}>
            <JudgeSchedule user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/judge/reports" 
        element={
          <ProtectedRoute allowedRoles={['judge']} user={user}>
            <JudgeReports user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/judge/profile" 
        element={
          <ProtectedRoute allowedRoles={['judge']} user={user}>
            <JudgeProfile user={user} />
          </ProtectedRoute>
        } 
      />
      
      {/* Organizer routes */}
      <Route 
        path="/organizer" 
        element={
          <ProtectedRoute allowedRoles={['organizer']} user={user}>
            <OrganizerDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/organizer/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['organizer']} user={user}>
            <OrganizerDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/organizer/tournaments" 
        element={
          <ProtectedRoute allowedRoles={['organizer']} user={user}>
            <OrganizerTournaments user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/organizer/matches" 
        element={
          <ProtectedRoute allowedRoles={['organizer']} user={user}>
            <OrganizerMatches user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/organizer/players" 
        element={
          <ProtectedRoute allowedRoles={['organizer']} user={user}>
            <OrganizerPlayers user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/organizer/teams" 
        element={
          <ProtectedRoute allowedRoles={['organizer']} user={user}>
            <OrganizerTeams user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/organizer/reports" 
        element={
          <ProtectedRoute allowedRoles={['organizer']} user={user}>
            <OrganizerReports user={user} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/organizer/profile" 
        element={
          <ProtectedRoute allowedRoles={['organizer']} user={user}>
            <OrganizerProfile user={user} />
          </ProtectedRoute>
        } 
      />
      
      {/* Unauthorized route */}
      <Route 
        path="/unauthorized" 
        element={<Unauthorized />} 
      />
      
      {/* Catch all route */}
      <Route 
        path="*" 
        element={<Navigate to={user ? `/${user?.role || 'player'}/dashboard` : "/"} />} 
      />
      </Routes>
    </>
  );
}

export default App;