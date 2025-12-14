@echo off
REM Setup script for Tournament Management System

echo Setting up Tournament Management System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not installed. Please install npm first.
    exit /b 1
)

REM Setup backend
echo Setting up backend...
cd backend
npm install

REM Check if .env file exists, if not create it
if not exist .env (
    echo Creating .env file...
    echo PORT=5000 > .env
    echo MONGODB_URI=mongodb://localhost:27017/tournament_management >> .env
    echo SESSION_SECRET=tournament_management_secret >> .env
    echo Please update the .env file with your MongoDB connection string and session secret.
)

cd ..

REM Setup frontend
echo Setting up frontend...
cd frontend
npm install
cd ..

echo Setup complete!
echo To start the application:
echo 1. In one terminal, navigate to the backend directory and run: npm start
echo 2. In another terminal, navigate to the frontend directory and run: npm run dev