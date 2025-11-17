import axios from "./axios";

const API_URL = "/initiatives";

// Get all initiatives
export const getInitiatives = async (orgId) => {
  try {
    let url = "/initiatives";
    if (orgId) {
      url += `?orgId=${orgId}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching initiatives:", error);
    throw error;
  }
};

// Get initiative by ID
export const getInitiativeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching initiative:", error);
    throw error;
  }
};

// Create new initiative
export const createInitiative = async (initiativeData) => {
  try {
    const response = await axios.post(API_URL, initiativeData);
    return response.data;
  } catch (error) {
    console.error("Error creating initiative:", error);
    throw error;
  }
};

// Update initiative
export const updateInitiative = async (id, initiativeData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, initiativeData);
    return response.data;
  } catch (error) {
    console.error("Error updating initiative:", error);
    throw error;
  }
};

// Delete initiative
export const deleteInitiative = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting initiative:", error);
    throw error;
  }
};

// Update initiative status
export const updateInitiativeStatus = async (
  id,
  status,
  reportDetails = null
) => {
  try {
    const updateData = { status };
    if (reportDetails && status === "completed") {
      updateData.reportDetails = reportDetails;
    }
    const response = await axios.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating initiative status:", error);
    throw error;
  }
};

// Update initiative participants
export const updateInitiativeParticipants = async (id, actualParticipants) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      actualParticipants,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating initiative participants:", error);
    throw error;
  }
};
