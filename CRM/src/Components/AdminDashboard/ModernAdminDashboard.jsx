// FILE: src/Components/AdminDashboard/ModernAdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import TicketService from "../../services/TicketService";
import EmployeeService from "../../services/EmployeeService";
import LeadService from "../../services/LeadService";
import CustomerService from "../../services/CustomerService";

// Import existing tab components
import LeadsTab from "./LeadsTab";
import OpportunitiesTab from "./OpportunitiesTab";
import CustomersTab from "./CustomersTab";
import EmployeesTab from "./EmployeesTab";
import EmployeeTicketsTab from "./EmployeeTicketsTab";
import EscalatedTicketsTab from "./EscalatedTicketsTab";

// Import other components for catalog and tickets
import Products from "../Catalog/Products";
import Category from "../Catalog/Category";

const ModernAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'employee'
  
  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    activeLeads: 0,
    totalCustomers: 0,
    allTickets: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!userRole) return; // Don't fetch until we know the user role
      
      try {
        setStatsLoading(true);
        
        // Fetch all stats in parallel using proper services
        const [employees, leads, customers, tickets] = await Promise.all([
          EmployeeService.getAllEmployees(),
          LeadService.getAllLeads(),
          CustomerService.getAllCustomers(),
          TicketService.getAllTickets()
        ]);

        setDashboardStats({
          totalEmployees: Array.isArray(employees) ? employees.length : 0,
          activeLeads: Array.isArray(leads) ? leads.filter(lead => lead.status === 'active' || lead.status === 'new').length : 0,
          totalCustomers: Array.isArray(customers) ? customers.length : 0,
          allTickets: Array.isArray(tickets) ? tickets.filter(t => t.status === 'ESCALATED').length : 0
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setDashboardStats({
          totalEmployees: 0,
          activeLeads: 0,
          totalCustomers: 0,
          allTickets: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [userRole]);

  // Get menu items for admin only
  const getMenuItems = () => {
    const baseItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "📊",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        permission: "full"
      },
      {
        id: "leads",
        label: "Leads",
        icon: "🎯",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        permission: "read"
      },
      {
        id: "customers",
        label: "Customers",
        icon: "👤",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        permission: "read"
      },
      {
        id: "opportunities",
        label: "Opportunities",
        icon: "�",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        permission: "read"
      },
      {
        id: "catalog",
        label: "Catalog",
        icon: "📦",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        permission: "full"
      }
    ];

    // Add role-specific items
    if (userRole === 'admin') {
      baseItems.splice(1, 0, {
        id: "employees",
        label: "Employees",
        icon: "�",
        color: "text-green-600",
        bgColor: "bg-green-50",
        permission: "full"
      });
      baseItems.push({
        id: "tickets",
        label: "Escalated Tickets",
        icon: "�",
        color: "text-red-600",
        bgColor: "bg-red-50",
        permission: "admin"
      });
    } else if (userRole === 'employee') {
      baseItems.push({
        id: "tickets",
        label: "Tickets",
        icon: "🎫",
        color: "text-red-600",
        bgColor: "bg-red-50",
        permission: "employee"
      });
    }

    return baseItems;
  };

  useEffect(() => {
    const checkAuth = () => {
      // Only allow admin access to this dashboard
      if (AuthService.isAdminLoggedIn()) {
        setUserRole('admin');
        setIsLoading(false);
      } else {
        setError("You are not authorized to access the admin dashboard. Please login as admin to continue.");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Get menu items for current user
  const menuItems = getMenuItems();

  const handleLogout = () => {
    // Logout based on user role
    if (userRole === 'admin') {
      AuthService.logoutAdmin();
    } else if (userRole === 'employee') {
      AuthService.logoutEmployee();
    }
    navigate("/login");
  };

  const renderDashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Total Employees</p>
            <p className="text-3xl font-bold">
              {statsLoading ? "..." : dashboardStats.totalEmployees}
            </p>
          </div>
          <div className="text-4xl opacity-80">👥</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Active Leads</p>
            <p className="text-3xl font-bold">
              {statsLoading ? "..." : dashboardStats.activeLeads}
            </p>
          </div>
          <div className="text-4xl opacity-80">🎯</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100">Total Customers</p>
            <p className="text-3xl font-bold">
              {statsLoading ? "..." : dashboardStats.totalCustomers}
            </p>
          </div>
          <div className="text-4xl opacity-80">👤</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100">Escalated Tickets</p>
            <p className="text-3xl font-bold">
              {statsLoading ? "..." : dashboardStats.allTickets}
            </p>
          </div>
          <div className="text-4xl opacity-80">🚨</div>
        </div>
      </div>
    </div>
  );

  const renderCatalogSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Catalog Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">🏷️ Categories</h3>
            <p className="text-gray-600 mb-4">Manage product categories and hierarchies</p>
            <button 
              onClick={() => setActiveSection("categories")}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              Manage Categories
            </button>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">📦 Products</h3>
            <p className="text-gray-600 mb-4">Add, edit, and manage product inventory</p>
            <button 
              onClick={() => setActiveSection("products")}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              Manage Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    const currentItem = menuItems.find(item => item.id === activeSection);
    const isReadOnly = currentItem?.permission === "read";

    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
            {renderDashboardStats()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveSection("employees")}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
                  >
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm font-medium text-blue-700">Manage Employees</div>
                  </button>
                  <button 
                    onClick={() => setActiveSection("leads")}
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
                  >
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm font-medium text-green-700">View Leads</div>
                  </button>
                  <button 
                    onClick={() => setActiveSection("customers")}
                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
                  >
                    <div className="text-2xl mb-2">👤</div>
                    <div className="text-sm font-medium text-purple-700">Manage Customers</div>
                  </button>
                  <button 
                    onClick={() => setActiveSection("tickets")}
                    className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors"
                  >
                    <div className="text-2xl mb-2">🎫</div>
                    <div className="text-sm font-medium text-red-700">View Tickets</div>
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Backend Server</span>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Authentication</span>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Loading</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      statsLoading 
                        ? "bg-yellow-100 text-yellow-600" 
                        : "bg-green-100 text-green-600"
                    }`}>
                      {statsLoading ? "Loading..." : "Complete"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "employees":
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Employee Management</h1>
            <EmployeesTab onError={setError} onSuccess={setSuccessMessage} />
          </div>
        );
      case "leads":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Leads (Read Only)</h1>
              <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                👁️ View Only
              </span>
            </div>
            {isReadOnly && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>Note:</strong> You have read-only access to leads. You can view data but cannot make changes.
                </p>
              </div>
            )}
            <LeadsTab onError={setError} readOnly={isReadOnly} />
          </div>
        );
      case "customers":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Customers (Read Only)</h1>
              <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                👁️ View Only
              </span>
            </div>
            {isReadOnly && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>Note:</strong> You have read-only access to customers. You can view data but cannot make changes.
                </p>
              </div>
            )}
            <CustomersTab onError={setError} readOnly={isReadOnly} />
          </div>
        );
      case "opportunities":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Opportunities (Read Only)</h1>
              <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
                👁️ View Only
              </span>
            </div>
            {isReadOnly && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>Note:</strong> You have read-only access to opportunities. You can view data but cannot make changes.
                </p>
              </div>
            )}
            <OpportunitiesTab onError={setError} readOnly={isReadOnly} />
          </div>
        );
      case "catalog":
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Catalog Management</h1>
            {renderCatalogSection()}
          </div>
        );
      case "categories":
        return (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setActiveSection("catalog")}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back to Catalog
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
            </div>
            <Category />
          </div>
        );
      case "products":
        return (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setActiveSection("catalog")}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back to Catalog
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
            </div>
            <Products />
          </div>
        );
      case "tickets":
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Escalated Tickets</h1>
            <EscalatedTicketsTab onError={setError} />
          </div>
        );
      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Section Not Found</h2>
            <p className="text-yellow-700">The requested section could not be found.</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-red-100 border border-red-300 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                <p className="text-sm text-gray-500">CREMIx System</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? `${item.bgColor} ${item.color} border-l-4 border-current`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <span className="font-medium">{item.label}</span>
                  {item.permission === 'read' && (
                    <div className="text-xs opacity-75">View Only</div>
                  )}
                  {item.permission === 'escalated' && (
                    <div className="text-xs opacity-75">Admin Only</div>
                  )}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Administrator</p>
                  <p className="text-xs text-gray-500">admin@gmail.com</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              🚪
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
              <span className="text-green-800">{successMessage}</span>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-800"
              >
                ✕
              </button>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
              <span className="text-red-800">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ModernAdminDashboard;
