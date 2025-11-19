import axios from 'axios';

// For development/testing purposes, we'll use a mock API
const isDevelopment = false; // Set to false when connecting to real backend

const api = axios.create({
  baseURL: isDevelopment ? '' : '/api',
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
  getUsers: () => api.get('/admin/users'),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  createUser: (data: any) => api.post('/admin/users', data),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  
  // Players
  getPlayers: () => api.get('/admin/players'),
  getPlayer: (id: string) => api.get(`/admin/players/${id}`),
  createPlayer: (data: any) => api.post('/admin/players', data),
  updatePlayer: (id: string, data: any) => api.put(`/admin/players/${id}`, data),
  deletePlayer: (id: string) => api.delete(`/admin/players/${id}`),
  
  // Judges
  getJudges: () => api.get('/admin/judges'),
  getJudge: (id: string) => api.get(`/admin/judges/${id}`),
  createJudge: (data: any) => api.post('/admin/judges', data),
  updateJudge: (id: string, data: any) => api.put(`/admin/judges/${id}`, data),
  deleteJudge: (id: string) => api.delete(`/admin/judges/${id}`),
  
  // Coaches
  getCoaches: () => api.get('/admin/coaches'),
  getCoach: (id: string) => api.get(`/admin/coaches/${id}`),
  createCoach: (data: any) => api.post('/admin/coaches', data),
  updateCoach: (id: string, data: any) => api.put(`/admin/coaches/${id}`, data),
  deleteCoach: (id: string) => api.delete(`/admin/coaches/${id}`),
  
  // Tournaments
  getTournaments: () => api.get('/admin/tournaments'),
  getTournament: (id: string) => api.get(`/admin/tournaments/${id}`),
  createTournament: (data: any) => api.post('/admin/tournaments', data),
  updateTournament: (id: string, data: any) => api.put(`/admin/tournaments/${id}`, data),
  deleteTournament: (id: string) => api.delete(`/admin/tournaments/${id}`),
};

// Auth API functions
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (data: any) => 
    api.post('/auth/register', data),
};

// Mock authentication functions for development
if (isDevelopment) {
  // Store the original post method
  const originalPost = api.post;
  
  // Override the post method with mock functionality
  api.post = function (url: string, data?: any, config?: any) {
    if (url.includes('/auth/login')) {
      // Mock login logic
      const { email, password } = data;
      
      // Simulate API delay
      setTimeout(() => {}, 500);
      
      // Mock user data - in a real app, this would come from a database
      const users = [
        {
          id: 1,
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        },
        {
          id: 2,
          email: 'player@example.com',
          password: 'password123',
          role: 'player',
          firstName: 'Test',
          lastName: 'Player'
        }
      ];
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Generate a mock token
        const token = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
        return Promise.resolve({
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName
            }
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config || {}
        } as any);
      } else {
        return Promise.reject({
          response: {
            status: 401,
            data: {
              message: 'Invalid email or password'
            },
            statusText: 'Unauthorized',
            headers: {},
            config: config || {}
          }
        });
      }
    } else if (url.includes('/auth/register')) {
      // Mock registration logic
      const { email, password, firstName, lastName, role } = data;
      
      // Simulate API delay
      setTimeout(() => {}, 500);
      
      // Check if user already exists
      const users = [
        {
          id: 1,
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        },
        {
          id: 2,
          email: 'player@example.com',
          password: 'password123',
          role: 'player',
          firstName: 'Test',
          lastName: 'Player'
        }
      ];
      
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return Promise.reject({
          response: {
            status: 400,
            data: {
              message: 'User with this email already exists'
            },
            statusText: 'Bad Request',
            headers: {},
            config: config || {}
          }
        });
      }
      
      // Create new user
      const newUser = {
        id: users.length + 1,
        email,
        password, // In a real app, this would be hashed
        role: role || 'player',
        firstName,
        lastName
      };
      
      // Generate a mock token
      const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role }));
      
      return Promise.resolve({
        data: {
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            firstName: newUser.firstName,
            lastName: newUser.lastName
          }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {}
      } as any);
    }
    
    // For other endpoints, use the original post method
    return originalPost(url, data, config);
  };
}

export default api;