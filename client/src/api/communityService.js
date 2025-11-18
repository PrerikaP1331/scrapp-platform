// /client/src/api/communityService.js
import axios from './axios';

const API_BASE = '/communities';

/**
 * Search communities
 */
export const searchCommunities = async (query) => {
  try {
    const response = await axios.get(`${API_BASE}/search?q=${query}`);
    console.log('Search response:', response.data);
    return response.data; // Returns { data: [...], msg: '...' }
  } catch (error) {
    throw error.response?.data || { msg: 'Error searching communities' };
  }
};

/**
 * Get user's communities
 */
export const getUserCommunities = async () => {
  try {
    const response = await axios.get(`${API_BASE}/my-communities`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching communities' };
  }
};

export const getAdminCommunity = async () => {
  try {
    const response = await axios.get(`${API_BASE}/my-admin`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching admin community' };
  }
};

/**
 * Request to join a community
 */
export const requestJoinCommunity = async (communityId) => {
  try {
    const response = await axios.post(`${API_BASE}/${communityId}/join`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error joining community' };
  }
};

/**
 * Get community posts
 */
export const getCommunityPosts = async (communityId, params = {}) => {
  try {
    const queryString = new URLSearchParams({
      type: params.type || 'all',
      page: params.page || 1,
      limit: params.limit || 10,
    }).toString();

    const response = await axios.get(`${API_BASE}/${communityId}/posts?${queryString}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching posts' };
  }
};

/**
 * Create a community post
 */
export const createCommunityPost = async (communityId, postData) => {
  try {
    const response = await axios.post(`${API_BASE}/${communityId}/posts`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error creating post' };
  }
};

/**
 * Claim a giveaway item
 */
export const claimItem = async (postId) => {
  try {
    const response = await axios.post(`${API_BASE}/posts/${postId}/claim`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error claiming item' };
  }
};

/**
 * Add comment to a post
 */
export const addComment = async (postId, text) => {
  try {
    const response = await axios.post(`${API_BASE}/posts/${postId}/comment`, { text });
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error adding comment' };
  }
};

/**
 * Like a post
 */
export const likePost = async (postId) => {
  try {
    const response = await axios.post(`${API_BASE}/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error liking post' };
  }
};

/**
 * Get community admin dashboard data
 */
export const getCommunityDashboard = async (communityId) => {
  try {
    const response = await axios.get(`${API_BASE}/${communityId}/dashboard`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching dashboard' };
  }
};

/**
 * Get community impact report within date range
 */
export const getCommunityImpactReport = async (communityId, { startDate, endDate }) => {
  try {
    const dashboardRes = await axios.get(`${API_BASE}/${communityId}/dashboard`);
    const dashboard = dashboardRes.data || {};

    let drivesHosted = 0;
    try {
      const drivesRes = await axios.get(`${API_BASE}/${communityId}/drives`);
      const drivesData = drivesRes.data;
      drivesHosted = Array.isArray(drivesData)
        ? drivesData.length
        : (drivesData?.drives?.length || 0);
    } catch (_) {}

    const lifetimeImpact = {
      totalCO2SavedKg: dashboard?.impactStats?.co2Saved || 0,
      totalWasteDivertedKg: dashboard?.impactStats?.wasteDiverted || 0,
      totalPickupsCompleted: dashboard?.impactStats?.pickupsCompleted || 0,
      totalDrivesHosted: drivesHosted
    };

    const engagement = {
      participationRate: dashboard?.engagementStats?.participationRate ?? null,
      mostSuccessfulDrive: null
    };

    return {
      lifetimeImpact,
      engagement,
      wasteByMaterial: [],
      volumeOverTime: []
    };
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching community report' };
  }
};

export const getCommunityBilling = async (communityId) => {
  try {
    let community = null;
    try {
      const res = await axios.get(`${API_BASE}/my-admin`);
      community = res.data || null;
    } catch (_) {}

    const now = new Date();
    const next = new Date(now);
    next.setMonth(now.getMonth() + 1);
    return {
      plan: 'Community Pro',
      price: 2499,
      currency: 'INR',
      status: 'Active',
      nextBillingDate: next.toISOString(),
      paymentMethod: {
        brand: 'Visa',
        last4: '4242',
        expMonth: 12,
        expYear: new Date().getFullYear() + 1
      },
      communityId: community?._id || community?.id || communityId,
      communityName: community?.name || ''
    };
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching billing' };
  }
};

export const getCommunityInvoices = async (communityId) => {
  try {
    const now = new Date();
    const invoices = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now);
      d.setMonth(now.getMonth() - i);
      return {
        id: `INV-${String(1 + i).padStart(3, '0')}`,
        date: d.toISOString(),
        amount: 2499,
        currency: 'INR',
        status: 'Paid'
      };
    });
    return invoices;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching invoices' };
  }
};

export const getCommunityDetails = async (communityId) => {
  try {
    const response = await axios.get(`${API_BASE}/${communityId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching community details' };
  }
};

export const updateCommunityDetails = async (communityId, payload) => {
  try {
    const response = await axios.put(`${API_BASE}/${communityId}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error updating community details' };
  }
};

/**
 * Get community members
 */
export const getCommunityMembers = async (communityId) => {
  try {
    const response = await axios.get(`${API_BASE}/${communityId}/members`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching members' };
  }
};

/**
 * Approve member request
 */
export const approveMemberRequest = async (communityId, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE}/${communityId}/members/${userId}/approve`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error approving member' };
  }
};

/**
 * Reject member request
 */
export const rejectMemberRequest = async (communityId, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE}/${communityId}/members/${userId}/reject`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error rejecting member' };
  }
};

/**
 * Invite resident by email
 */
export const inviteResident = async (communityId, email, message = '') => {
  try {
    const response = await axios.post(
      `${API_BASE}/${communityId}/invite`,
      { email, message }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error sending invitation' };
  }
};

/**
 * Schedule community pickup
 */
export const schedulePickup = async (communityId, pickupData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/${communityId}/schedule-pickup`,
      pickupData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error scheduling pickup' };
  }
};

/**
 * Get upcoming pickups
 */
export const getUpcomingPickups = async (communityId) => {
  try {
    const response = await axios.get(`${API_BASE}/${communityId}/pickups`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Error fetching pickups' };
  }
};
