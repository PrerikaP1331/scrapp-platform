// client/src/api/publicProfileService.js
import axios from './axios';

const API_BASE_URL = '/api/recyclers';

export const getProfile = async (recyclerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${recyclerId}/profile/edit`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (recyclerId, profileData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${recyclerId}/profile/edit`,
      profileData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // This would typically go to a separate file upload endpoint
    // For now, we'll return a base64 string for demo purposes
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (error) {
    throw error;
  }
};
