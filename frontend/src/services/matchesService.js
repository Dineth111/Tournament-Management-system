// Matches service for communicating with the backend API

const API_BASE_URL = 'http://localhost:5000/api';

class MatchesService {
  // Get all matches with pagination and filters
  async getMatches(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await fetch(`${API_BASE_URL}/matches?${queryParams}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get match by ID
  async getMatchById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create a new match
  async createMatch(matchData) {
    try {
      const response = await fetch(`${API_BASE_URL}/matches`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update match
  async updateMatch(id, matchData) {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete match
  async deleteMatch(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new MatchesService();