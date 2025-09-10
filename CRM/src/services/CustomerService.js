import axios from 'axios';

const API_URL = 'http://localhost:8080/api/customers';

/**
 * @typedef {Object} Customer
 * @property {number} [id]
 * @property {string} [name]
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} [address]
 * @property {string} [city]
 * @property {string} [state]
 * @property {string} [zipCode]
 * @property {string} [country]
 * @property {string} [website]
 * @property {string} type
 * @property {boolean} hasPassword
 */

/**
 * @typedef {Object} PasswordUpdateDTO
 * @property {string} password
 */

/**
 * @typedef {Object} CustomerRegistrationDTO
 * @property {string} name
 * @property {string} phoneNumber
 * @property {string} [address]
 * @property {string} [city]
 * @property {string} [state]
 * @property {string} password
 */

const CustomerService = {
  getAllCustomers: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error getting all customers:', error);
      throw error;
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting customer with ID ${id}:`, error);
      throw error;
    }
  },

  getCustomerByEmail: async (email) => {
    try {
      const response = await axios.get(`${API_URL}/email/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting customer with email ${email}:`, error);
      throw error;
    }
  },

  createCustomer: async (customer) => {
    try {
      const response = await axios.post(API_URL, customer);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, customer) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, customer);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting customer with ID ${id}:`, error);
      throw error;
    }
  },

  restoreCustomer: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/restore/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error restoring customer with ID ${id}:`, error);
      throw error;
    }
  },

  getCustomersByType: async (type) => {
    try {
      const response = await axios.get(`${API_URL}/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting customers with type ${type}:`, error);
      throw error;
    }
  },

  getDeletedCustomers: async () => {
    try {
      const response = await axios.get(`${API_URL}/recycle-bin`);
      return response.data;
    } catch (error) {
      console.error('Error getting deleted customers:', error);
      throw error;
    }
  },

  permanentlyDeleteCustomer: async (id) => {
    try {
      await axios.delete(`${API_URL}/delete-permanent/${id}`);
    } catch (error) {
      console.error(`Error permanently deleting customer with ID ${id}:`, error);
      throw error;
    }
  },

  setCustomerPassword: async (id, passwordData) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/set-password`, passwordData);
      return response.data;
    } catch (error) {
      console.error(`Error setting password for customer with ID ${id}:`, error);
      throw error;
    }
  },

  registerCustomer: async (id, registrationData) => {
    try {
      const response = await axios.post(`${API_URL}/${id}/register`, registrationData);
      return response.data;
    } catch (error) {
      console.error(`Error registering customer with ID ${id}:`, error);
      throw error;
    }
  },

  searchCustomersByName: async (name) => {
    try {
      const response = await axios.get(`${API_URL}/search/name?q=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching customers by name ${name}:`, error);
      throw error;
    }
  }
};

// Export types for use in components
export const CustomerType = {
  INDIVIDUAL: 'INDIVIDUAL',
  BUSINESS: 'BUSINESS'
};

export const Customer = {
  // Type definitions for IDE support
};

export default CustomerService;
