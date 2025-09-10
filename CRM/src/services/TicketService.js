import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tickets';

// Ticket status enum
export const TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
  RESOLVED: 'RESOLVED',
  ESCALATED: 'ESCALATED'
};

export const TicketService = {
  getAllTickets: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  getTicketsByCustomerId: async (customerId) => {
    try {
      const response = await axios.get(`${API_URL}/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tickets for customer ID ${customerId}:`, error);
      throw error;
    }
  },

  getTicketById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
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
      const response = await axios.post(`${API_URL}/customer/${customerId}`, ticket);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  getTicketsByEmail: async (email) => {
    try {
      const response = await axios.get(`${API_URL}/customer/email/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tickets for email ${email}:`, error);
      throw error;
    }
  },

  updateTicket: async (id, ticket) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, ticket);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket ${id}:`, error);
      throw error;
    }
  },

  deleteTicket: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting ticket ${id}:`, error);
      throw error;
    }
  },

  assignTicketToEmployee: async (ticketId, employeeId) => {
    try {
      const response = await axios.put(`${API_URL}/${ticketId}/assign/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error assigning ticket ${ticketId} to employee ${employeeId}:`, error);
      throw error;
    }
  },

  escalateTicket: async (ticketId) => {
    try {
      const response = await axios.put(`${API_URL}/${ticketId}/escalate`);
      return response.data;
    } catch (error) {
      console.error(`Error escalating ticket ${ticketId}:`, error);
      throw error;
    }
  },

  confirmTicketResolution: async (ticketId) => {
    try {
      const response = await axios.put(`${API_URL}/${ticketId}/confirm`);
      return response.data;
    } catch (error) {
      console.error(`Error confirming resolution for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  denyTicketResolution: async (ticketId, feedback) => {
    try {
      const response = await axios.put(`${API_URL}/${ticketId}/deny`, { feedback });
      return response.data;
    } catch (error) {
      console.error(`Error denying resolution for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  getClosedTickets: async (customerId) => {
    try {
      const response = await axios.get(`${API_URL}/customer/${customerId}/closed`);
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
