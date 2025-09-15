import apiClient from './apiClient.js';

export const LeadSource = {
  WEBSITE: "WEBSITE",
  INTERNET: "INTERNET",
  REFERRAL: "REFERRAL",
  BROCHURE: "BROCHURE",
  ADVERTISEMENT: "ADVERTISEMENT",
  EMAIL: "EMAIL",
  PHONE: "PHONE",
  EVENT: "EVENT",
  OTHER: "OTHER",
  UNKNOWN: "UNKNOWN"
};

// Lead type definition for components
export const Lead = {};

const LeadService = {
  getAllLeads: async () => {
    try {
      const response = await apiClient.get('/leads');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  getLeadById: async (id) => {
    try {
      const response = await apiClient.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead with id ${id}:`, error);
      throw error;
    }
  },

  createLead: async (lead) => {
    try {
      const response = await apiClient.post('/leads', lead);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  updateLead: async (id, lead) => {
    try {
      const response = await apiClient.put(`/leads/${id}`, lead);
      return response.data;
    } catch (error) {
      console.error(`Error updating lead with id ${id}:`, error);
      throw error;
    }
  },

  deleteLead: async (id) => {
    try {
      await apiClient.delete(`/leads/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting lead with id ${id}:`, error);
      throw error;
    }
  },

  getLeadStats: async () => {
    try {
      const response = await apiClient.get('/leads/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching lead stats:', error);
      throw error;
    }
  },

  getLeadsBySource: async () => {
    try {
      const response = await apiClient.get('/leads/by-source');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads by source:', error);
      throw error;
    }
  }
};

export default LeadService;
