import { Request, Response } from 'express';
import Coach from '../models/Coach';

// Get all coaches
export const getCoaches = async (req: Request, res: Response): Promise<Response> => {
  try {
    const coaches = await Coach.find().sort({ createdAt: -1 });
    return res.status(200).json(coaches);
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
    return res.status(200).json(coach);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching coach', error: error.message });
  }
};

// Create new coach
export const createCoach = async (req: Request, res: Response): Promise<Response> => {
  try {
    const coach = new Coach(req.body);
    await coach.save();
    return res.status(201).json(coach);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating coach', error: error.message });
  }
};

// Update coach
export const updateCoach = async (req: Request, res: Response): Promise<Response> => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
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