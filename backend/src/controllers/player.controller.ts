import { Request, Response } from 'express';
import Player from '../models/Player';

// Get all players
export const getPlayers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    return res.status(200).json(players);
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
    return res.status(200).json(player);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching player', error: error.message });
  }
};

// Create new player
export const createPlayer = async (req: Request, res: Response): Promise<Response> => {
  try {
    const player = new Player(req.body);
    await player.save();
    return res.status(201).json(player);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating player', error: error.message });
  }
};

// Update player
export const updatePlayer = async (req: Request, res: Response): Promise<Response> => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
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