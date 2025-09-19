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

  // Admin login
  loginAdmin: async (credentials) => {
    const response = await axios.post(`${API_URL}/login/admin`, credentials);

    if (response.data && response.data.isAuthenticated) {
      localStorage.setItem("adminAuth", JSON.stringify(response.data));
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

  // Check if admin is logged in
  isAdminLoggedIn: () => {
    const authData = localStorage.getItem("adminAuth");
    return !!authData && JSON.parse(authData).isAuthenticated;
  },

  // Check if any user is logged in
  isAnyUserLoggedIn: () => {
    return AuthService.isEmployeeLoggedIn() || 
           AuthService.isCustomerLoggedIn() || 
           AuthService.isAdminLoggedIn();
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

  // Get current admin info
  getCurrentAdmin: () => {
    const authData = localStorage.getItem("adminAuth");
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

  // Logout admin
  logoutAdmin: () => {
    localStorage.removeItem("adminAuth");
  },

  // Logout all users
  logoutAll: () => {
    localStorage.removeItem("employeeAuth");
    localStorage.removeItem("customerAuth");
    localStorage.removeItem("adminAuth");
  },

  // Get current user type
  getCurrentUserType: () => {
    if (AuthService.isAdminLoggedIn()) return "ADMIN";
    if (AuthService.isEmployeeLoggedIn()) return "EMPLOYEE";
    if (AuthService.isCustomerLoggedIn()) return "CUSTOMER";
    return null;
  },

  // Get current user info (any type)
  getCurrentUser: () => {
    if (AuthService.isAdminLoggedIn()) return AuthService.getCurrentAdmin();
    if (AuthService.isEmployeeLoggedIn()) return AuthService.getCurrentEmployee();
    if (AuthService.isCustomerLoggedIn()) return AuthService.getCurrentCustomer();
    return null;
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email: email.trim()
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Failed to send password reset email. Please try again.");
      }
    }
  },

  // Validate password reset token
  validateResetToken: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/password-reset/validate?token=${token}`);
      return response.data;
    } catch (error) {
      console.error("Token validation error:", error);
      throw new Error("Invalid or expired reset token.");
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/password-reset/reset`, {
        token: token,
        newPassword: newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Failed to reset password. Please try again.");
      }
    }
  },
};

export default AuthService;
