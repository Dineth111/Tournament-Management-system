import axios from 'axios';

// For development/testing purposes, we'll use the JSON server
const isDevelopment = true; // Set to false when connecting to real backend

const api = axios.create({
  baseURL: isDevelopment ? 'http://localhost:3002' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API functions
export const adminApi = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Users
  getUsers: () => api.get('/users'),
  getUser: (id: string) => api.get(`/users/${id}`),
  createUser: (data: any) => api.post('/users', data),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  
  // Players
  getPlayers: () => api.get('/players'),
  getPlayer: (id: string) => api.get(`/players/${id}`),
  createPlayer: (data: any) => api.post('/players', data),
  updatePlayer: (id: string, data: any) => api.put(`/players/${id}`, data),
  deletePlayer: (id: string) => api.delete(`/players/${id}`),
  
  // Judges
  getJudges: () => api.get('/judges'),
  getJudge: (id: string) => api.get(`/judges/${id}`),
  createJudge: (data: any) => api.post('/judges', data),
  updateJudge: (id: string, data: any) => api.put(`/judges/${id}`, data),
  deleteJudge: (id: string) => api.delete(`/judges/${id}`),
  
  // Coaches
  getCoaches: () => api.get('/coaches'),
  getCoach: (id: string) => api.get(`/coaches/${id}`),
  createCoach: (data: any) => api.post('/coaches', data),
  updateCoach: (id: string, data: any) => api.put(`/coaches/${id}`, data),
  deleteCoach: (id: string) => api.delete(`/coaches/${id}`),
  
  // Tournaments
  getTournaments: () => api.get('/tournaments'),
  getTournament: (id: string) => api.get(`/tournaments/${id}`),
  createTournament: (data: any) => api.post('/tournaments', data),
  updateTournament: (id: string, data: any) => api.put(`/tournaments/${id}`, data),
  deleteTournament: (id: string) => api.delete(`/tournaments/${id}`),
  
  // Matches
  getMatches: () => api.get('/matches'),
  getMatch: (id: string) => api.get(`/matches/${id}`),
  createMatch: (data: any) => api.post('/matches', data),
  updateMatch: (id: string, data: any) => api.put(`/matches/${id}`, data),
  deleteMatch: (id: string) => api.delete(`/matches/${id}`),
};

// Auth API functions
export const authApi = {
  login: async (email: string, password: string, role: string) => {
    try {
      // In development, we'll mock the login by checking the users in the database
      if (isDevelopment) {
        const response = await api.get('/users');
        const users = response.data;
        const user = users.find((u: any) => u.email === email && u.password === password && u.role === role);
        
        if (user) {
          // Generate a mock token
          const token = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
          
          return {
            data: {
              token,
              user: {
                id: user.id,
                _id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
              }
            }
          };
        } else {
          throw new Error('Invalid email, password, or role');
        }
      } else {
        // In production, make the actual API call
        return await api.post('/auth/login', { email, password, role });
      }
    } catch (error) {
      throw error;
    }
  },
  register: async (data: any) => {
    try {
      // In development, we'll mock the registration by adding the user to the database
      if (isDevelopment) {
        const { email, password, firstName, lastName, role } = data;
        
        // Check if user already exists
        const response = await api.get('/users');
        const users = response.data;
        const existingUser = users.find((u: any) => u.email === email);
        
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        // Create new user
        const newUserResponse = await api.post('/users', {
          email,
          password,
          role: role || 'player',
          firstName,
          lastName
        });
        
        const newUser = newUserResponse.data;
        
        // Generate a mock token
        const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role }));
        
        return {
          data: {
            token,
            user: {
              id: newUser.id,
              _id: newUser._id,
              email: newUser.email,
              role: newUser.role,
              firstName: newUser.firstName,
              lastName: newUser.lastName
            }
          }
        };
      } else {
        // In production, make the actual API call
        return await api.post('/auth/register', data);
      }
    } catch (error) {
      throw error;
    }
  }
};

export default api;