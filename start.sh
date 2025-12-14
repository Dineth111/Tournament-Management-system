#!/bin/bash

# Start script for Tournament Management System

echo "Starting Tournament Management System..."

# Function to clean up background processes on exit
cleanup() {
    echo "Stopping background processes..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend
echo "Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Servers started!"
echo "Backend running on http://localhost:5000"
echo "Frontend running on http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID