import apiClient from './apiClient.js';

export const ResolvedTicketService = {
  // Create a new resolved ticket
  createResolvedTicket: async (resolvedTicketData) => {
    try {
      const response = await apiClient.post('/resolved-tickets', resolvedTicketData);
      return response.data;
    } catch (error) {
      console.error('Error creating resolved ticket:', error);
      throw error;
    }
  },

  // Get all resolved tickets
  getAllResolvedTickets: async () => {
    try {
      const response = await apiClient.get('/resolved-tickets');
      return response.data;
    } catch (error) {
      console.error('Error fetching resolved tickets:', error);
      throw error;
    }
  },

  // Get resolved ticket by ID
  getResolvedTicketById: async (id) => {
    try {
      const response = await apiClient.get(`/resolved-tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resolved ticket ${id}:`, error);
      throw error;
    }
  },

  // Get resolved tickets by employee
  getResolvedTicketsByEmployee: async (employeeId) => {
    try {
      const response = await apiClient.get(`/resolved-tickets/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resolved tickets for employee ${employeeId}:`, error);
      throw error;
    }
  },

  // Get resolved tickets by admin
  getResolvedTicketsByAdmin: async (adminId) => {
    try {
      const response = await apiClient.get(`/resolved-tickets/admin/${adminId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resolved tickets for admin ${adminId}:`, error);
      throw error;
    }
  },

  // Get resolved ticket by original ticket ID
  getResolvedTicketByOriginalTicketId: async (ticketId) => {
    try {
      const response = await apiClient.get(`/resolved-tickets/original-ticket/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching resolved ticket for original ticket ${ticketId}:`, error);
      throw error;
    }
  }
};

export default ResolvedTicketService;