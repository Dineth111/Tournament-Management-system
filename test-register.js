const mongoose = require('mongoose');
const User = require('./backend/models/User');

// MongoDB connection
mongoose.connect('mongodb+srv://himansidulanjana635_db_user:ULoPHy3FVNQByQ1K@cluster0.u5zbusp.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test registration
async function testRegistration() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'dineth100@gmail.com' });
    if (existingUser) {
      console.log('User already exists:', existingUser);
      // Optionally delete the existing user
      // await User.deleteOne({ email: 'dineth100@gmail.com' });
      // console.log('Existing user deleted');
    } else {
      console.log('No existing user found with this email');
    }

    // Create new user
    const newUser = new User({
      name: 'Dineth sanjula',
      email: 'dineth100@gmail.com',
      password: 'password123',
      role: 'organizer'
    });

    const savedUser = await newUser.save();
    console.log('User created successfully:', savedUser);
  } catch (error) {
    console.error('Error during registration:', error);
  } finally {
    mongoose.connection.close();
  }
}

testRegistration();