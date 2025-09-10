import axios from 'axios';
import InvoiceService from './InvoiceService';
import LeadService from './LeadService';

const API_URL = 'http://localhost:8080/api/employees';

const EmployeeService = {
  /**
   * Get all employee names
   * @returns {Promise<string[]>}
   */
  getAllEmployeeNames: async () => {
    try {
      const response = await axios.get(`${API_URL}/names`);
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
      const response = await axios.get(API_URL);
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
  }
};

export default EmployeeService;
