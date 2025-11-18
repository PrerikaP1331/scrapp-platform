// client/src/api/customerCommunicationService.js
import axios from './axios';

const API_BASE_URL = '/recyclers';

export const getCustomers = async (recyclerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${recyclerId}/customers`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching customers' };
  }
};

export const getAnnouncements = async (recyclerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${recyclerId}/announcements`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching announcements' };
  }
};

export const sendAnnouncement = async (recyclerId, subject, message) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${recyclerId}/announcements`,
      { subject, message }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error sending announcement' };
  }
};
