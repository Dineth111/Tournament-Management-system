// apiClient.ts
import api from './api'; // Import the existing authenticated API client

// Third-party API configuration
const THIRD_PARTY_API_BASE_URL = 'https://generativelanguage.googleapis.com'; // Google AI API base URL

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
    ...options.headers,
  };
  
  const config: RequestInit = {
    ...options,
    headers: defaultHeaders,
  };
  
  try {
    // For Google AI API, the API key is passed as a query parameter
    const url = `${THIRD_PARTY_API_BASE_URL}${endpoint}?key=${apiKey}`;
    const response = await fetch(url, config);
    
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

// Example function for a chatbot API using Google AI
export const sendChatMessage = async (message: string): Promise<any> => {
  try {
    const apiKey = getApiKey();
    
    // Using Google's Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`AI API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the response text from Google's API format
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    
    return {
      reply,
      message: reply
    };
  } catch (error) {
    console.error('Failed to send chat message:', error);
    throw error;
  }
};

// Example function for a maps API
export const getMapData = async (location: string): Promise<any> => {
  try {
    // For maps, we would typically use Google Maps API
    // This is a placeholder implementation
    console.log(`Map data requested for location: ${location}`);
    
    // Return mock data for now
    return {
      location,
      coordinates: { lat: 0, lng: 0 },
      formatted_address: `Mock address for ${location}`
    };
  } catch (error) {
    console.error('Failed to fetch map data:', error);
    throw error;
  }
};

// Export the existing API client as default
export default api;