import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import playerRoutes from './routes/player.routes';
import judgeRoutes from './routes/judge.routes';
import tournamentRoutes from './routes/tournament.routes';
import matchRoutes from './routes/match.routes';
import coachRoutes from './routes/coach.routes';
import liveScoreRoutes from './routes/liveScore.routes';
import paymentRoutes from './routes/payment.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active matches and their scores
const activeMatches = new Map();

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a match room
  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
    console.log(`User ${socket.id} joined match ${matchId}`);
    
    // Send current match score if available
    if (activeMatches.has(matchId)) {
      socket.emit('scoreUpdate', activeMatches.get(matchId));
    }
  });

  // Handle score updates
  socket.on('updateScore', (data) => {
    const { matchId, player1Score, player2Score } = data;
    
    // Update the score in memory
    activeMatches.set(matchId, { player1Score, player2Score });
    
    // Broadcast the score update to all clients in the match room
    io.to(matchId).emit('scoreUpdate', { player1Score, player2Score });
    console.log(`Score updated for match ${matchId}: ${player1Score} - ${player2Score}`);
  });

  // Handle match events (warnings, penalties, etc.)
  socket.on('matchEvent', (data) => {
    const { matchId, eventType, player, timestamp } = data;
    
    // Broadcast the event to all clients in the match room
    io.to(matchId).emit('matchEvent', { eventType, player, timestamp });
    console.log(`Match event for ${matchId}: ${eventType} on player ${player}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/judges', judgeRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/live-score', liveScoreRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tournament_management';

// Start server regardless of MongoDB connection
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Try to connect to MongoDB
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      console.log('Server is running but MongoDB is not connected');
    });
});
