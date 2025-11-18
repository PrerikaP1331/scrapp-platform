import axios from './axios';

export const getCommunityDrives = async (communityId) => {
  try {
    const res = await axios.get(`/api/communities/${communityId}/drives`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching drives' };
  }
};

export const createDrive = async (payload) => {
  try {
    const res = await axios.post(`/api/communities/${payload.communityId}/drives`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error creating drive' };
  }
};

export const updateDrive = async (communityId, driveId, payload) => {
  try {
    const res = await axios.put(`/api/communities/${communityId}/drives/${driveId}`, payload);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error updating drive' };
  }
};

export const deleteDrive = async (communityId, driveId) => {
  try {
    const res = await axios.delete(`/api/communities/${communityId}/drives/${driveId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error deleting drive' };
  }
};

export const getDriveById = async (communityId, driveId) => {
  try {
    const res = await axios.get(`/api/communities/${communityId}/drives/${driveId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching drive' };
  }
};

export const getDriveStats = async (communityId, driveId) => {
  try {
    const res = await axios.get(`/api/communities/${communityId}/drives/${driveId}/stats`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching drive stats' };
  }
};