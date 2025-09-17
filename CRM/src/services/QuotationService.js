import apiClient from './apiClient';
import ProductService from './ProductService';

const BASE_URL = '/quotations';

const QuotationService = {
  getQuotation: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/opportunity/${id}`);
    console.log('QuotationService response:', response.data);
    return response.data;
  },

  saveQuotation: async (opportunityId, quotation) => {
    const response = await apiClient.post(`${BASE_URL}/opportunity/${opportunityId}`, quotation);
    return response.data;
  },

  // Create a quotation directly for a customer (multiple quotations support)
  createQuotationForCustomer: async (customerId, quotation) => {
    const response = await apiClient.post(`${BASE_URL}/customer/${customerId}`, quotation);
    return response.data;
  },

  updateQuotation: async (id, quotation) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, quotation);
    return response.data;
  },

  deleteQuotation: async (id) => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  sendQuotation: async (id) => {
    const response = await apiClient.post(`${BASE_URL}/${id}/send`);
    return response.data;
  },

  getCustomerQuotations: async (customerId) => {
    const response = await apiClient.get(`${BASE_URL}/customer/${customerId}`);
    return response.data;
  },

  getQuotationsByEmail: async (email) => {
    const response = await apiClient.get(`${BASE_URL}/customer/email/${email}`);
    return response.data;
  },

  getQuotationsByName: async (name) => {
    const response = await apiClient.get(`${BASE_URL}/customer/name/${name}`);
    return response.data;
  },

  acceptQuotation: async (id) => {
    const response = await apiClient.post(`${BASE_URL}/${id}/accept`);
    return response.data;
  },

  rejectQuotation: async (id) => {
    const response = await apiClient.post(`${BASE_URL}/${id}/reject`);
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
