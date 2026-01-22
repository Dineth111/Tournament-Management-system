// Authentication service for communicating with the backend API

const API_BASE_URL = 'http://localhost:5001/api'; // Changed from 5000 to 5001

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Register response:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, data: { message: 'Network error during registration' } };
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('Login response:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, data: { message: 'Network error during login' } };
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();
      console.log('Logout response:', data);
      return { success: response.ok, data };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, data: { message: 'Network error during logout' } };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });

      const data = await response.json();
      console.log('getCurrentUser response:', data); // Debug log
      
      // Check if we have valid user data
      if (response.ok && data.success && data.data && data.data.user) {
        return { success: true, data: data.data };
      } else if (response.ok && data.success && !data.data) {
        // Valid response but no user data means not authenticated
        return { success: false, data: { message: 'Not authenticated' } };
      } else {
        // Some error occurred
        return { success: false, data: data };
      }
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return { success: false, data: { message: 'Network error while fetching user data' } };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    // This would typically check for a token or session
    // For now, we'll rely on the backend to determine this
    return true;
  }
}

export default new AuthService();