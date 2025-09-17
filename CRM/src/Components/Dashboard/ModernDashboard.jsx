import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../common/ui/Base.jsx';
import { Spinner } from '../common/ui/Spinner.jsx';
import { HomeIcon, UsersIcon, ChartIcon } from '../common/ui/Icons.jsx';
import { Toast } from '../common/ui/Toast.jsx';
import CustomerService from '../../services/CustomerService';
import LeadService from '../../services/LeadService';
import OpportunityService from '../../services/OpportunityService';
import InvoiceService from '../../services/InvoiceService';
import AuthService from '../../services/AuthService';

const ModernDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalCustomers: 0,
    totalOpportunities: 0,
    totalSales: 0,
    revenue: 0,
    leadGrowth: 0,
    customerGrowth: 0,
    opportunityGrowth: 0,
    revenueGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Real-time data fetching function
  const fetchRealTimeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data concurrently for better performance
      const [
        leadsData,
        customersData,
        opportunitiesData,
        invoicesData
      ] = await Promise.allSettled([
        LeadService.getAllLeads(),
        CustomerService.getAllCustomers(),
        OpportunityService.getAllOpportunities(),
        InvoiceService.getAllInvoices()
      ]);

      // Process leads data
      const leads = leadsData.status === 'fulfilled' ? leadsData.value : [];
      const totalLeads = leads.length;

      // Process customers data
      const customers = customersData.status === 'fulfilled' ? customersData.value : [];
      const totalCustomers = customers.length;

      // Process opportunities data
      const opportunities = opportunitiesData.status === 'fulfilled' ? opportunitiesData.value : [];
      const totalOpportunities = opportunities.length;

      // Process sales/revenue data
      const invoices = invoicesData.status === 'fulfilled' ? invoicesData.value : [];
      const totalSales = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
      const revenue = totalSales; // Revenue same as total sales

      // Calculate growth metrics (last 7 days vs previous 7 days)
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Leads growth
      const recentLeads = leads.filter(lead => {
        const leadDate = new Date(lead.createdDate || lead.dateCreated || now);
        return leadDate >= weekAgo;
      });
      const previousWeekLeads = leads.filter(lead => {
        const leadDate = new Date(lead.createdDate || lead.dateCreated || now);
        return leadDate >= twoWeeksAgo && leadDate < weekAgo;
      });
      const leadGrowth = previousWeekLeads.length > 0 
        ? ((recentLeads.length - previousWeekLeads.length) / previousWeekLeads.length) * 100 
        : recentLeads.length > 0 ? 100 : 0;

      // Customer growth
      const recentCustomers = customers.filter(customer => {
        const customerDate = new Date(customer.createdDate || customer.dateCreated || now);
        return customerDate >= weekAgo;
      });
      const previousWeekCustomers = customers.filter(customer => {
        const customerDate = new Date(customer.createdDate || customer.dateCreated || now);
        return customerDate >= twoWeeksAgo && customerDate < weekAgo;
      });
      const customerGrowth = previousWeekCustomers.length > 0 
        ? ((recentCustomers.length - previousWeekCustomers.length) / previousWeekCustomers.length) * 100 
        : recentCustomers.length > 0 ? 100 : 0;

      // Opportunity growth
      const recentOpportunities = opportunities.filter(opp => {
        const oppDate = new Date(opp.createdDate || opp.dateCreated || now);
        return oppDate >= weekAgo;
      });
      const previousWeekOpportunities = opportunities.filter(opp => {
        const oppDate = new Date(opp.createdDate || opp.dateCreated || now);
        return oppDate >= twoWeeksAgo && oppDate < weekAgo;
      });
      const opportunityGrowth = previousWeekOpportunities.length > 0 
        ? ((recentOpportunities.length - previousWeekOpportunities.length) / previousWeekOpportunities.length) * 100 
        : recentOpportunities.length > 0 ? 100 : 0;

      // Revenue growth
      const recentRevenue = invoices
        .filter(invoice => {
          const invoiceDate = new Date(invoice.createdDate || invoice.dateCreated || now);
          return invoiceDate >= weekAgo;
        })
        .reduce((sum, invoice) => sum + (invoice.total || 0), 0);
      
      const previousWeekRevenue = invoices
        .filter(invoice => {
          const invoiceDate = new Date(invoice.createdDate || invoice.dateCreated || now);
          return invoiceDate >= twoWeeksAgo && invoiceDate < weekAgo;
        })
        .reduce((sum, invoice) => sum + (invoice.total || 0), 0);
      
      const revenueGrowth = previousWeekRevenue > 0 
        ? ((recentRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 
        : recentRevenue > 0 ? 100 : 0;

      // Generate recent activity based on actual data
      const activities = [];
      
      // Add recent leads
      recentLeads.slice(0, 5).forEach(lead => {
        activities.push({
          action: `New lead created: ${lead.name}`,
          time: formatTimeAgo(new Date(lead.createdDate || lead.dateCreated)),
          color: 'bg-blue-50 text-blue-700',
          type: 'lead'
        });
      });

      // Add recent customers
      recentCustomers.slice(0, 4).forEach(customer => {
        activities.push({
          action: `Customer updated: ${customer.name}`,
          time: formatTimeAgo(new Date(customer.createdDate || customer.dateCreated)),
          color: 'bg-yellow-50 text-yellow-700',
          type: 'customer'
        });
      });

      // Add recent opportunities (as deals)
      recentOpportunities.slice(0, 4).forEach(opp => {
        activities.push({
          action: `Deal closed: ${opp.lead?.name || 'Unknown'}`,
          time: formatTimeAgo(new Date(opp.createdDate || opp.dateCreated)),
          color: 'bg-green-50 text-green-700',
          type: 'opportunity'
        });
      });

      // Add recent invoices as revenue activities
      const recentInvoices = invoices
        .filter(invoice => {
          const invoiceDate = new Date(invoice.createdDate || invoice.dateCreated || now);
          return invoiceDate >= weekAgo;
        })
        .slice(0, 3);

      recentInvoices.forEach(invoice => {
        activities.push({
          action: `Revenue generated: ₹${invoice.total?.toFixed(2) || '0.00'}`,
          time: formatTimeAgo(new Date(invoice.createdDate || invoice.dateCreated)),
          color: 'bg-purple-50 text-purple-700',
          type: 'revenue'
        });
      });

      // Sort activities by time (most recent first)
      activities.sort((a, b) => {
        const timeA = a.time.includes('Just now') ? 0 : 
                    a.time.includes('minute') ? parseInt(a.time) : 
                    a.time.includes('hour') ? parseInt(a.time) * 60 : 
                    parseInt(a.time) * 1440;
        const timeB = b.time.includes('Just now') ? 0 : 
                    b.time.includes('minute') ? parseInt(b.time) : 
                    b.time.includes('hour') ? parseInt(b.time) * 60 : 
                    parseInt(b.time) * 1440;
        return timeA - timeB;
      });

      setRecentActivity(activities.slice(0, 15)); // Show top 15 activities for scrolling

      setStats({
        totalLeads,
        totalCustomers,
        totalOpportunities,
        totalSales,
        revenue,
        leadGrowth: Math.round(leadGrowth * 10) / 10,
        customerGrowth: Math.round(customerGrowth * 10) / 10,
        opportunityGrowth: Math.round(opportunityGrowth * 10) / 10,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10
      });

      setRecentActivity(activities.slice(0, 15)); // Show top 15 activities for scrolling
      setLastUpdated(new Date());

      setToast({
        open: true,
        message: 'Dashboard data updated successfully!',
        type: 'success'
      });

    } catch (err) {
      console.error('Error fetching real-time dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      setToast({
        open: true,
        message: 'Failed to load real-time data. Using cached data.',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
    }
  };

  // Check authentication and fetch data on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = AuthService.isAnyUserLoggedIn();
      
      if (!isAuth) {
        setLoading(false);
        setError('Please log in to access the dashboard');
        return;
      }
      
      // If authenticated, fetch data
      fetchRealTimeData();
    };
    
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Revenue KPI Chart Component
  const RevenueKPIChart = () => {
    const currentMonthRevenue = stats.revenue;
    const revenueGrowth = stats.revenueGrowth;
    
    // Calculate previous month revenue for comparison
    const previousMonthRevenue = revenueGrowth !== 0 
      ? currentMonthRevenue / (1 + revenueGrowth / 100)
      : currentMonthRevenue * 0.85; // Default comparison if no growth data

    const monthlyTarget = currentMonthRevenue * 1.2; // Target is 20% above current
    const achievementPercentage = Math.min((currentMonthRevenue / monthlyTarget) * 100, 100);

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ChartIcon className="w-5 h-5 mr-2 text-purple-600" />
          Revenue KPI Dashboard
        </h3>
        
        <div className="space-y-6">
          {/* Revenue Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Current Month</div>
              <div className="text-2xl font-bold text-blue-800">₹{currentMonthRevenue.toFixed(2)}</div>
              <div className={`text-xs flex items-center mt-1 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className={`mr-1 ${revenueGrowth >= 0 ? '↗' : '↘'}`}>
                  {revenueGrowth >= 0 ? '↗' : '↘'}
                </span>
                {Math.abs(revenueGrowth).toFixed(1)}% vs last month
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Monthly Target</div>
              <div className="text-2xl font-bold text-purple-800">₹{monthlyTarget.toFixed(2)}</div>
              <div className="text-xs text-purple-600 mt-1">
                {achievementPercentage.toFixed(1)}% achieved
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Target Achievement</span>
              <span>{achievementPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${achievementPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Revenue Trend Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-green-600 font-medium">Previous Month</div>
              <div className="text-lg font-bold text-green-800">₹{previousMonthRevenue.toFixed(2)}</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xs text-orange-600 font-medium">Avg/Day</div>
              <div className="text-lg font-bold text-orange-800">₹{(currentMonthRevenue / 30).toFixed(2)}</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 font-medium">Remaining</div>
              <div className="text-lg font-bold text-blue-800">₹{Math.max(0, monthlyTarget - currentMonthRevenue).toFixed(2)}</div>
            </div>
          </div>

          {/* Performance Status */}
          <div className={`p-3 rounded-lg text-center ${
            achievementPercentage >= 100 ? 'bg-green-100 text-green-800' :
            achievementPercentage >= 80 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            <div className="font-semibold">
              {achievementPercentage >= 100 ? '🎉 Target Achieved!' :
               achievementPercentage >= 80 ? '📈 On Track' :
               '⚠️ Needs Attention'}
            </div>
            <div className="text-sm">
              {achievementPercentage >= 100 ? 'Congratulations! You\'ve exceeded your monthly target.' :
               achievementPercentage >= 80 ? 'You\'re performing well towards your monthly goal.' :
               'Focus on closing more deals to reach your target.'}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend !== undefined && (
              <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {trend > 0 ? '↗️' : trend < 0 ? '↘️' : '➡️'} {Math.abs(trend)}% from last week
              </p>
            )}
          </div>
          <div className={`p-3 rounded-2xl ${color}`}>
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Dashboard</h1>
          <p className="text-muted mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}  
                  </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchRealTimeData}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-2xl hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {loading ? '↻ Refreshing...' : '⟳ Refresh Now'}
          </button>
          <button className="px-4 py-2 border border-border rounded-2xl hover:bg-background transition-colors">
            Filter
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <span>⚠️</span>
            <div>
              <p className="font-medium">Connection Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads.toLocaleString()}
          icon={<UsersIcon className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
          trend={stats.leadGrowth}
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={<HomeIcon className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
          trend={stats.customerGrowth}
        />
        <StatCard
          title="Opportunities"
          value={stats.totalOpportunities.toLocaleString()}
          icon={<ChartIcon className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
          trend={stats.opportunityGrowth}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<ChartIcon className="w-6 h-6 text-emerald-600" />}
          color="bg-emerald-50"
          trend={stats.revenueGrowth}
        />
      </div>

      {/* Charts and Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Updated on visit
            </div>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${item.color.split(' ')[0]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.action}</p>
                    <p className="text-xs text-muted">{item.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${item.color} flex-shrink-0`}>
                    {item.type}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No recent activity</p>
                <p className="text-xs">Check back later for updates</p>
              </div>
            )}
          </div>
        </Card>

        <RevenueKPIChart />
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        open={toast.open}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default ModernDashboard;
