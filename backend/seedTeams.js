const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Team = require('./models/Team');
const Category = require('./models/Category');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tournament_management')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing teams
    await Team.deleteMany({});
    console.log('Deleted existing teams');
    
    // Get a coach user
    const coach = await User.findOne({ role: 'coach' });
    if (!coach) {
      console.log('No coach user found');
      process.exit(1);
    }
    
    // Create a category
    const category = new Category({
      name: 'U16 Boys',
      description: 'Under 16 boys category',
      ageGroup: 'U16',
      gender: 'Male'
    });
    
    await category.save();
    console.log('Created category:', category.name);
    
    // Create teams
    const teams = [
      {
        name: 'Team Alpha',
        coach: coach._id,
        category: category._id
      },
      {
        name: 'Team Beta',
        coach: coach._id,
        category: category._id
      },
      {
        name: 'Team Gamma',
        coach: coach._id,
        category: category._id
      }
    ];
    
    for (const teamData of teams) {
      const team = new Team(teamData);
      await team.save();
      console.log('Created team:', team.name);
    }
    
    console.log('Teams created successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });