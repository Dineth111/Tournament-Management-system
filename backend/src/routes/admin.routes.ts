import express from 'express';
import { 
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getJudges,
  getJudgeById,
  createJudge,
  updateJudge,
  deleteJudge,
  getCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All admin routes require authentication and admin authorization
router.use(authenticate, authorize('admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Players
router.get('/players', getPlayers);
router.get('/players/:id', getPlayerById);
router.post('/players', createPlayer);
router.put('/players/:id', updatePlayer);
router.delete('/players/:id', deletePlayer);

// Judges
router.get('/judges', getJudges);
router.get('/judges/:id', getJudgeById);
router.post('/judges', createJudge);
router.put('/judges/:id', updateJudge);
router.delete('/judges/:id', deleteJudge);

// Coaches
router.get('/coaches', getCoaches);
router.get('/coaches/:id', getCoachById);
router.post('/coaches', createCoach);
router.put('/coaches/:id', updateCoach);
router.delete('/coaches/:id', deleteCoach);

// Tournaments
router.get('/tournaments', getTournaments);
router.get('/tournaments/:id', getTournamentById);
router.post('/tournaments', createTournament);
router.put('/tournaments/:id', updateTournament);
router.delete('/tournaments/:id', deleteTournament);

export default router;