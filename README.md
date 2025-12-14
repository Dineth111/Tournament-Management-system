# Tournament Management System

A full-featured MERN stack application for managing sports tournaments with role-based access control.

## Features

- **Authentication & Authorization**
  - Session-based authentication (no JWT)
  - Role-based access control (Admin, Player, Judge, Coach, Organizer)
  - Protected routes for each user role

- **User Roles**
  - **Admin**: Full system access, user management, reports
  - **Player**: View personal stats, team info, tournament participation
  - **Judge**: Manage match scores, view assigned tournaments
  - **Coach**: Manage team, view player stats, training schedules
  - **Organizer**: Create tournaments, manage teams, schedule matches

- **CRUD Operations**
  - Players
  - Judges
  - Coaches
  - Organizers
  - Tournaments
  - Matches
  - Categories
  - Teams
  - Scores
  - Notifications

- **Dashboard Features**
  - Role-specific dashboards with relevant information
  - Profile management for all users
  - Navigation menus tailored to each role
  - Reports and analytics for admins

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: express-session, connect-mongo
- **Validation**: express-validator
- **Security**: bcryptjs, helmet, cors

## Project Structure

```
tournament-management-system/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret_key
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Players
- `GET /api/players` - Get all players (paginated)
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Tournaments
- `GET /api/tournaments` - Get all tournaments (paginated)
- `GET /api/tournaments/:id` - Get tournament by ID
- `POST /api/tournaments` - Create new tournament
- `PUT /api/tournaments/:id` - Update tournament
- `DELETE /api/tournaments/:id` - Delete tournament

### Matches
- `GET /api/matches` - Get all matches (paginated)
- `GET /api/matches/:id` - Get match by ID
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id` - Update match
- `DELETE /api/matches/:id` - Delete match

## Test Accounts

Use these credentials to test the different roles:

- **Admin**: admin@example.com / admin123
- **Player**: player@example.com / player123
- **Judge**: judge@example.com / judge123
- **Coach**: coach@example.com / coach123
- **Organizer**: organizer@example.com / organizer123

## Development

### Running Tests

To run tests, use:
```
npm test
```

### Building for Production

To create a production build:
```
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.