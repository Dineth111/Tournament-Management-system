const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Match = require('../models/Match');
const Tournament = require('../models/Tournament');

/**
 * Socket.IO configuration for real-time tournament management
 * Handles live scoring, notifications, and real-time updates
 */

let io;
let connectedUsers = new Map(); // userId -> socket info
let tournamentRooms = new Map(); // tournamentId -> Set of userIds
let matchRooms = new Map(); // matchId -> Set of userIds

/**
 * Initialize Socket.IO server
 */
function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      socket.userName = `${user.firstName} ${user.lastName}`;
      socket.userData = user;
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userName} (${socket.userRole})`);
    
    // Store connected user
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      userId: socket.userId,
      role: socket.userRole,
      name: socket.userName,
      connectedAt: new Date()
    });

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Set up event handlers
    setupSocketHandlers(socket);

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to tournament system',
      userId: socket.userId,
      role: socket.userRole
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      handleDisconnection(socket);
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.userName}:`, error);
    });
  });

  return io;
}

/**
 * Set up socket event handlers
 */
function setupSocketHandlers(socket) {
  // Tournament room management
  socket.on('join_tournament', (data) => {
    handleJoinTournament(socket, data);
  });

  socket.on('leave_tournament', (data) => {
    handleLeaveTournament(socket, data);
  });

  // Match room management
  socket.on('join_match', (data) => {
    handleJoinMatch(socket, data);
  });

  socket.on('leave_match', (data) => {
    handleLeaveMatch(socket, data);
  });

  // Live scoring events
  socket.on('score_update', (data) => {
    handleScoreUpdate(socket, data);
  });

  socket.on('match_status_update', (data) => {
    handleMatchStatusUpdate(socket, data);
  });

  // Judge-specific events
  socket.on('judge_ready', (data) => {
    handleJudgeReady(socket, data);
  });

  socket.on('judge_score_submit', (data) => {
    handleJudgeScoreSubmit(socket, data);
  });

  // Chat events
  socket.on('tournament_chat', (data) => {
    handleTournamentChat(socket, data);
  });

  socket.on('match_chat', (data) => {
    handleMatchChat(socket, data);
  });

  // Notification preferences
  socket.on('update_notification_preferences', (data) => {
    handleNotificationPreferences(socket, data);
  });

  // Admin events
  socket.on('broadcast_message', (data) => {
    handleBroadcastMessage(socket, data);
  });

  socket.on('emergency_notification', (data) => {
    handleEmergencyNotification(socket, data);
  });
}

/**
 * Handle user joining tournament room
 */
function handleJoinTournament(socket, data) {
  try {
    const { tournamentId } = data;
    
    if (!tournamentId) {
      socket.emit('error', { message: 'Tournament ID is required' });
      return;
    }

    const roomName = `tournament:${tournamentId}`;
    socket.join(roomName);

    // Track user in tournament room
    if (!tournamentRooms.has(tournamentId)) {
      tournamentRooms.set(tournamentId, new Set());
    }
    tournamentRooms.get(tournamentId).add(socket.userId);

    console.log(`User ${socket.userName} joined tournament room: ${tournamentId}`);

    // Notify others in the room
    socket.to(roomName).emit('user_joined_tournament', {
      userId: socket.userId,
      userName: socket.userName,
      role: socket.userRole,
      tournamentId
    });

    // Send current tournament state
    emitTournamentState(socket, tournamentId);

  } catch (error) {
    console.error('Error joining tournament room:', error);
    socket.emit('error', { message: 'Failed to join tournament room' });
  }
}

/**
 * Handle user leaving tournament room
 */
function handleLeaveTournament(socket, data) {
  try {
    const { tournamentId } = data;
    const roomName = `tournament:${tournamentId}`;
    
    socket.leave(roomName);

    // Remove user from tournament room tracking
    if (tournamentRooms.has(tournamentId)) {
      tournamentRooms.get(tournamentId).delete(socket.userId);
      if (tournamentRooms.get(tournamentId).size === 0) {
        tournamentRooms.delete(tournamentId);
      }
    }

    console.log(`User ${socket.userName} left tournament room: ${tournamentId}`);

    // Notify others in the room
    socket.to(roomName).emit('user_left_tournament', {
      userId: socket.userId,
      userName: socket.userName,
      tournamentId
    });

  } catch (error) {
    console.error('Error leaving tournament room:', error);
    socket.emit('error', { message: 'Failed to leave tournament room' });
  }
}

/**
 * Handle user joining match room
 */
function handleJoinMatch(socket, data) {
  try {
    const { matchId } = data;
    
    if (!matchId) {
      socket.emit('error', { message: 'Match ID is required' });
      return;
    }

    const roomName = `match:${matchId}`;
    socket.join(roomName);

    // Track user in match room
    if (!matchRooms.has(matchId)) {
      matchRooms.set(matchId, new Set());
    }
    matchRooms.get(matchId).add(socket.userId);

    console.log(`User ${socket.userName} joined match room: ${matchId}`);

    // Notify others in the room
    socket.to(roomName).emit('user_joined_match', {
      userId: socket.userId,
      userName: socket.userName,
      role: socket.userRole,
      matchId
    });

    // Send current match state
    emitMatchState(socket, matchId);

  } catch (error) {
    console.error('Error joining match room:', error);
    socket.emit('error', { message: 'Failed to join match room' });
  }
}

/**
 * Handle user leaving match room
 */
function handleLeaveMatch(socket, data) {
  try {
    const { matchId } = data;
    const roomName = `match:${matchId}`;
    
    socket.leave(roomName);

    // Remove user from match room tracking
    if (matchRooms.has(matchId)) {
      matchRooms.get(matchId).delete(socket.userId);
      if (matchRooms.get(matchId).size === 0) {
        matchRooms.delete(matchId);
      }
    }

    console.log(`User ${socket.userName} left match room: ${matchId}`);

    // Notify others in the room
    socket.to(roomName).emit('user_left_match', {
      userId: socket.userId,
      userName: socket.userName,
      matchId
    });

  } catch (error) {
    console.error('Error leaving match room:', error);
    socket.emit('error', { message: 'Failed to leave match room' });
  }
}

/**
 * Handle live score updates
 */
function handleScoreUpdate(socket, data) {
  try {
    const { matchId, scores, judgeId } = data;
    
    // Verify user is a judge for this match
    if (socket.userRole !== 'judge') {
      socket.emit('error', { message: 'Only judges can update scores' });
      return;
    }

    const roomName = `match:${matchId}`;
    
    // Broadcast score update to all in the match room
    io.to(roomName).emit('score_updated', {
      matchId,
      scores,
      judgeId,
      updatedBy: socket.userName,
      timestamp: new Date()
    });

    // Also broadcast to tournament room for live dashboard updates
    Match.findById(matchId)
      .then(match => {
        if (match) {
          const tournamentRoom = `tournament:${match.tournament}`;
          io.to(tournamentRoom).emit('match_score_updated', {
            matchId,
            tournamentId: match.tournament,
            scores,
            judgeId,
            updatedBy: socket.userName,
            timestamp: new Date()
          });
        }
      })
      .catch(error => {
        console.error('Error getting match for tournament broadcast:', error);
      });

    console.log(`Score updated for match ${matchId} by judge ${socket.userName}`);

  } catch (error) {
    console.error('Error handling score update:', error);
    socket.emit('error', { message: 'Failed to update score' });
  }
}

/**
 * Handle match status updates
 */
function handleMatchStatusUpdate(socket, data) {
  try {
    const { matchId, status, details } = data;
    
    // Verify user has permission to update match status
    if (!['organizer', 'admin', 'judge'].includes(socket.userRole)) {
      socket.emit('error', { message: 'Insufficient permissions to update match status' });
      return;
    }

    const roomName = `match:${matchId}`;
    
    // Broadcast status update to all in the match room
    io.to(roomName).emit('match_status_updated', {
      matchId,
      status,
      details,
      updatedBy: socket.userName,
      updatedByRole: socket.userRole,
      timestamp: new Date()
    });

    // Also broadcast to tournament room
    Match.findById(matchId)
      .then(match => {
        if (match) {
          const tournamentRoom = `tournament:${match.tournament}`;
          io.to(tournamentRoom).emit('tournament_match_status_updated', {
            matchId,
            tournamentId: match.tournament,
            status,
            details,
            updatedBy: socket.userName,
            timestamp: new Date()
          });
        }
      })
      .catch(error => {
        console.error('Error getting match for tournament broadcast:', error);
      });

    console.log(`Match ${matchId} status updated to ${status} by ${socket.userName}`);

  } catch (error) {
    console.error('Error handling match status update:', error);
    socket.emit('error', { message: 'Failed to update match status' });
  }
}

/**
 * Handle judge ready notification
 */
function handleJudgeReady(socket, data) {
  try {
    const { matchId, judgeId } = data;
    
    if (socket.userRole !== 'judge') {
      socket.emit('error', { message: 'Only judges can signal readiness' });
      return;
    }

    const roomName = `match:${matchId}`;
    
    io.to(roomName).emit('judge_ready', {
      matchId,
      judgeId,
      judgeName: socket.userName,
      timestamp: new Date()
    });

    console.log(`Judge ${socket.userName} is ready for match ${matchId}`);

  } catch (error) {
    console.error('Error handling judge ready:', error);
    socket.emit('error', { message: 'Failed to signal judge readiness' });
  }
}

/**
 * Handle judge score submission
 */
function handleJudgeScoreSubmit(socket, data) {
  try {
    const { matchId, scores, judgeId } = data;
    
    if (socket.userRole !== 'judge') {
      socket.emit('error', { message: 'Only judges can submit scores' });
      return;
    }

    const roomName = `match:${matchId}`;
    
    io.to(roomName).emit('judge_score_submitted', {
      matchId,
      judgeId,
      judgeName: socket.userName,
      scores,
      timestamp: new Date()
    });

    console.log(`Judge ${socket.userName} submitted scores for match ${matchId}`);

  } catch (error) {
    console.error('Error handling judge score submission:', error);
    socket.emit('error', { message: 'Failed to submit judge scores' });
  }
}

/**
 * Handle tournament chat messages
 */
function handleTournamentChat(socket, data) {
  try {
    const { tournamentId, message } = data;
    
    if (!message || message.trim().length === 0) {
      socket.emit('error', { message: 'Message cannot be empty' });
      return;
    }

    const roomName = `tournament:${tournamentId}`;
    
    const chatMessage = {
      id: Date.now().toString(),
      userId: socket.userId,
      userName: socket.userName,
      userRole: socket.userRole,
      message: message.trim(),
      timestamp: new Date(),
      tournamentId
    };

    // Broadcast to all in tournament room
    io.to(roomName).emit('tournament_chat_message', chatMessage);

    console.log(`Chat message in tournament ${tournamentId} from ${socket.userName}: ${message}`);

  } catch (error) {
    console.error('Error handling tournament chat:', error);
    socket.emit('error', { message: 'Failed to send chat message' });
  }
}

/**
 * Handle match chat messages
 */
function handleMatchChat(socket, data) {
  try {
    const { matchId, message } = data;
    
    if (!message || message.trim().length === 0) {
      socket.emit('error', { message: 'Message cannot be empty' });
      return;
    }

    const roomName = `match:${matchId}`;
    
    const chatMessage = {
      id: Date.now().toString(),
      userId: socket.userId,
      userName: socket.userName,
      userRole: socket.userRole,
      message: message.trim(),
      timestamp: new Date(),
      matchId
    };

    // Broadcast to all in match room
    io.to(roomName).emit('match_chat_message', chatMessage);

    console.log(`Chat message in match ${matchId} from ${socket.userName}: ${message}`);

  } catch (error) {
    console.error('Error handling match chat:', error);
    socket.emit('error', { message: 'Failed to send chat message' });
  }
}

/**
 * Handle notification preferences
 */
function handleNotificationPreferences(socket, data) {
  try {
    const { preferences } = data;
    
    // Store preferences in connected users map
    if (connectedUsers.has(socket.userId)) {
      connectedUsers.get(socket.userId).notificationPreferences = preferences;
    }

    socket.emit('notification_preferences_updated', {
      preferences,
      message: 'Notification preferences updated'
    });

    console.log(`Notification preferences updated for user ${socket.userName}`);

  } catch (error) {
    console.error('Error handling notification preferences:', error);
    socket.emit('error', { message: 'Failed to update notification preferences' });
  }
}

/**
 * Handle broadcast messages (admin only)
 */
function handleBroadcastMessage(socket, data) {
  try {
    const { message, targetRole } = data;
    
    if (socket.userRole !== 'admin') {
      socket.emit('error', { message: 'Only admins can broadcast messages' });
      return;
    }

    const broadcastData = {
      message,
      from: socket.userName,
      timestamp: new Date(),
      targetRole
    };

    if (targetRole) {
      // Broadcast to users with specific role
      connectedUsers.forEach((userInfo, userId) => {
        if (userInfo.role === targetRole) {
          io.to(`user:${userId}`).emit('admin_broadcast', broadcastData);
        }
      });
    } else {
      // Broadcast to all connected users
      io.emit('admin_broadcast', broadcastData);
    }

    console.log(`Admin broadcast from ${socket.userName}: ${message}`);

  } catch (error) {
    console.error('Error handling broadcast message:', error);
    socket.emit('error', { message: 'Failed to broadcast message' });
  }
}

/**
 * Handle emergency notifications (admin only)
 */
function handleEmergencyNotification(socket, data) {
  try {
    const { message, type, affectedAreas } = data;
    
    if (socket.userRole !== 'admin') {
      socket.emit('error', { message: 'Only admins can send emergency notifications' });
      return;
    }

    const emergencyData = {
      type,
      message,
      from: socket.userName,
      timestamp: new Date(),
      affectedAreas
    };

    // Emergency notifications go to everyone
    io.emit('emergency_notification', emergencyData);

    console.log(`Emergency notification from ${socket.userName}: ${message}`);

  } catch (error) {
    console.error('Error handling emergency notification:', error);
    socket.emit('error', { message: 'Failed to send emergency notification' });
  }
}

/**
 * Handle user disconnection
 */
function handleDisconnection(socket) {
  console.log(`User disconnected: ${socket.userName}`);

  // Remove from connected users
  connectedUsers.delete(socket.userId);

  // Remove from all tournament rooms
  tournamentRooms.forEach((userSet, tournamentId) => {
    if (userSet.has(socket.userId)) {
      userSet.delete(socket.userId);
      if (userSet.size === 0) {
        tournamentRooms.delete(tournamentId);
      }
    }
  });

  // Remove from all match rooms
  matchRooms.forEach((userSet, matchId) => {
    if (userSet.has(socket.userId)) {
      userSet.delete(socket.userId);
      if (userSet.size === 0) {
        matchRooms.delete(matchId);
      }
    }
  });
}

/**
 * Emit current tournament state to socket
 */
async function emitTournamentState(socket, tournamentId) {
  try {
    const tournament = await Tournament.findById(tournamentId)
      .populate('organizer', 'name')
      .select('-registrations');

    if (!tournament) {
      socket.emit('error', { message: 'Tournament not found' });
      return;
    }

    const connectedUsersCount = tournamentRooms.has(tournamentId) 
      ? tournamentRooms.get(tournamentId).size 
      : 0;

    socket.emit('tournament_state', {
      tournament: {
        id: tournament._id,
        name: tournament.name,
        status: tournament.status,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        location: tournament.location
      },
      connectedUsers: connectedUsersCount,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error emitting tournament state:', error);
  }
}

/**
 * Emit current match state to socket
 */
async function emitMatchState(socket, matchId) {
  try {
    const match = await Match.findById(matchId)
      .populate('tournament', 'name')
      .populate('participants.player', 'firstName lastName beltRank')
      .populate('participants.scores.judge', 'firstName lastName');

    if (!match) {
      socket.emit('error', { message: 'Match not found' });
      return;
    }

    const connectedUsersCount = matchRooms.has(matchId) 
      ? matchRooms.get(matchId).size 
      : 0;

    socket.emit('match_state', {
      match: {
        id: match._id,
        tournament: match.tournament,
        category: match.category,
        round: match.round,
        status: match.status,
        participants: match.participants,
        scheduledAt: match.scheduledAt,
        mat: match.mat
      },
      connectedUsers: connectedUsersCount,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error emitting match state:', error);
  }
}

/**
 * Utility functions for external use
 */

/**
 * Emit live score update to specific match
 */
function emitScoreUpdate(matchId, scoreData) {
  if (!io) return;

  const roomName = `match:${matchId}`;
  io.to(roomName).emit('score_updated', scoreData);
}

/**
 * Emit match status update
 */
function emitMatchStatusUpdate(matchId, statusData) {
  if (!io) return;

  const roomName = `match:${matchId}`;
  io.to(roomName).emit('match_status_updated', statusData);
}

/**
 * Emit tournament update
 */
function emitTournamentUpdate(tournamentId, updateData) {
  if (!io) return;

  const roomName = `tournament:${tournamentId}`;
  io.to(roomName).emit('tournament_updated', updateData);
}

/**
 * Send notification to specific user
 */
function sendUserNotification(userId, notificationData) {
  if (!io) return;

  const roomName = `user:${userId}`;
  io.to(roomName).emit('notification', notificationData);
}

/**
 * Send notification to multiple users
 */
function sendBulkNotification(userIds, notificationData) {
  if (!io) return;

  userIds.forEach(userId => {
    const roomName = `user:${userId}`;
    io.to(roomName).emit('notification', notificationData);
  });
}

/**
 * Get connected users statistics
 */
function getConnectedUsersStats() {
  const stats = {
    totalConnected: connectedUsers.size,
    byRole: {},
    byTournament: {},
    byMatch: {}
  };

  // Count by role
  connectedUsers.forEach(user => {
    stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
  });

  // Count by tournament
  tournamentRooms.forEach((userSet, tournamentId) => {
    stats.byTournament[tournamentId] = userSet.size;
  });

  // Count by match
  matchRooms.forEach((userSet, matchId) => {
    stats.byMatch[matchId] = userSet.size;
  });

  return stats;
}

/**
 * Get connected users for a specific tournament
 */
function getTournamentConnectedUsers(tournamentId) {
  if (!tournamentRooms.has(tournamentId)) {
    return [];
  }

  const userIds = Array.from(tournamentRooms.get(tournamentId));
  return userIds.map(userId => connectedUsers.get(userId)).filter(Boolean);
}

/**
 * Get connected users for a specific match
 */
function getMatchConnectedUsers(matchId) {
  if (!matchRooms.has(matchId)) {
    return [];
  }

  const userIds = Array.from(matchRooms.get(matchId));
  return userIds.map(userId => connectedUsers.get(userId)).filter(Boolean);
}

module.exports = {
  initializeSocket,
  emitScoreUpdate,
  emitMatchStatusUpdate,
  emitTournamentUpdate,
  sendUserNotification,
  sendBulkNotification,
  getConnectedUsersStats,
  getTournamentConnectedUsers,
  getMatchConnectedUsers
};