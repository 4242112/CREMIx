import axios from 'axios';

const API_URL = 'http://localhost:8080/api/invoices';

const InvoiceService = {
  // Get all invoices
  getAllInvoices: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all invoices:', error);
      return [];
    }
  },

  // Get invoices by customer ID
  getInvoicesByCustomerId: async (customerId) => {
    try {
      const response = await axios.get(`${API_URL}/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoices for customer ID ${customerId}:`, error);
      return [];
    }
  },

  // Get invoice by ID
  getInvoiceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ID ${id}:`, error);
      return null;
    }
  },

  // Create invoice for a customer
  createInvoice: async (invoice, customerId) => {
    try {
      const response = await axios.post(`${API_URL}/customer/${customerId}`, invoice);
      return response.data;
    } catch (error) {
      console.error(`Error creating invoice for customer ID ${customerId}:`, error);
      return null;
    }
  },

  // Update invoice
  updateInvoice: async (id, invoice) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, invoice);
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ID ${id}:`, error);
      return null;
    }
  },

  // Delete invoice
  deleteInvoice: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting invoice ID ${id}:`, error);
    }
  },

  // Generate a new invoice number
  generateInvoiceNumber: async () => {
    try {
      const response = await axios.get(`${API_URL}/generate-invoice-number`);
      return response.data;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      return '';
    }
  },

  // Get invoices by customer email
  getInvoicesByEmail: async (email) => {
    try {
      const response = await axios.get(`${API_URL}/customer/email/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoices for email ${email}:`, error);
      return [];
    }
  },

  // Generate invoice from a quotation
  generateInvoiceFromQuotation: async (quotationId) => {
    try {
      const response = await axios.post(`${API_URL}/from-quotation/${quotationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error generating invoice from quotation ID ${quotationId}:`, error);
      return null;
    }
  },

  // Calculate line item amount
  calculateLineItemAmount: (quantity, rate) => {
    return quantity * rate;
  },

  // Calculate invoice totals
  calculateInvoiceTotals: (items, discount = 0, taxRate = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxableAmount = subtotal - discount;
    const taxAmount = taxableAmount * (taxRate / 100);
    const total = taxableAmount + taxAmount;

    return { subtotal, taxAmount, total };
  }
};

// Export types for use in components
export const Invoice = {
  // Type definitions for IDE support
};

export default InvoiceService;
