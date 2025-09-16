/**
 * TicketService.js
 * 
 * CORE SERVICE: Ticket Management System
 * 
 * PURPOSE: 
 * - Handles all ticket-related operations (CRUD)
 * - Provides intelligent fallback to demo data when backend is unavailable
 * - Manages ticket status workflow: NEW → IN_PROGRESS → RESOLVED → CLOSED
 * - Integrates with chatbot ticket creation and employee ticket management
 * 
 * ARCHITECTURE:
 * - Primary: Attempts API calls to backend server
 * - Fallback: Uses localStorage with sample tickets for demo/development
 * - Data Flow: Components → TicketService → API/localStorage → UI Updates
 * 
 * USAGE PATTERNS:
 * - Employee Dashboard: View/manage tickets by status
 * - Customer Portal: View own tickets and create new ones
 * - Chatbot Integration: Create tickets from customer conversations
 * - Admin Panel: Full ticket management and analytics
 */

import apiClient from './apiClient.js';
import { getDemoTickets, initializeSampleTickets } from '../data/sampleTickets.js';

/**
 * TICKET STATUS ENUM
 * Defines the complete ticket lifecycle for workflow management
 * Used across all components for status filtering and updates
 */
export const TicketStatus = {
  NEW: 'NEW',                    // Just created, awaiting assignment
  OPEN: 'OPEN',                  // Assigned but work not started
  IN_PROGRESS: 'IN_PROGRESS',    // Actively being worked on
  CLOSED: 'CLOSED',              // Fully resolved and closed
  RESOLVED: 'RESOLVED',          // Issue fixed, awaiting customer confirmation
  URGENT: 'URGENT'               // High priority requiring immediate attention
};

/**
 * TICKET SERVICE - Main ticket management interface
 * All ticket operations go through this service for consistency
 */
export const TicketService = {
  
  /**
   * GET ALL TICKETS
   * Used by: Admin Dashboard, Employee Dashboard, Ticket Lists
   * Returns: Array of all tickets with fallback to demo data
   */
  getAllTickets: async () => {
    try {
      // Attempt API call to backend
      const response = await apiClient.get('/tickets');
      return response.data;
    } catch (error) {
      console.warn('Backend API not available, using demo data:', error.message);
      
      // FALLBACK: Initialize and return sample tickets for demo purposes
      initializeSampleTickets();
      return getDemoTickets();
    }
  },

  /**
   * GET TICKETS BY CUSTOMER ID
   * Used by: Customer Dashboard, Customer Ticket Views
   * Returns: Filtered tickets for specific customer
   */
  getTicketsByCustomerId: async (customerId) => {
    try {
      const response = await apiClient.get(`/tickets/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend API not available, using demo data for customer ${customerId}:`, error.message);
      
      // FALLBACK: Filter demo tickets by customer
      const demoTickets = getDemoTickets();
      return demoTickets.filter(ticket => 
        ticket.customerId === customerId || 
        ticket.customerEmail?.includes(customerId) ||
        customerId === 1 // Default customer ID for demo environment
      );
    }
  },

  /**
   * GET SINGLE TICKET BY ID
   * Used by: Ticket Detail Views, Update Operations
   * Returns: Single ticket object or null if not found
   */
  getTicketById: async (id) => {
    try {
      const response = await apiClient.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend API not available, using demo data for ticket ${id}:`, error.message);
      
      // FALLBACK: Search in demo tickets by ID (string or number)
      const demoTickets = getDemoTickets();
      return demoTickets.find(ticket => ticket.id === id || ticket.id === parseInt(id));
    }
  },

  /**
   * CREATE NEW TICKET
   * Used by: Customer Portal, Chatbot Integration, Manual Ticket Creation
   * Workflow: Customer Request → Validation → API/Storage → Notification → Employee Assignment
   * Returns: Created ticket object with assigned ID
   */
  createTicket: async (ticket, customerId) => {
    try {
      // VALIDATION: Ensure proper ticket status for new tickets
      if (!ticket.status) {
        ticket.status = 'NEW';  // Default status for all new tickets
      }
      
      // PRIMARY: Attempt API call to backend
      const response = await apiClient.post(`/tickets/customer/${customerId}`, ticket);
      return response.data;
    } catch (error) {
      console.warn('Backend API not available, simulating ticket creation:', error.message);
      
      // FALLBACK: Create ticket in demo data system for development/demo
      const newTicket = {
        id: Date.now(), // Generate unique ID based on timestamp
        ...ticket,
        status: ticket.status || 'NEW', // Ensure NEW status is preserved
        customerId: customerId,
        customerName: 'Demo Customer',  // In real app, fetch from customer service
        employeeName: null,             // Will be assigned later by admin/system
        assignedTo: null,               // Employee assignment happens in workflow
        createdAt: ticket.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: ticket.priority || 'MEDIUM'  // Default priority for new tickets
      };
      
      // STORAGE: Add to localStorage-based demo ticket system
      const existingTickets = JSON.parse(localStorage.getItem('demoTickets')) || getDemoTickets();
      existingTickets.push(newTicket);
      localStorage.setItem('demoTickets', JSON.stringify(existingTickets));
      
      console.log('Demo ticket created successfully:', newTicket);
      return newTicket;
    }
  },

  /**
   * GET TICKETS BY EMAIL
   * Used by: Customer Portal Login, Email-based Ticket Lookup
   * Returns: Array of tickets associated with customer email
   */
  getTicketsByEmail: async (email) => {
    try {
      const response = await apiClient.get(`/tickets/customer/email/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tickets for email ${email}:`, error);
      throw error;
    }
  },

  /**
   * UPDATE EXISTING TICKET
   * Used by: Employee Dashboard, Status Changes, Work Progress Updates
   * Workflow: Status Change → Validation → API/Storage Update → UI Refresh → Notifications
   * Returns: Updated ticket object
   */
  updateTicket: async (id, ticket) => {
    try {
      // PRIMARY: Attempt API call to backend
      const response = await apiClient.put(`/tickets/${id}`, ticket);
      return response.data;
    } catch (error) {
      console.warn(`Backend API not available, simulating ticket update for ${id}:`, error.message);
      
      // FALLBACK: Update ticket in localStorage demo system
      const demoTickets = getDemoTickets();
      const ticketIndex = demoTickets.findIndex(t => t.id === id || t.id === parseInt(id));
      
      if (ticketIndex !== -1) {
        // Merge existing ticket with updates and timestamp
        demoTickets[ticketIndex] = { 
          ...demoTickets[ticketIndex], 
          ...ticket, 
          updatedAt: new Date().toISOString() 
        };
        localStorage.setItem('demoTickets', JSON.stringify(demoTickets));
        return demoTickets[ticketIndex];
      }
      
      throw new Error(`Ticket ${id} not found in demo data`);
    }
  },

  /**
   * DELETE TICKET
   * Used by: Admin Panel, Cleanup Operations
   * Note: Usually tickets are closed rather than deleted for audit trail
   */
  deleteTicket: async (id) => {
    try {
      await apiClient.delete(`/tickets/${id}`);
    } catch (error) {
      console.error(`Error deleting ticket ${id}:`, error);
      throw error;
    }
  },

  /**
   * ASSIGN TICKET TO EMPLOYEE
   * Used by: Admin Dashboard, Ticket Management Workflow
   * Workflow: Ticket Selection → Employee Assignment → Status Update → Notification
   */
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

  /**
   * CONFIRM TICKET RESOLUTION
   * Used by: Customer Portal, Resolution Confirmation Workflow
   * Workflow: Customer Reviews Solution → Confirms Resolution → Ticket Closed → Feedback Collection
   */
  confirmTicketResolution: async (ticketId) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}/confirm`);
      return response.data;
    } catch (error) {
      console.error(`Error confirming resolution for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  /**
   * DENY TICKET RESOLUTION  
   * Used by: Customer Portal, Quality Control Workflow
   * Workflow: Customer Reviews → Provides Feedback → Ticket Reopened → Employee Notified
   */
  denyTicketResolution: async (ticketId, feedback) => {
    try {
      const response = await apiClient.put(`/tickets/${ticketId}/deny`, { feedback });
      return response.data;
    } catch (error) {
      console.error(`Error denying resolution for ticket ${ticketId}:`, error);
      throw error;
    }
  },

  /**
   * GET CLOSED TICKETS FOR CUSTOMER
   * Used by: Customer Portal History, Analytics Dashboard
   * Returns: Historical tickets for customer review and reference
   */
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

/**
 * UTILITY FUNCTION: Date Formatting
 * Used throughout the application for consistent date display
 * Handles various date formats and provides fallback for invalid dates
 */
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
