const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the User model
require('./models/User');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tournament_management')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get the User model
    const User = mongoose.model('User');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'dineth100@gmail.com' });
    if (existingUser) {
      console.log('User already exists:');
      console.log(JSON.stringify(existingUser, null, 2));
      
      // Ask if we should delete the user
      console.log('\nWould you like to delete this user? (yes/no)');
    } else {
      console.log('No existing user found with email: dineth100@gmail.com');
    }
    
    // Close the connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });