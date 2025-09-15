import apiClient from './apiClient.js';

// Ticket status enum
export const TicketStatus = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
  RESOLVED: 'RESOLVED',
  URGENT: 'URGENT'
};

export const TicketService = {
  getAllTickets: async () => {
    try {
      const response = await apiClient.get('/tickets');
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  getTicketsByCustomerId: async (customerId) => {
    try {
      const response = await apiClient.get(`/tickets/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tickets for customer ID ${customerId}:`, error);
      throw error;
    }
  },

  getTicketById: async (id) => {
    try {
      const response = await apiClient.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket ${id}:`, error);
      throw error;
    }
  },

  createTicket: async (ticket, customerId) => {
    try {
      if (!ticket.status) {
        ticket.status = 'NEW';
      }
      const response = await apiClient.post(`/tickets/customer/${customerId}`, ticket);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  getTicketsByEmail: async (email) => {
    try {
      const response = await apiClient.get(`/tickets/customer/email/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tickets for email ${email}:`, error);
      throw error;
    }
  },

  updateTicket: async (id, ticket) => {
    try {
      const response = await apiClient.put(`/tickets/${id}`, ticket);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket ${id}:`, error);
      throw error;
    }
  },

  deleteTicket: async (id) => {
    try {
      await apiClient.delete(`/tickets/${id}`);
    } catch (error) {
      console.error(`Error deleting ticket ${id}:`, error);
      throw error;
    }
  },

  assignTicketToEmployee: async (ticketId, employeeId) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}/assign/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error assigning ticket ${ticketId} to employee ${employeeId}:`, error);
      throw error;
    }
  },

  escalateTicket: async (ticketId) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}/escalate`);
      return response.data;
    } catch (error) {
      console.error(`Error escalating ticket ${ticketId}:`, error);
      throw error;
    }
  },

  startWorkingOnTicket: async (ticketId) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}`, { status: 'IN_PROGRESS' });
      return response.data;
    } catch (error) {
      console.error(`Error starting work on ticket ${ticketId}:`, error);
      throw error;
    }
  },

  confirmTicketResolution: async (ticketId) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}/confirm`);
      return response.data;
    } catch (error) {
      console.error(`Error confirming resolution for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  denyTicketResolution: async (ticketId, feedback) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}/deny`, { feedback });
      return response.data;
    } catch (error) {
      console.error(`Error denying resolution for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  getClosedTickets: async (customerId) => {
    try {
      const response = await apiClient.get(`/tickets/customer/${customerId}/closed`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching closed tickets for customer ${customerId}:`, error);
      throw error;
    }
  }
};

// Optional date formatting utility
export const formatDate = (dateString) => {
  if (!dateString) return '';
  if (/^\d{2}\/\d{2}\/\d{2}$/.test(dateString)) return dateString;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear() % 100).padStart(2, '0')}`;
  } catch {
    return 'Invalid date';
  }
};

// Export types for use in components
export const Ticket = {
  // Type definitions for IDE support
};

// Export TicketService as default
export default TicketService;
