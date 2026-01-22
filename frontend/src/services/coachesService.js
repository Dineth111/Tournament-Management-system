// Coaches service for communicating with the backend API

const API_BASE_URL = 'http://localhost:5000/api';

class CoachesService {
  // Get all coaches with pagination and filters
  async getCoaches(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await fetch(`${API_BASE_URL}/coaches?${queryParams}`, {
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

  // Get coach by ID
  async getCoachById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/coaches/${id}`, {
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

  // Create a new coach
  async createCoach(coachData) {
    try {
      const response = await fetch(`${API_BASE_URL}/coaches`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coachData),
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update coach
  async updateCoach(id, coachData) {
    try {
      const response = await fetch(`${API_BASE_URL}/coaches/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coachData),
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete coach
  async deleteCoach(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/coaches/${id}`, {
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

  // Toggle coach status
  async toggleCoachStatus(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/coaches/${id}/status`, {
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

export default new CoachesService();