import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// In-memory storage for demo mode when MongoDB is not available
let demoUsers: any[] = [];
let mongoAvailable = true;

const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (mongoAvailable) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Prevent non-admin users from registering as admin
        let userRole = role || 'player';
        if (userRole === 'admin') {
          // Check if there are any existing admins
          const adminCount = await User.countDocuments({ role: 'admin' });
          if (adminCount > 0) {
            // If there are existing admins, default to player role
            userRole = 'player';
          }
          // If there are no admins yet, allow the first admin registration
        }

        // Create new user
        const user = new User({
          firstName,
          lastName,
          email,
          password,
          role: userRole,
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '7d' }
        );

        return res.status(201).json({
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
        });
      } catch (mongoError) {
        // If MongoDB operation fails, switch to demo mode
        mongoAvailable = false;
        console.log('Switching to demo mode due to MongoDB error');
      }
    }

    // Demo mode - use in-memory storage
    const existingUser = demoUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Prevent non-admin users from registering as admin
    let userRole = role || 'player';
    if (userRole === 'admin') {
      // Check if there are any existing admins
      const adminCount = demoUsers.filter(u => u.role === 'admin').length;
      if (adminCount > 0) {
        // If there are existing admins, default to player role
        userRole = 'player';
      }
      // If there are no admins yet, allow the first admin registration
    }

    // Create new user in memory
    const newUser = {
      id: demoUsers.length + 1,
      firstName,
      lastName,
      email,
      password, // In a real app, this would be hashed
      role: userRole,
    };

    demoUsers.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (mongoAvailable) {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          // Try demo mode
          throw new Error('User not found in MongoDB');
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '7d' }
        );

        return res.status(200).json({
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
        });
      } catch (mongoError) {
        // If MongoDB operation fails, switch to demo mode
        mongoAvailable = false;
        console.log('Switching to demo mode due to MongoDB error');
      }
    }

    // Demo mode - use in-memory storage
    const user = demoUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (mongoAvailable) {
      try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
          // Try demo mode
          throw new Error('User not found in MongoDB');
        }
        return res.status(200).json(user);
      } catch (mongoError) {
        // If MongoDB operation fails, switch to demo mode
        mongoAvailable = false;
        console.log('Switching to demo mode due to MongoDB error');
      }
    }

    // Demo mode - use in-memory storage
    const user = demoUsers.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { register, login, getProfile };