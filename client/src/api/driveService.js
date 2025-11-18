import axios from './axios';

export const getCommunityDrives = async (communityId) => {
  try {
    const res = await axios.get(`/communities/${communityId}/drives`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching drives' };
  }
};

export const createDrive = async (payload) => {
  try {
    const body = {
      title: payload.title,
      description: payload.description,
      date: payload.date,
      location: { venue: payload.location, address: {} },
      acceptedWasteTypes: payload.wasteTypes,
      visibility: payload.visibility,
      coverPhoto: payload.coverPhoto || null,
      notes: payload.notes || ''
    };
    const res = await axios.post(`/communities/${payload.communityId}/drives`, body);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error creating drive' };
  }
};

export const updateDrive = async (communityId, driveId, payload) => {
  try {
    const body = {
      title: payload.title,
      description: payload.description,
      date: payload.date,
      location: payload.location ? { venue: typeof payload.location === 'string' ? payload.location : payload.location.venue, address: payload.location?.address || {} } : undefined,
      acceptedWasteTypes: payload.wasteTypes,
      visibility: payload.visibility,
      coverPhoto: payload.coverPhoto || null,
      notes: payload.notes
    };
    const res = await axios.put(`/communities/${communityId}/drives/${driveId}`, body);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error updating drive' };
  }
};

export const deleteDrive = async (communityId, driveId) => {
  try {
    const res = await axios.delete(`/communities/${communityId}/drives/${driveId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error deleting drive' };
  }
};

export const getDriveById = async (communityId, driveId) => {
  try {
    const res = await axios.get(`/communities/${communityId}/drives/${driveId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching drive' };
  }
};

export const getDriveStats = async (communityId, driveId) => {
  try {
    const res = await axios.get(`/communities/${communityId}/drives/${driveId}/stats`);
    const d = res.data || {};
    const wasteBreakdown = (d.itemBreakdown || []).map((x) => ({ category: x.wasteType || x.category, weight: x.quantityKg || x.weight || 0 }));
    const topItems = wasteBreakdown.slice().sort((a, b) => b.weight - a.weight).slice(0, 3).map((x) => ({ name: x.category, count: x.weight }));
    const stats = {
      drive: {
        title: d.title,
        status: d.status || 'ongoing',
        date: d.date,
        location: d.location?.venue || '',
        visibility: d.visibility || 'public'
      },
      participants: {
        total: d.participatingHouseholds || d.participants || 0,
        households: d.participatingHouseholds || 0
      },
      totalWeight: d.totalWeightCollected || d.totalWeight || 0,
      wasteBreakdown,
      topItems,
      participationRate: 0
    };
    return stats;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching drive stats' };
  }
};