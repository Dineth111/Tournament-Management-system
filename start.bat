@echo off
REM Start script for Tournament Management System

echo Starting Tournament Management System...

REM Start backend server
echo Starting backend server...
cd backend
start "Backend Server" cmd /k "npm start"
cd ..

REM Start frontend server
echo Starting frontend server...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo Servers started!
echo Backend running on http://localhost:5000
echo Frontend running on http://localhost:3000
echo Close the terminal windows to stop the servers