import axios from 'axios';
import ProductService from './ProductService';

const BASE_URL = 'http://localhost:8080/api/quotations';

const QuotationService = {
  getQuotation: async (id) => {
    const response = await axios.get(`${BASE_URL}/opportunity/${id}`);
    console.log('QuotationService response:', response.data);
    return response.data;
  },

  saveQuotation: async (opportunityId, quotation) => {
    const response = await axios.post(`${BASE_URL}/opportunity/${opportunityId}`, quotation);
    return response.data;
  },

  updateQuotation: async (id, quotation) => {
    const response = await axios.put(`${BASE_URL}/${id}`, quotation);
    return response.data;
  },

  deleteQuotation: async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  sendQuotation: async (id) => {
    const response = await axios.post(`${BASE_URL}/${id}/send`);
    return response.data;
  },

  getCustomerQuotations: async (customerId) => {
    const response = await axios.get(`${BASE_URL}/customer/${customerId}`);
    return response.data;
  },

  getQuotationsByEmail: async (email) => {
    const response = await axios.get(`${BASE_URL}/customer/email/${email}`);
    return response.data;
  },

  getQuotationsByName: async (name) => {
    const response = await axios.get(`${BASE_URL}/customer/name/${name}`);
    return response.data;
  },

  acceptQuotation: async (id) => {
    const response = await axios.post(`${BASE_URL}/${id}/accept`);
    return response.data;
  },

  rejectQuotation: async (id) => {
    const response = await axios.post(`${BASE_URL}/${id}/reject`);
    return response.data;
  }
};

// Export types for use in components
export const Quotation = {
  // Type definitions for IDE support
};

export const QuotationStage = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

export default QuotationService;
