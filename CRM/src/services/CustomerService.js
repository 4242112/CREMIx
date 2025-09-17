import apiClient from './apiClient.js';

// Customer type definitions for components
export const Customer = {
  // Type placeholder for components that expect Customer type
};

export const CustomerType = {
  ENTERPRISE: "ENTERPRISE",
  BUSINESS: "BUSINESS", 
  SMALL_BUSINESS: "SMALL_BUSINESS",
  INDIVIDUAL: "INDIVIDUAL",
  NEW: "NEW"
};

const CustomerService = {
  getAllCustomers: async () => {
    try {
      const response = await apiClient.get('/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await apiClient.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
  },

  createCustomer: async (customer) => {
    try {
      const response = await apiClient.post('/customers', customer);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, customer) => {
    try {
      const response = await apiClient.put(`/customers/${id}`, customer);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with id ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      await apiClient.delete(`/customers/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  },

  registerCustomer: async (customerData) => {
    try {
      const response = await apiClient.post('/customers/register', customerData);
      return response.data;
    } catch (error) {
      console.error('Error registering customer:', error);
      throw error;
    }
  },

  searchCustomers: async (searchTerm) => {
    try {
      const response = await apiClient.get(`/customers/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching customers with term: ${searchTerm}`, error);
      throw error;
    }
  },

  getCustomerStats: async () => {
    try {
      const response = await apiClient.get('/customers/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  },

  getDeletedCustomers: async () => {
    try {
      const response = await apiClient.get('/customers/recycle-bin');
      return response.data;
    } catch (error) {
      console.error('Error fetching deleted customers:', error);
      throw error;
    }
  },

  restoreCustomer: async (id) => {
    try {
      const response = await apiClient.put(`/customers/restore/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error restoring customer with id ${id}:`, error);
      throw error;
    }
  },

  permanentlyDeleteCustomer: async (id) => {
    try {
      await apiClient.delete(`/customers/delete-permanent/${id}`);
      return true;
    } catch (error) {
      console.error(`Error permanently deleting customer with id ${id}:`, error);
      throw error;
    }
  }
};

export default CustomerService;
