import axios from 'axios';

const API_URL = 'http://localhost:8080/api/leads';

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

const LeadService = {
  getAllLeads: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  getLeadById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead with id ${id}:`, error);
      return null;
    }
  },

  createLead: async (lead) => {
    try {
      const response = await axios.post(API_URL, lead);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
    }
  },

  updateLead: async (id, lead) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, lead);
      return response.data;
    } catch (error) {
      console.error(`Error updating lead with id ${id}:`, error);
      return null;
    }
  },

  deleteLead: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting lead with id ${id}:`, error);
    }
  },

  getLeadsBySource: async () => {
    try {
      const leads = await LeadService.getAllLeads();

      const sourceCounts = {};
      leads.forEach(lead => {
        const source = lead.source || LeadSource.UNKNOWN;
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      return Object.entries(sourceCounts)
        .map(([source, value]) => ({ source, value }))
        .sort((a, b) => b.value - a.value);
    } catch (error) {
      console.error('Error aggregating leads by source:', error);
      return [];
    }
  }
};

// Export types for use in components
export const Lead = {
  // Type definitions for IDE support
};

export default LeadService;
