import { Request, Response } from 'express';
import User from '../models/User';
import Player from '../models/Player';
import Judge from '../models/Judge';
import Coach from '../models/Coach';
import Tournament from '../models/Tournament';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [
      totalUsers,
      totalPlayers,
      totalJudges,
      totalCoaches,
      totalTournaments
    ] = await Promise.all([
      User.countDocuments(),
      Player.countDocuments(),
      Judge.countDocuments(),
      Coach.countDocuments(),
      Tournament.countDocuments()
    ]);

    return res.status(200).json({
      stats: {
        totalUsers,
        totalPlayers,
        totalJudges,
        totalCoaches,
        totalTournaments
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Get all users (admin only)
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Create new user
export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const user = new User({ firstName, lastName, email, password, role });
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    // Use type assertion to avoid TypeScript error
    delete (userResponse as any).password;
    
    return res.status(201).json(userResponse);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Don't allow password updates through this endpoint
    delete updateData.password;
    
    const user = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // Prevent deleting the current admin user
    if (req.user && req.user._id.toString() === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get all players
export const getPlayers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    
    // Map backend models to frontend data structure
    const playersData = players.map(player => ({
      _id: player._id,
      firstName: player.firstName,
      lastName: player.lastName,
      email: player.email,
      age: player.age,
      weight: player.weight,
      beltRank: player.beltRank,
      dojo: player.dojo,
      // Add other fields that might be needed by frontend
      height: 170, // Default value since not in backend model
      experience: 1, // Default value since not in backend model
      category: 'Kata' // Default value since not in backend model
    }));
    
    return res.status(200).json(playersData);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching players', error: error.message });
  }
};

// Get player by ID
export const getPlayerById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    // Map backend model to frontend data structure
    const playerData = {
      _id: player._id,
      firstName: player.firstName,
      lastName: player.lastName,
      email: player.email,
      age: player.age,
      weight: player.weight,
      beltRank: player.beltRank,
      dojo: player.dojo,
      // Add other fields that might be needed by frontend
      height: 170, // Default value since not in backend model
      experience: 1, // Default value since not in backend model
      category: 'Kata' // Default value since not in backend model
    };
    
    return res.status(200).json(playerData);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching player', error: error.message });
  }
};

// Create new player
export const createPlayer = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Map frontend data structure to backend model
    const playerData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dateOfBirth: new Date(new Date().getFullYear() - req.body.age, 0, 1), // Approximate DOB from age
      gender: 'male', // Default value, should be in frontend form
      beltRank: req.body.beltRank,
      weight: req.body.weight,
      dojo: req.body.dojo,
      coach: '', // Not in frontend form
      emergencyContact: {
        name: '', // Not in frontend form
        phone: '', // Not in frontend form
        relationship: '' // Not in frontend form
      },
      medicalInfo: '', // Not in frontend form
      age: req.body.age
    };
    
    const player = new Player(playerData);
    await player.save();
    return res.status(201).json(player);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating player', error: error.message });
  }
};

// Update player
export const updatePlayer = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Map frontend data structure to backend model
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      beltRank: req.body.beltRank,
      weight: req.body.weight,
      dojo: req.body.dojo,
      age: req.body.age
    };
    
    const player = await Player.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    return res.status(200).json(player);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error updating player', error: error.message });
  }
};

// Delete player
export const deletePlayer = async (req: Request, res: Response): Promise<Response> => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    return res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting player', error: error.message });
  }
};

// Get all judges
export const getJudges = async (req: Request, res: Response): Promise<Response> => {
  try {
    const judges = await Judge.find().sort({ createdAt: -1 });
    
    // Map backend models to frontend data structure
    const judgesData = judges.map(judge => ({
      _id: judge._id,
      firstName: judge.firstName,
      lastName: judge.lastName,
      email: judge.email,
      certificationLevel: judge.certificationLevel,
      yearsOfExperience: judge.yearsOfExperience,
      specialization: judge.specialization[0] || 'Kata', // Convert array to string
      // Add other fields that might be needed by frontend
      assignedTournaments: 0 // Default value since not in backend model
    }));
    
    return res.status(200).json(judgesData);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching judges', error: error.message });
  }
};

// Get judge by ID
export const getJudgeById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const judge = await Judge.findById(req.params.id);
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }
    
    // Map backend model to frontend data structure
    const judgeData = {
      _id: judge._id,
      firstName: judge.firstName,
      lastName: judge.lastName,
      email: judge.email,
      certificationLevel: judge.certificationLevel,
      yearsOfExperience: judge.yearsOfExperience,
      specialization: judge.specialization[0] || 'Kata', // Convert array to string
      // Add other fields that might be needed by frontend
      assignedTournaments: 0 // Default value since not in backend model
    };
    
    return res.status(200).json(judgeData);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching judge', error: error.message });
  }
};

// Create new judge
export const createJudge = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Map frontend data structure to backend model
    const judgeData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: '', // Not in frontend form
      certificationLevel: req.body.certificationLevel,
      licenseNumber: '', // Not in frontend form
      yearsOfExperience: req.body.yearsOfExperience,
      emergencyContact: {
        name: '', // Not in frontend form
        phone: '', // Not in frontend form
        relationship: '' // Not in frontend form
      },
      specialization: [req.body.specialization], // Convert string to array
      rating: 0, // Default value
      assignedMatches: 0, // Default value
      status: 'Active' // Default value
    };
    
    const judge = new Judge(judgeData);
    await judge.save();
    return res.status(201).json(judge);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating judge', error: error.message });
  }
};

// Update judge
export const updateJudge = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Map frontend data structure to backend model
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      certificationLevel: req.body.certificationLevel,
      yearsOfExperience: req.body.yearsOfExperience,
      specialization: [req.body.specialization] // Convert string to array
    };
    
    const judge = await Judge.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }
    return res.status(200).json(judge);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error updating judge', error: error.message });
  }
};

// Delete judge
export const deleteJudge = async (req: Request, res: Response): Promise<Response> => {
  try {
    const judge = await Judge.findByIdAndDelete(req.params.id);
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }
    return res.status(200).json({ message: 'Judge deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting judge', error: error.message });
  }
};

// Get all coaches
export const getCoaches = async (req: Request, res: Response): Promise<Response> => {
  try {
    const coaches = await Coach.find().sort({ createdAt: -1 });
    
    // Map backend models to frontend data structure
    const coachesData = coaches.map(coach => ({
      _id: coach._id,
      firstName: coach.firstName,
      lastName: coach.lastName,
      email: coach.email,
      dojo: coach.dojo,
      yearsOfExperience: coach.yearsOfExperience,
      specialization: coach.specialization,
      // Add other fields that might be needed by frontend
      certifiedPlayers: 0 // Default value since not in backend model
    }));
    
    return res.status(200).json(coachesData);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching coaches', error: error.message });
  }
};

// Get coach by ID
export const getCoachById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    
    // Map backend model to frontend data structure
    const coachData = {
      _id: coach._id,
      firstName: coach.firstName,
      lastName: coach.lastName,
      email: coach.email,
      dojo: coach.dojo,
      yearsOfExperience: coach.yearsOfExperience,
      specialization: coach.specialization,
      // Add other fields that might be needed by frontend
      certifiedPlayers: 0 // Default value since not in backend model
    };
    
    return res.status(200).json(coachData);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching coach', error: error.message });
  }
};

// Create new coach
export const createCoach = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Map frontend data structure to backend model
    const coachData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: '', // Not in frontend form
      dojo: req.body.dojo,
      specialization: req.body.specialization,
      yearsOfExperience: req.body.yearsOfExperience,
      certifications: '', // Not in frontend form
      activeStudents: 0, // Default value
      status: 'Active' // Default value
    };
    
    const coach = new Coach(coachData);
    await coach.save();
    return res.status(201).json(coach);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating coach', error: error.message });
  }
};

// Update coach
export const updateCoach = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Map frontend data structure to backend model
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dojo: req.body.dojo,
      specialization: req.body.specialization,
      yearsOfExperience: req.body.yearsOfExperience
    };
    
    const coach = await Coach.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    return res.status(200).json(coach);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error updating coach', error: error.message });
  }
};

// Delete coach
export const deleteCoach = async (req: Request, res: Response): Promise<Response> => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    return res.status(200).json({ message: 'Coach deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting coach', error: error.message });
  }
};

// Get all tournaments
export const getTournaments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tournaments = await Tournament.find().sort({ startDate: -1 });
    
    // Map backend models to frontend data structure
    const tournamentsData = tournaments.map(tournament => ({
      _id: tournament._id,
      name: tournament.name,
      description: tournament.description,
      eventType: tournament.eventType,
      startDate: tournament.startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      endDate: tournament.endDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      location: tournament.location,
      registrationDeadline: tournament.registrationDeadline.toISOString().split('T')[0], // Format as YYYY-MM-DD
      registrationFee: tournament.registrationFee,
      maxParticipants: tournament.maxParticipants,
      status: tournament.status,
      participants: tournament.participants
    }));
    
    return res.status(200).json(tournamentsData);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching tournaments', error: error.message });
  }
};

// Get tournament by ID
export const getTournamentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    // Map backend model to frontend data structure
    const tournamentData = {
      _id: tournament._id,
      name: tournament.name,
      description: tournament.description,
      eventType: tournament.eventType,
      startDate: tournament.startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      endDate: tournament.endDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      location: tournament.location,
      registrationDeadline: tournament.registrationDeadline.toISOString().split('T')[0], // Format as YYYY-MM-DD
      registrationFee: tournament.registrationFee,
      maxParticipants: tournament.maxParticipants,
      status: tournament.status,
      participants: tournament.participants
    };
    
    return res.status(200).json(tournamentData);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching tournament', error: error.message });
  }
};

// Create new tournament
export const createTournament = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Map frontend data structure to backend model
    const tournamentData = {
      name: req.body.name,
      description: req.body.description,
      eventType: req.body.eventType,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      location: req.body.location,
      registrationDeadline: new Date(req.body.registrationDeadline),
      registrationFee: req.body.registrationFee,
      maxParticipants: req.body.maxParticipants,
      rules: '', // Not in frontend form
      status: req.body.status,
      participants: 0 // Default value
    };
    
    const tournament = new Tournament(tournamentData);
    await tournament.save();
    return res.status(201).json(tournament);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating tournament', error: error.message });
  }
};

// Update tournament
export const updateTournament = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Map frontend data structure to backend model
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      eventType: req.body.eventType,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      location: req.body.location,
      registrationDeadline: new Date(req.body.registrationDeadline),
      registrationFee: req.body.registrationFee,
      maxParticipants: req.body.maxParticipants,
      status: req.body.status
    };
    
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    return res.status(200).json(tournament);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error updating tournament', error: error.message });
  }
};

// Delete tournament
export const deleteTournament = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    return res.status(200).json({ message: 'Tournament deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting tournament', error: error.message });
  }
};