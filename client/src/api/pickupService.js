import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};

/**
 * Create a community pickup
 * @param {Object} pickupData - Pickup data
 * @returns {Promise} Axios response
 */
export const createCommunityPickup = async (pickupData) => {
  try {
    const response = await axios.post(
      `${API_URL}/pickups`,
      {
        ...pickupData,
        pickupType: 'community_bulk'
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error creating community pickup' };
  }
};

/**
 * Get available recyclers based on criteria
 * @param {Object} params - Filter parameters
 * @returns {Promise} Axios response
 */
export const getRecyclers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(
      `${API_URL}/recyclers/search${queryString ? `?${queryString}` : ''}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching recyclers' };
  }
};

/**
 * Get community pickups
 * @param {String} communityId - Community ID
 * @returns {Promise} Axios response
 */
export const getCommunityPickups = async (communityId) => {
  try {
    const response = await axios.get(
      `${API_URL}/pickups/community/${communityId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching community pickups' };
  }
};

export const getAvailableRecyclers = async (params = {}) => {
  return getRecyclers(params);
};

export const createPickup = async (pickupData) => {
  try {
    const response = await axios.post(
      `${API_URL}/pickups`,
      pickupData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error creating pickup' };
  }
};

export const assignRecycler = async (pickupId, recyclerId) => {
  try {
    const response = await axios.put(
      `${API_URL}/pickups/${pickupId}/assign`,
      { recyclerId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error assigning recycler' };
  }
};

export const getTimeSlots = async (date) => {
  try {
    const iso = typeof date === 'string' ? date : new Date(date).toISOString();
    const response = await axios.get(
      `${API_URL}/pickups/timeslots?date=${encodeURIComponent(iso)}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    return { timeSlots: ['09:00-10:00', '10:00-11:00', '14:00-15:00'] };
  }
};

/**
 * Update pickup status
 * @param {String} pickupId - Pickup ID
 * @param {String} status - New status
 * @returns {Promise} Axios response
 */
export const updatePickupStatus = async (pickupId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/pickups/${pickupId}/status`,
      { status },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error updating pickup status' };
  }
};

/**
 * Cancel a pickup
 * @param {String} pickupId - Pickup ID
 * @returns {Promise} Axios response
 */
export const cancelPickup = async (pickupId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/pickups/${pickupId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error canceling pickup' };
  }
};
