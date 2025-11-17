import axios from './axios';

export const getCoupons = async (status = 'all') => {
  try {
    const response = await axios.get(`/api/user/coupons?status=${status}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching coupons' };
  }
};

export const copyCouponCode = (code) => {
  navigator.clipboard.writeText(code);
};
