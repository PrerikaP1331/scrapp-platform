import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Member Management API Service
export const memberService = {
  // Get all members for a community
  getCommunityMembers: async (communityId, status = 'all') => {
    try {
      const response = await api.get(`/community/${communityId}/members`, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get active residents
  getActiveResidents: async (communityId) => {
    try {
      const response = await api.get(`/community/${communityId}/members`, {
        params: { status: 'approved' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get pending requests
  getPendingRequests: async (communityId) => {
    try {
      const response = await api.get(`/community/${communityId}/members`, {
        params: { status: 'pending' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send invitations to residents
  inviteResidents: async (communityId, emails, customMessage = '') => {
    try {
      const response = await api.post(`/community/${communityId}/members/invite`, {
        emails,
        customMessage
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approve a pending member request
  approveMember: async (communityId, userId) => {
    try {
      const response = await api.put(`/community/${communityId}/members/${userId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Deny a pending member request
  denyMember: async (communityId, userId) => {
    try {
      const response = await api.delete(`/community/${communityId}/members/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove a member from the community
  removeMember: async (communityId, userId) => {
    try {
      const response = await api.delete(`/community/${communityId}/members/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get invitation status
  getInvitations: async (communityId) => {
    try {
      const response = await api.get(`/community/${communityId}/invitations`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Resend invitation
  resendInvitation: async (communityId, invitationId) => {
    try {
      const response = await api.post(`/community/${communityId}/invitations/${invitationId}/resend`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default memberService;