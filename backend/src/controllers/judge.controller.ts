import { Request, Response } from 'express';
import Judge from '../models/Judge';

// Get all judges
export const getJudges = async (req: Request, res: Response): Promise<Response> => {
  try {
    const judges = await Judge.find().sort({ createdAt: -1 });
    return res.status(200).json(judges);
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
    return res.status(200).json(judge);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching judge', error: error.message });
  }
};

// Create new judge
export const createJudge = async (req: Request, res: Response): Promise<Response> => {
  try {
    const judge = new Judge(req.body);
    await judge.save();
    return res.status(201).json(judge);
  } catch (error: any) {
    return res.status(400).json({ message: 'Error creating judge', error: error.message });
  }
};

// Update judge
export const updateJudge = async (req: Request, res: Response): Promise<Response> => {
  try {
    const judge = await Judge.findByIdAndUpdate(req.params.id, req.body, { new: true });
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