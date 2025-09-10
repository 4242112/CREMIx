import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const AuthService = {
  // Employee login
  loginEmployee: async (credentials) => {
    const response = await axios.post(`${API_URL}/login/employee`, credentials);

    if (response.data && response.data.isAuthenticated) {
      localStorage.setItem("employeeAuth", JSON.stringify(response.data));
    }

    return response.data;
  },

  // Customer login
  loginCustomer: async (credentials) => {
    const response = await axios.post(`${API_URL}/login/customer`, credentials);

    if (response.data && response.data.isAuthenticated) {
      localStorage.setItem("customerAuth", JSON.stringify(response.data));
    }

    return response.data;
  },

  // Customer registration
  registerCustomer: async (customerData) => {
    try {
      const response = await axios.post(`${API_URL}/register/customer`, customerData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data) {
        throw new Error(error.response.data);
      } else {
        throw new Error("Registration failed. Please try again later.");
      }
    }
  },

  // Check if employee is logged in
  isEmployeeLoggedIn: () => {
    const authData = localStorage.getItem("employeeAuth");
    return !!authData && JSON.parse(authData).isAuthenticated;
  },

  // Check if customer is logged in
  isCustomerLoggedIn: () => {
    const authData = localStorage.getItem("customerAuth");
    return !!authData && JSON.parse(authData).isAuthenticated;
  },

  // Get current employee info
  getCurrentEmployee: () => {
    const authData = localStorage.getItem("employeeAuth");
    return authData ? JSON.parse(authData) : null;
  },

  // Get current customer info
  getCurrentCustomer: () => {
    const authData = localStorage.getItem("customerAuth");
    return authData ? JSON.parse(authData) : null;
  },

  // Logout employee
  logoutEmployee: () => {
    localStorage.removeItem("employeeAuth");
  },

  // Logout customer
  logoutCustomer: () => {
    localStorage.removeItem("customerAuth");
  },
};

export default AuthService;
