import apiClient from './apiClient.js';

const DashboardService = {
  /**
   * Check if the API is healthy
   * @returns {Promise<boolean>}
   */
  checkAPIHealth: async () => {
    try {
      await apiClient.get('/dashboard');
      return true;
    } catch (error) {
      console.error('Dashboard API health check failed:', error);
      return false;
    }
  },

  /**
   * Get complete dashboard data
   * @returns {Promise<Object>}
   */
  getDashboardData: async () => {
    try {
      const response = await apiClient.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  /**
   * Get total leads count
   * @returns {Promise<number>}
   */
  getLeadsCount: async () => {
    try {
      const response = await apiClient.get('/leads/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads count:', error);
      return 0;
    }
  },

  /**
   * Get total opportunities count
   * @returns {Promise<number>}
   */
  getOpportunitiesCount: async () => {
    try {
      const response = await apiClient.get('/opportunities/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching opportunities count:', error);
      return 0;
    }
  },

  /**
   * Get total customers count
   * @returns {Promise<number>}
   */
  getCustomersCount: async () => {
    try {
      const response = await apiClient.get('/customers/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers count:', error);
      return 0;
    }
  },

  /**
   * Get total sales
   * @returns {Promise<number>}
   */
  getTotalSales: async () => {
    try {
      const response = await apiClient.get('/invoices/total');
      return response.data;
    } catch (error) {
      console.error('Error fetching total sales:', error);
      return 0;
    }
  },

  /**
   * Get average order value
   * @returns {Promise<number>}
   */
  getAverageOrderValue: async () => {
    try {
      const response = await apiClient.get('/invoices/average');
      return response.data;
    } catch (error) {
      console.error('Error fetching average order value:', error);
      return 0;
    }
  },

  /**
   * Get leads by source
   * @returns {Promise<Array>}
   */
  getLeadsBySource: async () => {
    try {
      const response = await apiClient.get('/dashboard/leads-by-source');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads by source:', error);
      return [];
    }
  },

  /**
   * Get products by category
   * @returns {Promise<Array>}
   */
  getProductsByCategory: async () => {
    try {
      const response = await apiClient.get('/dashboard/products-by-category');
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  /**
   * Get opportunities by stage
   * @returns {Promise<Array>}
   */
  getOpportunitiesByStage: async () => {
    try {
      const response = await apiClient.get('/dashboard/opportunities-by-stage');
      return response.data;
    } catch (error) {
      console.error('Error fetching opportunities by stage:', error);
      return [];
    }
  },

  /**
   * Get growth data (customers, leads, sales)
   * @returns {Promise<Object>}
   */
  getGrowthData: async () => {
    try {
      const response = await apiClient.get('/dashboard/growth');
      return response.data;
    } catch (error) {
      console.error('Error fetching growth data:', error);
      return { customers: 0, leads: 0, sales: 0 };
    }
  }
};

export default DashboardService;
