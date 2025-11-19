import { Request, Response } from 'express';
import Tournament from '../models/Tournament';

// Get all tournaments
export const getTournaments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    return res.status(200).json(tournaments);
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
    return res.status(200).json(tournament);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching tournament', error: error.message });
  }
};

// Create new tournament
export const createTournament = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    return res.status(201).json(tournament);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating tournament', error: error.message });
  }
};

// Update tournament
export const updateTournament = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
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