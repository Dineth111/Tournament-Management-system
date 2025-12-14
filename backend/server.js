const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Load environment variables
dotenv.config();

// Import all models to register them with Mongoose
require('./models/User');
require('./models/Player');
require('./models/Team');
require('./models/Category');
require('./models/Tournament');
require('./models/Match');
require('./models/Score');
require('./models/Notification');
require('./models/Judge');
require('./models/Coach');
require('./models/Organizer');

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with safe fallback
let sessionStore;
try {
  sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tournament_management',
  });
  console.log('Session store initialized: MongoStore');
} catch (e) {
  console.error('MongoStore initialization failed, falling back to MemoryStore:', e?.message || e);
  sessionStore = new session.MemoryStore();
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'tournament_management_secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Add logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Session:', req.session);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/tournaments', require('./routes/tournamentRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/judges', require('./routes/judgeRoutes'));
app.use('/api/coaches', require('./routes/coachRoutes'));
app.use('/api/organizers', require('./routes/organizerRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Tournament Management System API' });
});

// Start server immediately; attempt DB connect in background
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tournament_management')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err?.message || err);
  });

module.exports = app;