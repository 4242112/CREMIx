/* eslint-disable no-undef */
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/dashboard';

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 seconds timeout

const DashboardService = {
  /**
   * Check if the API is healthy
   * @returns {Promise<boolean>}
   */
  checkAPIHealth: async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      console.log('API health check response:', response.data);
      return response.status === 200;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  },

  /**
   * Get complete dashboard data
   * @returns {Promise<Object>}
   */
  getDashboardData: async () => {
    try {
      console.log('Fetching dashboard data from:', API_URL);
      const response = await axios.get(API_URL);
      console.log('Dashboard data response:', response.data);

      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);

      // Retry once after 1 second
      try {
        console.log('Retrying dashboard data fetch...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retryResponse = await axios.get(API_URL);
        console.log('Retry dashboard data response:', retryResponse.data);
        return retryResponse.data;
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        // Fallback data
        return {
          totalLeads: 0,
          totalOpportunities: 0,
          totalCustomers: 0,
          totalSales: 0,
          averageOrderValue: 0,
          leadsBySource: [],
          productsByCategory: [],
          opportunitiesByStage: [],
          customerGrowth: 0,
          leadGrowth: 0,
          salesGrowth: 0
        };
      }
    }
  },

  /**
   * Get total leads count
   * @returns {Promise<number>}
   */
  getLeadsCount: async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/leads/count');
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
      const response = await axios.get('http://localhost:8080/api/opportunities/count');
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
      const response = await axios.get('http://localhost:8080/api/customers/count');
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
      const response = await axios.get('http://localhost:8080/api/invoices/total');
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
      const response = await axios.get('http://localhost:8080/api/invoices/average');
      return response.data;
    } catch (error) {
      console.error('Error fetching average order value:', error);
      return 0;
    }
  },

  /**
   * Get leads by source
   * @returns {Promise<Array<{source: string, value: number}>>}
   */
  getLeadsBySource: async () => {
    try {
      const response = await axios.get(`${API_URL}/leads-by-source`);
      return response.data.map(item => ({ source: item.source, value: item.value }));
    } catch (error) {
      console.error('Error fetching leads by source:', error);
      return [];
    }
  },

  /**
   * Get products by category
   * @returns {Promise<Array<{category: string, value: number}>>}
   */
  getProductsByCategory: async () => {
    try {
      const response = await axios.get(`${API_URL}/products-by-category`);
      return response.data.map(item => ({ category: item.category, value: item.value }));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  /**
   * Get opportunities by stage
   * @returns {Promise<Array<{stage: string, value: number}>>}
   */
  getOpportunitiesByStage: async () => {
    try {
      const response = await axios.get(`${API_URL}/opportunities-by-stage`);
      return response.data.map(item => ({ stage: item.stage, value: item.value }));
    } catch (error) {
      console.error('Error fetching opportunities by stage:', error);
      return [];
    }
  },

  /**
   * Get growth data (customers, leads, sales)
   * @returns {Promise<{customers: number, leads: number, sales: number}>}
   */
  getGrowthData: async () => {
    try {
      const response = await axios.get(`${API_URL}/growth`);
      return response.data;
    } catch (error) {
      console.error('Error fetching growth data:', error);
      return { customers: 0, leads: 0, sales: 0 };
    }
  }
};

export default DashboardService;
