// /client/src/api/pickupService.js
import axios from './axios';

const API_BASE = '/api/pickups';

/**
 * Create a new pickup request
 */
export const createPickup = async (pickupData) => {
  try {
    const response = await axios.post(`${API_BASE}`, pickupData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error creating pickup' };
  }
};

/**
 * Get all pickups for the logged-in user
 */
export const getMyPickups = async () => {
  try {
    const response = await axios.get(`${API_BASE}/my-pickups`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching pickups' };
  }
};

/**
 * Get available time slots for a specific date
 */
export const getTimeSlots = async (scheduledDate) => {
  try {
    const response = await axios.post(`${API_BASE}/time-slots`, {
      scheduledDate
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching time slots' };
  }
};

/**
 * Get available recyclers based on criteria
 */
export const getAvailableRecyclers = async (criteria) => {
  try {
    const response = await axios.post(`${API_BASE}/available-recyclers`, criteria);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching available recyclers' };
  }
};

/**
 * Assign a recycler to a pickup
 */
export const assignRecycler = async (pickupId, recyclerId) => {
  try {
    const response = await axios.post(`${API_BASE}/assign-recycler`, {
      pickupId,
      recyclerId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error assigning recycler' };
  }
};

/**
 * Get details of a specific pickup
 */
export const getPickupDetails = async (pickupId) => {
  try {
    const response = await axios.get(`${API_BASE}/${pickupId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching pickup details' };
  }
};

/**
 * Rate a completed pickup
 */
export const ratePickup = async (pickupId, score, review) => {
  try {
    const response = await axios.post(`${API_BASE}/${pickupId}/rate`, {
      pickupId,
      score,
      review
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error rating pickup' };
  }
};
