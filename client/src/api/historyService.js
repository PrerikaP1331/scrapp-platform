// /client/src/api/historyService.js
import axios from './axios';

const API_BASE = '/api/user';

/**
 * Get user's transaction history
 * @param {Object} params - Query parameters
 * @param {string} params.type - 'all', 'pickups', 'coupons'
 * @param {string} params.status - 'all', 'upcoming', 'completed', 'cancelled'
 * @param {string} params.search - Search term
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 */
export const getUserHistory = async (params = {}) => {
  try {
    const queryString = new URLSearchParams({
      type: params.type || 'all',
      status: params.status || 'all',
      search: params.search || '',
      page: params.page || 1,
      limit: params.limit || 10,
    }).toString();

    const response = await axios.get(`${API_BASE}/history?${queryString}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching history' };
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE}/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching profile' };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_BASE}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error updating profile' };
  }
};
