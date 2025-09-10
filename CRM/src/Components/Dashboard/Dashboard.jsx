import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ScatterController,
  BubbleController
} from 'chart.js';

import DashboardService from '../../services/DashboardService';
import InvoiceService from '../../services/InvoiceService';
import LeadService from '../../services/LeadService';
import ProductService from '../../services/ProductService';
import EmployeeService from '../../services/EmployeeService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ScatterController,
  BubbleController
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
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
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeSales, setEmployeeSales] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        let totalSales = 0;
        let averageOrderValue = 0;

        try {
          const invoices = await InvoiceService.getAllInvoices();
          totalSales = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
          averageOrderValue = invoices.length > 0 ? totalSales / invoices.length : 0;
        } catch (err) {
          console.error('Error fetching invoices:', err);
        }

        const data = await DashboardService.getDashboardData();

        let leadsBySource = [];
        try {
          leadsBySource = await LeadService.getLeadsBySource();
        } catch (err) {
          console.error('Error fetching leads by source:', err);
          leadsBySource = data.leadsBySource || [];
        }

        let productsByCategory = [];
        try {
          productsByCategory = await ProductService.getProductCategoryCounts();
        } catch (err) {
          console.error('Error fetching products by category:', err);
          productsByCategory = data.productsByCategory || [];
        }

        try {
          const employeeSalesData = await EmployeeService.getEmployeeSalesPerformance();
          setEmployeeSales(employeeSalesData);
        } catch (err) {
          console.error('Error fetching employee sales:', err);
        }

        setDashboardData({
          ...data,
          totalSales: totalSales || data.totalSales,
          averageOrderValue: averageOrderValue || data.averageOrderValue,
          leadsBySource: leadsBySource.length > 0 ? leadsBySource : data.leadsBySource,
          productsByCategory: productsByCategory.length > 0 ? productsByCategory : data.productsByCategory
        });

        setError(null);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);

  const leadsChartData = {
    labels: dashboardData.leadsBySource.map(item => item.source),
    datasets: [
      {
        label: 'Leads by Source',
        data: dashboardData.leadsBySource.map(item => item.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(201, 203, 207, 0.6)'
        ]
      }
    ]
  };

  const productsChartData = {
    labels: dashboardData.productsByCategory.map(item => item.category),
    datasets: [
      {
        label: 'Products by Category',
        data: dashboardData.productsByCategory.map(item => item.value),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(201, 203, 207, 0.6)'
        ]
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto"></div>
          <p className="mt-2 text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 p-3 rounded bg-[#1a2236] text-white shadow-md">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button
          className="bg-white text-[#1a2236] px-3 py-1 rounded flex items-center gap-2 hover:bg-gray-200"
          onClick={() => window.location.reload()}
        >
          ⟳ Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-yellow-100 text-yellow-800 p-3 mb-4 rounded flex items-center gap-2">
          ⚠ {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded shadow-sm bg-[#e9f7fe] border-l-4 border-[#149AD5]">
          <div className="flex justify-between items-center mb-2">
            <h6 className="text-blue-600 font-bold">Total Customers</h6>
            <div className="bg-blue-600 text-white p-2 rounded">
              👥
            </div>
          </div>
          <h3 className="text-2xl font-semibold">{dashboardData.totalCustomers}</h3>
        </div>

        <div className="p-4 rounded shadow-sm bg-[#fff8e5] border-l-4 border-[#FFC107]">
          <div className="flex justify-between items-center mb-2">
            <h6 className="text-yellow-600 font-bold">Total Leads</h6>
            <div className="bg-yellow-600 text-white p-2 rounded">
              ➕
            </div>
          </div>
          <h3 className="text-2xl font-semibold">{dashboardData.totalLeads}</h3>
        </div>

        <div className="p-4 rounded shadow-sm bg-[#ebfaf5] border-l-4 border-[#28C76F]">
          <div className="flex justify-between items-center mb-2">
            <h6 className="text-green-600 font-bold">Total Sales</h6>
            <div className="bg-green-600 text-white p-2 rounded">
              💰
            </div>
          </div>
          <h3 className="text-2xl font-semibold">{formatCurrency(dashboardData.totalSales)}</h3>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded shadow-sm bg-[#feebf1] border-l-4 border-[#EA5455]">
          <div className="flex justify-between items-center mb-2">
            <h6 className="text-red-600 font-bold">Total Opportunities</h6>
            <div className="bg-red-600 text-white p-2 rounded">
              📈
            </div>
          </div>
          <h3 className="text-2xl font-semibold">{dashboardData.totalOpportunities}</h3>
        </div>

        <div className="p-4 rounded shadow-sm bg-gray-200 border-l-4 border-gray-600">
          <div className="flex justify-between items-center mb-2">
            <h6 className="text-gray-600 font-bold">Average Order Value</h6>
            <div className="bg-gray-600 text-white p-2 rounded">
              🛒
            </div>
          </div>
          <h3 className="text-2xl font-semibold">{formatCurrency(dashboardData.averageOrderValue)}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded shadow-sm bg-white">
          <h5 className="text-lg font-semibold mb-3">Leads by Source</h5>
          {dashboardData.leadsBySource.length > 0 ? (
            <div className="h-[280px]">
              <Bar data={leadsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          ) : (
            <p className="text-gray-500 text-center">No lead source data available</p>
          )}
        </div>

        <div className="p-4 rounded shadow-sm bg-white">
          <h5 className="text-lg font-semibold mb-3">Products by Category</h5>
          {dashboardData.productsByCategory.length > 0 ? (
            <div className="h-[280px]">
              <Doughnut data={productsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          ) : (
            <p className="text-gray-500 text-center">No product category data available</p>
          )}
        </div>
      </div>

      {/* Employee Sales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 rounded shadow-sm bg-white">
          <h5 className="text-lg font-semibold mb-3">Sales by Employee</h5>
          {employeeSales.length > 0 ? (
            <div className="h-[280px]">
              <Line
                data={{
                  labels: employeeSales.map(emp => emp.name),
                  datasets: [
                    {
                      label: 'Sales Amount',
                      data: employeeSales.map(emp => emp.salesAmount),
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      borderColor: 'rgb(54, 162, 235)',
                      borderWidth: 2,
                      fill: true,
                      tension: 0.1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center">No employee sales data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
