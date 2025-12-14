#!/bin/bash

# Setup script for Tournament Management System

echo "Setting up Tournament Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

# Setup backend
echo "Setting up backend..."
cd backend
npm install

# Check if .env file exists, if not create it
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "PORT=5000" > .env
    echo "MONGODB_URI=mongodb://localhost:27017/tournament_management" >> .env
    echo "SESSION_SECRET=tournament_management_secret" >> .env
    echo "Please update the .env file with your MongoDB connection string and session secret."
fi

cd ..

# Setup frontend
echo "Setting up frontend..."
cd frontend
npm install
cd ..

echo "Setup complete!"
echo "To start the application:"
echo "1. In one terminal, navigate to the backend directory and run: npm start"
echo "2. In another terminal, navigate to the frontend directory and run: npm run dev"