import axios from 'axios';
import type { ChatReply } from '../types/chat';

const API_BASE = '/api/chatbot';

export const sendMessage = async (message: string): Promise<ChatReply> => {
  try {
    const res = await axios.post(`${API_BASE}/message`, { message }, { withCredentials: true });
    return res.data as ChatReply;
  } catch (err: any) {
    // Handle API key errors specifically
    if (err?.response?.data?.apiKeyError) {
      return { 
        success: false, 
        message: err.response.data.message || 'API key configuration error. Please contact the administrator.' 
      };
    }
    return { success: false, message: err?.response?.data?.message || err?.message || 'Failed to send message' };
  }
};

export const getHistory = async (page = 1, limit = 20) => {
  const res = await axios.get(`${API_BASE}/history`, { params: { page, limit }, withCredentials: true });
  return res.data;
};