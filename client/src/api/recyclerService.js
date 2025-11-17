// /client/src/api/recyclerService.js
import axios from './axios';

const API_BASE = '/recycler';

/**
 * Get recycler dashboard summary
 */
export const getRecyclerDashboard = async () => {
  try {
    const response = await axios.get(`${API_BASE}/dashboard`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching dashboard' };
  }
};

/**
 * Accept a pickup request
 */
export const acceptPickup = async (pickupId) => {
  try {
    const response = await axios.post(`${API_BASE}/pickup/${pickupId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error accepting pickup' };
  }
};

/**
 * Decline a pickup request
 */
export const declinePickup = async (pickupId) => {
  try {
    const response = await axios.post(`${API_BASE}/pickup/${pickupId}/decline`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error declining pickup' };
  }
};

/**
 * Get today's optimized route with all accepted pickups
 */
export const getRouteToday = async () => {
  try {
    const response = await axios.get(`${API_BASE}/route/today`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching today route' };
  }
};

/**
 * Update pickup status (scheduled, upcoming, in-transit, completed)
 */
export const updatePickupStatus = async (pickupId, status) => {
  try {
    const response = await axios.put(`${API_BASE}/pickup/${pickupId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error updating pickup status' };
  }
};

/**
 * Get filtered pickups with search, status, and date range
 * @param {string} status - Filter by status (all, pending, upcoming, in-transit, completed, cancelled)
 * @param {string} startDate - Start date for filtering (YYYY-MM-DD)
 * @param {string} endDate - End date for filtering (YYYY-MM-DD)
 * @param {string} search - Search query for customer name, address, city, postal code
 * @param {string} sortBy - Field to sort by (default: scheduledDate)
 * @param {string} order - Sort order (asc or desc, default: asc)
 */
export const getPickupsFiltered = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.order) queryParams.append('order', filters.order);

    const response = await axios.get(`${API_BASE}/pickups?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching filtered pickups' };
  }
};
