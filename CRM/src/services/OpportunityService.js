import apiClient from './apiClient';

const API_URL = '/opportunities';

export const OpportunityStage = {
  NEW: "NEW",
  QUALIFICATION: "QUALIFICATION",
  PROPOSAL: "PROPOSAL",
  NEGOTIATION: "NEGOTIATION",
  CLOSED_WON: "CLOSED_WON",
  CLOSED_LOST: "CLOSED_LOST"
};

const OpportunityService = {

  getAllOpportunities: async () => {
    try {
      const response = await apiClient.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      return [];
    }
  },

  getOpportunityById: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching opportunity with ID ${id}:`, error);
      return null;
    }
  },

  updateOpportunity: async (id, opportunity) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}`, opportunity);
      return response.data;
    } catch (error) {
      console.error(`Error updating opportunity with ID ${id}:`, error);
      return null;
    }
  },

  deleteOpportunity: async (id) => {
    try {
      await apiClient.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting opportunity with ID ${id}:`, error);
    }
  },

  createOpportunity: async (opportunity) => {
    try {
      const response = await apiClient.post(`${API_URL}`, opportunity);
      return response.data;
    } catch (error) {
      console.error('Error creating opportunity:', error);
      return null;
    }
  },

  getRecycleBinOpportunities: async () => {
    try {
      const response = await apiClient.get(`${API_URL}/recycle-bin`);
      return response.data;
    } catch (error) {
      console.error('Error fetching opportunities from recycle bin:', error);
      return [];
    }
  },

  restoreOpportunity: async (id) => {
    try {
      await apiClient.put(`${API_URL}/restore/${id}`);
    } catch (error) {
      console.error(`Error restoring opportunity with ID ${id}:`, error);
    }
  },

  permanentDeleteOpportunity: async (id) => {
    try {
      await apiClient.delete(`${API_URL}/delete-permanent/${id}`);
    } catch (error) {
      console.error(`Error permanently deleting opportunity with ID ${id}:`, error);
    }
  },

  convertLeadToOpportunity: async (leadId, opportunity) => {
    try {
      const response = await apiClient.post(`${API_URL}/from-lead/${leadId}`, opportunity);
      return response.data;
    } catch (error) {
      console.error(`Error converting lead ${leadId} to opportunity:`, error);
      return null;
    }
  },

  updateOpportunityStage: async (id, stage) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}/stage`, { stage });
      return response.data;
    } catch (error) {
      console.error(`Error updating stage for opportunity ${id}:`, error);
      return null;
    }
  },

  searchOpportunities: async (query) => {
    try {
      const response = await apiClient.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching opportunities:', error);
      return [];
    }
  },

  getOpportunitiesByEmployee: async (employeeId) => {
    try {
      const response = await apiClient.get(`${API_URL}/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching opportunities for employee ${employeeId}:`, error);
      return [];
    }
  },
};

// Export types for use in components
export const Opportunity = {
  // Type definitions for IDE support
};

export default OpportunityService;
