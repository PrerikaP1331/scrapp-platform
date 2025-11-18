import axios from './axios';

export const getMe = async () => {
  try {
    const res = await axios.get('/auth/me');
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching user profile' };
  }
};

export const updateProfileName = async (name) => {
  try {
    const res = await axios.put('/user/profile', { phone: '', address: {}, name });
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error updating profile' };
  }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const res = await axios.put('/user/password', { currentPassword, newPassword, confirmPassword: newPassword });
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error updating password' };
  }
};