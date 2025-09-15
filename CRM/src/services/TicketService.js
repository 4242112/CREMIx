import apiClient from './apiClient.js';
import { getDemoTickets, initializeSampleTickets } from '../data/sampleTickets.js';

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
      console.warn('Backend API not available, using demo data:', error.message);
      
      // Initialize sample tickets if not exists
      initializeSampleTickets();
      
      // Return demo tickets from localStorage
      return getDemoTickets();
    }
  },

  getTicketsByCustomerId: async (customerId) => {
    try {
      const response = await apiClient.get(`/tickets/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend API not available, using demo data for customer ${customerId}:`, error.message);
      
      // Return filtered demo tickets
      const demoTickets = getDemoTickets();
      return demoTickets.filter(ticket => 
        ticket.customerId === customerId || 
        ticket.customerEmail?.includes(customerId) ||
        customerId === 1 // Default customer ID for demo
      );
    }
  },

  getTicketById: async (id) => {
    try {
      const response = await apiClient.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend API not available, using demo data for ticket ${id}:`, error.message);
      
      // Return specific demo ticket
      const demoTickets = getDemoTickets();
      return demoTickets.find(ticket => ticket.id === id || ticket.id === parseInt(id));
    }
  },

  createTicket: async (ticket, customerId) => {
    try {
      // Ensure ticket has NEW status if not specified
      if (!ticket.status) {
        ticket.status = 'NEW';
      }
      
      const response = await apiClient.post(`/tickets/customer/${customerId}`, ticket);
      return response.data;
    } catch (error) {
      console.warn('Backend API not available, simulating ticket creation:', error.message);
      
      // Fallback: create ticket in demo data
      const newTicket = {
        id: Date.now(), // Generate unique ID
        ...ticket,
        status: ticket.status || 'NEW', // Ensure NEW status
        customerId: customerId,
        customerName: 'Demo Customer',
        employeeName: null,
        assignedTo: null,
        createdAt: ticket.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: ticket.priority || 'MEDIUM'
      };
      
      // Store in localStorage with existing demo tickets
      const existingTickets = JSON.parse(localStorage.getItem('demoTickets')) || getDemoTickets();
      existingTickets.push(newTicket);
      localStorage.setItem('demoTickets', JSON.stringify(existingTickets));
      
      console.log('Demo ticket created successfully:', newTicket);
      return newTicket;
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
      console.warn(`Backend API not available, simulating ticket update for ${id}:`, error.message);
      
      // Update demo ticket in localStorage
      const demoTickets = getDemoTickets();
      const ticketIndex = demoTickets.findIndex(t => t.id === id || t.id === parseInt(id));
      
      if (ticketIndex !== -1) {
        demoTickets[ticketIndex] = { ...demoTickets[ticketIndex], ...ticket, updatedAt: new Date().toISOString() };
        localStorage.setItem('demoTickets', JSON.stringify(demoTickets));
        return demoTickets[ticketIndex];
      }
      
      throw new Error(`Ticket ${id} not found in demo data`);
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
