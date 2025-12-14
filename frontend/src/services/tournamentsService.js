// Tournaments service for communicating with the backend API

const API_BASE_URL = 'http://localhost:5000/api';

class TournamentsService {
  // Get all tournaments with pagination and filters
  async getTournaments(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await fetch(`${API_BASE_URL}/tournaments?${queryParams}`, {
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

  // Get tournament by ID
  async getTournamentById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
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

  // Create a new tournament
  async createTournament(tournamentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournamentData),
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update tournament
  async updateTournament(id, tournamentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournamentData),
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete tournament
  async deleteTournament(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
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

  // Toggle tournament status
  async toggleTournamentStatus(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${id}/status`, {
        method: 'PUT',
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

export default new TournamentsService();