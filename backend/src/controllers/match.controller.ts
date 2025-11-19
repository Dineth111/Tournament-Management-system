import { Request, Response } from 'express';
import Match, { IMatch } from '../models/Match';
import Player, { IPlayer } from '../models/Player';
import Tournament, { ITournament } from '../models/Tournament';

// Get all matches
export const getMatches = async (req: Request, res: Response): Promise<Response> => {
  try {
    const matches = await Match.find()
      .populate('tournament', 'name')
      .populate('player1', 'firstName lastName')
      .populate('player2', 'firstName lastName')
      .populate('winner', 'firstName lastName')
      .sort({ createdAt: -1 });
    return res.status(200).json(matches);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
};

// Get match by ID
export const getMatchById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('tournament', 'name')
      .populate('player1', 'firstName lastName')
      .populate('player2', 'firstName lastName')
      .populate('winner', 'firstName lastName');
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    return res.status(200).json(match);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching match', error: error.message });
  }
};

// Create new match
export const createMatch = async (req: Request, res: Response): Promise<Response> => {
  try {
    const match = new Match(req.body);
    await match.save();
    return res.status(201).json(match);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating match', error: error.message });
  }
};

// Update match
export const updateMatch = async (req: Request, res: Response): Promise<Response> => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    return res.status(200).json(match);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error updating match', error: error.message });
  }
};

// Delete match
export const deleteMatch = async (req: Request, res: Response): Promise<Response> => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    return res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting match', error: error.message });
  }
};

// Generate match draw
export const generateMatchDraw = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tournamentId, eventType, ageGroup, beltRank, weightCategory } = req.body;
    
    // Validate required parameters
    if (!tournamentId) {
      return res.status(400).json({ message: 'Tournament ID is required' });
    }
    
    // Find the tournament
    const tournament: ITournament | null = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    // Find all players registered for this tournament
    // For now, we'll simulate this by finding players with matching criteria
    const players: IPlayer[] = await Player.find({
      beltRank: beltRank || { $exists: true },
    }).limit(20); // Limit to 20 players for demo purposes
    
    if (players.length < 2) {
      return res.status(400).json({ message: 'Not enough players to generate matches' });
    }
    
    // Sort players by multiple criteria to create fair matches
    const sortedPlayers: IPlayer[] = players.sort((a, b) => {
      // Primary sort by belt rank (higher rank first)
      const beltRankOrder = ['White Belt', 'Yellow Belt', 'Orange Belt', 'Green Belt', 'Blue Belt', 'Purple Belt', 'Brown Belt', 'Black Belt'];
      const aBeltIndex = beltRankOrder.indexOf(a.beltRank);
      const bBeltIndex = beltRankOrder.indexOf(b.beltRank);
      
      if (aBeltIndex !== bBeltIndex) {
        return bBeltIndex - aBeltIndex;
      }
      
      // Secondary sort by weight (closer weights together)
      if (a.weight && b.weight) {
        return Math.abs(a.weight - b.weight);
      }
      
      // Tertiary sort by age (closer ages together)
      if (a.age && b.age) {
        return Math.abs(a.age - b.age);
      }
      
      return 0;
    });
    
    // Generate matches by pairing players
    const matches: IMatch[] = [];
    const usedPlayers = new Set();
    
    for (let i = 0; i < sortedPlayers.length - 1; i += 2) {
      const player1 = sortedPlayers[i];
      const player2 = sortedPlayers[i + 1];
      
      if (!usedPlayers.has(player1._id.toString()) && !usedPlayers.has(player2._id.toString())) {
        const matchData = {
          matchNumber: `M${String(matches.length + 1).padStart(3, '0')}`,
          tournament: tournamentId,
          player1: player1._id,
          player2: player2._id,
          category: `${eventType} - ${beltRank}`,
          round: 'Preliminary',
          scheduledTime: new Date(Date.now() + (matches.length + 1) * 3600000), // 1 hour apart
          arena: 'Arena A',
        };
        
        const match: IMatch = new Match(matchData);
        await match.save();
        matches.push(match);
        usedPlayers.add(player1._id.toString());
        usedPlayers.add(player2._id.toString());
      }
    }
    
    return res.status(200).json({ 
      message: 'Match draw generated successfully',
      tournament: tournament.name,
      matchesGenerated: matches.length,
      matches: matches.map(m => ({
        matchNumber: m.matchNumber,
        player1: sortedPlayers.find(p => p._id.toString() === m.player1.toString())?.firstName + ' ' + sortedPlayers.find(p => p._id.toString() === m.player1.toString())?.lastName,
        player2: sortedPlayers.find(p => p._id.toString() === m.player2.toString())?.firstName + ' ' + sortedPlayers.find(p => p._id.toString() === m.player2.toString())?.lastName,
        category: m.category,
        scheduledTime: m.scheduledTime,
        arena: m.arena
      }))
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error generating match draw', error: error.message });
  }
};