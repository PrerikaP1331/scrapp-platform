// /client/src/api/communityService.js
import axios from './axios';

const API_BASE = '/api/communities';

/**
 * Search communities
 */
export const searchCommunities = async (query) => {
  try {
    const response = await axios.get(`${API_BASE}/search?q=${query}`);
    console.log('Search response:', response.data);
    return response.data; // Returns { data: [...], msg: '...' }
  } catch (error) {
    throw error.response?.data || { msg: 'Error searching communities' };
  }
};

/**
 * Get user's communities
 */
export const getUserCommunities = async () => {
  try {
    const response = await axios.get(`${API_BASE}/my-communities`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching communities' };
  }
};

/**
 * Request to join a community
 */
export const requestJoinCommunity = async (communityId) => {
  try {
    const response = await axios.post(`${API_BASE}/${communityId}/join`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error joining community' };
  }
};

/**
 * Get community posts
 */
export const getCommunityPosts = async (communityId, params = {}) => {
  try {
    const queryString = new URLSearchParams({
      type: params.type || 'all',
      page: params.page || 1,
      limit: params.limit || 10,
    }).toString();

    const response = await axios.get(`${API_BASE}/${communityId}/posts?${queryString}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching posts' };
  }
};

/**
 * Create a community post
 */
export const createCommunityPost = async (communityId, postData) => {
  try {
    const response = await axios.post(`${API_BASE}/${communityId}/posts`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error creating post' };
  }
};

/**
 * Claim a giveaway item
 */
export const claimItem = async (postId) => {
  try {
    const response = await axios.post(`${API_BASE}/posts/${postId}/claim`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error claiming item' };
  }
};

/**
 * Add comment to a post
 */
export const addComment = async (postId, text) => {
  try {
    const response = await axios.post(`${API_BASE}/posts/${postId}/comment`, { text });
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error adding comment' };
  }
};

/**
 * Like a post
 */
export const likePost = async (postId) => {
  try {
    const response = await axios.post(`${API_BASE}/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error liking post' };
  }
};

/**
 * Get community admin dashboard data
 */
export const getCommunityDashboard = async (communityId) => {
  try {
    const response = await axios.get(`/api/community/${communityId}/dashboard`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching dashboard' };
  }
};

/**
 * Get community members
 */
export const getCommunityMembers = async (communityId) => {
  try {
    const response = await axios.get(`/api/community/${communityId}/members`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching members' };
  }
};

/**
 * Approve member request
 */
export const approveMemberRequest = async (communityId, userId) => {
  try {
    const response = await axios.post(
      `/api/community/${communityId}/members/${userId}/approve`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error approving member' };
  }
};

/**
 * Reject member request
 */
export const rejectMemberRequest = async (communityId, userId) => {
  try {
    const response = await axios.post(
      `/api/community/${communityId}/members/${userId}/reject`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error rejecting member' };
  }
};

/**
 * Invite resident by email
 */
export const inviteResident = async (communityId, email, message = '') => {
  try {
    const response = await axios.post(
      `/api/community/${communityId}/invite`,
      { email, message }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error sending invitation' };
  }
};

/**
 * Schedule community pickup
 */
export const schedulePickup = async (communityId, pickupData) => {
  try {
    const response = await axios.post(
      `/api/community/${communityId}/pickups`,
      pickupData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error scheduling pickup' };
  }
};

/**
 * Get upcoming pickups
 */
export const getUpcomingPickups = async (communityId) => {
  try {
    const response = await axios.get(`/api/community/${communityId}/pickups`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching pickups' };
  }
};
