// apiClient.ts
import api from './api'; // Import the existing authenticated API client

// Third-party API configuration
const THIRD_PARTY_API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key is missing. Please check your .env file.');
  }
  
  return apiKey;
};

// Generic fetch function with API key authentication for third-party services
export const thirdPartyApiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const apiKey = getApiKey();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    ...options.headers,
  };
  
  const config: RequestInit = {
    ...options,
    headers: defaultHeaders,
  };
  
  try {
    const response = await fetch(`${THIRD_PARTY_API_BASE_URL}${endpoint}`, config);
    
    // Handle common HTTP errors
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Example function for a chatbot API
export const sendChatMessage = async (message: string): Promise<any> => {
  try {
    const response = await thirdPartyApiRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to send chat message:', error);
    throw error;
  }
};

// Example function for a maps API
export const getMapData = async (location: string): Promise<any> => {
  try {
    const response = await thirdPartyApiRequest(`/maps?location=${encodeURIComponent(location)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch map data:', error);
    throw error;
  }
};

// Export the existing API client as default
export default api;