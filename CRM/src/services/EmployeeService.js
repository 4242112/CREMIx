import apiClient from './apiClient';
import InvoiceService from './InvoiceService';
import LeadService from './LeadService';

const API_URL = '/employees';

const EmployeeService = {
  /**
   * Get all employee names
   * @returns {Promise<string[]>}
   */
  getAllEmployeeNames: async () => {
    try {
      const response = await apiClient.get(`${API_URL}/names`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee names:', error);
      return [];
    }
  },

  /**
   * Get all employees
   * @returns {Promise<Object[]>}
   */
  getAllEmployees: async () => {
    try {
      const response = await apiClient.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  /**
   * Get sales performance for all employees
   * @returns {Promise<Object[]>}
   */
  getEmployeeSalesPerformance: async () => {
    try {
      const [employees, leads, invoices] = await Promise.all([
        EmployeeService.getAllEmployees(),
        LeadService.getAllLeads(),
        InvoiceService.getAllInvoices()
      ]);

      const employeeSalesMap = {};

      // Initialize performance for each employee
      employees.forEach(employee => {
        employeeSalesMap[employee.name] = {
          name: employee.name,
          salesAmount: 0,
          leadsConverted: 0,
          conversionRate: 0
        };
      });

      // Count leads assigned to each employee
      const leadCountByEmployee = {};
      leads.forEach(lead => {
        if (lead.assignedTo) {
          leadCountByEmployee[lead.assignedTo] = (leadCountByEmployee[lead.assignedTo] || 0) + 1;
        }
      });

      // Accumulate sales from invoices
      invoices.forEach(invoice => {
        const matchedEmployee = employees.find(emp => invoice.employeeName.includes(emp.name));
        if (matchedEmployee) {
          const performance = employeeSalesMap[matchedEmployee.name];
          if (performance) {
            performance.salesAmount += invoice.total;
            performance.leadsConverted += 1;
          }
        }
      });

      // Calculate conversion rate
      Object.keys(employeeSalesMap).forEach(employeeName => {
        const leadsAssigned = leadCountByEmployee[employeeName] || 0;
        const leadsConverted = employeeSalesMap[employeeName].leadsConverted;
        if (leadsAssigned > 0) {
          employeeSalesMap[employeeName].conversionRate = (leadsConverted / leadsAssigned) * 100;
        }
      });

      // Return sorted array by sales amount
      return Object.values(employeeSalesMap).sort((a, b) => b.salesAmount - a.salesAmount);

    } catch (error) {
      console.error('Error fetching employee sales performance:', error);
      return [];
    }
  },

  /**
   * Create a new employee
   * @param {Object} employeeData - Employee data to create
   * @returns {Promise<Object>}
   */
  createEmployee: async (employeeData) => {
    try {
      const response = await apiClient.post(API_URL, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  /**
   * Update an employee
   * @param {number} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Promise<Object>}
   */
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  /**
   * Delete an employee
   * @param {number} id - Employee ID
   * @returns {Promise<void>}
   */
  deleteEmployee: async (id) => {
    try {
      await apiClient.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting employee:', error);
      
      // Provide more specific error messages based on response status
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data || 'Unknown error';
        
        switch (status) {
          case 404:
            throw new Error('Employee not found');
          case 400:
            throw new Error('Cannot delete employee: ' + message);
          case 403:
            throw new Error('Access denied: You do not have permission to delete this employee');
          case 409:
            throw new Error('Cannot delete employee: Employee may have associated records');
          default:
            throw new Error(`Failed to delete employee: ${message}`);
        }
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to server');
      } else {
        throw new Error('An unexpected error occurred while deleting employee');
      }
    }
  }
};

export default EmployeeService;
