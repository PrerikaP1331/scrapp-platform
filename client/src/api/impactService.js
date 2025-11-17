// /client/src/api/impactService.js
import axios from './axios';

const API_BASE = '/api/impact';

/**
 * Get user's impact statistics
 */
export const getUserImpactStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching impact stats' };
  }
};

/**
 * Get user's monthly impact statistics
 */
export const getMonthlyImpactStats = async (year, month) => {
  try {
    const response = await axios.get(`${API_BASE}/stats/monthly?year=${year}&month=${month}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching monthly stats' };
  }
};
