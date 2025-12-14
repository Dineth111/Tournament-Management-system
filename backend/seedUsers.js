const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Test users data
const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Player User',
    email: 'player@example.com',
    password: 'player123',
    role: 'player'
  },
  {
    name: 'Judge User',
    email: 'judge@example.com',
    password: 'judge123',
    role: 'judge'
  },
  {
    name: 'Coach User',
    email: 'coach@example.com',
    password: 'coach123',
    role: 'coach'
  },
  {
    name: 'Organizer User',
    email: 'organizer@example.com',
    password: 'organizer123',
    role: 'organizer'
  }
];

// Connect to MongoDB and seed users
const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tournament_management');
    console.log('Connected to MongoDB');

    // Delete existing users
    await User.deleteMany({});
    console.log('Deleted existing users');

    // Create test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.name} (${user.role})`);
    }

    console.log('Test users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();