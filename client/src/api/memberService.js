import axios from './axios';

export const memberService = {
  getCommunityMembers: async (communityId) => {
    try {
      const res = await axios.get(`/communities/${communityId}/members`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { msg: 'Error fetching members' };
    }
  },

  getActiveResidents: async (communityId) => {
    try {
      const res = await axios.get(`/communities/${communityId}/members`);
      const data = res.data || {};
      const members = (data.approvedMembers || []).map((m) => ({
        id: m._id || m.id,
        name: m.name,
        email: m.email,
        dateJoined: new Date().toISOString()
      }));
      return members;
    } catch (error) {
      throw error.response?.data || { msg: 'Error fetching active residents' };
    }
  },

  getPendingRequests: async (communityId) => {
    try {
      const res = await axios.get(`/communities/${communityId}/members`);
      const data = res.data || {};
      const pending = (data.pendingRequests || []).map((r) => ({
        id: r.user?._id || r.user?.id,
        name: r.user?.name || 'Pending Member',
        email: r.user?.email || '',
        dateRequested: r.requestedAt || new Date().toISOString()
      }));
      return pending;
    } catch (error) {
      throw error.response?.data || { msg: 'Error fetching pending requests' };
    }
  },

  inviteResidents: async (communityId, emails, customMessage = '') => {
    try {
      const results = [];
      for (const email of emails) {
        const res = await axios.post(`/communities/${communityId}/invite`, { email, message: customMessage });
        results.push(res.data);
      }
      return results;
    } catch (error) {
      throw error.response?.data || { msg: 'Error sending invitations' };
    }
  },

  approveMember: async (communityId, userId) => {
    try {
      const res = await axios.post(`/communities/${communityId}/members/${userId}/approve`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { msg: 'Error approving member' };
    }
  },

  denyMember: async (communityId, userId) => {
    try {
      const res = await axios.post(`/communities/${communityId}/members/${userId}/reject`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { msg: 'Error rejecting member' };
    }
  },

  removeMember: async (communityId, userId) => {
    try {
      const res = await axios.post(`/communities/${communityId}/members/${userId}/reject`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { msg: 'Error removing member' };
    }
  },

  getInvitations: async (communityId) => {
    try {
      return [];
    } catch (error) {
      return [];
    }
  },

  resendInvitation: async (communityId, invitationId) => {
    try {
      return { msg: 'Invitation resent' };
    } catch (error) {
      throw error.response?.data || { msg: 'Error resending invitation' };
    }
  }
};

export default memberService;