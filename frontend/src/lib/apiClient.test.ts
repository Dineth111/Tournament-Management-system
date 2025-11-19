// apiClient.test.ts
// This file demonstrates how to use the API client with API key integration

import api, { thirdPartyApiRequest, sendChatMessage, getMapData } from './apiClient';

// Example 1: Using the existing authenticated API for backend requests
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Example 2: Using the third-party API client with API key authentication
export const testThirdPartyApi = async () => {
  try {
    // This will automatically include the API key from environment variables
    const response = await thirdPartyApiRequest('/test-endpoint', {
      method: 'GET'
    });
    return await response.json();
  } catch (error) {
    console.error('Error testing third-party API:', error);
    throw error;
  }
};

// Example 3: Using specific service functions
export const testChatService = async (message: string) => {
  try {
    const response = await sendChatMessage(message);
    return response;
  } catch (error) {
    console.error('Error with chat service:', error);
    throw error;
  }
};

// Example 4: Using map service
export const testMapService = async (location: string) => {
  try {
    const response = await getMapData(location);
    return response;
  } catch (error) {
    console.error('Error with map service:', error);
    throw error;
  }
};

// Export all functions for use in components
export default {
  fetchUserProfile,
  testThirdPartyApi,
  testChatService,
  testMapService
};