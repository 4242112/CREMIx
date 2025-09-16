/**
 * App.jsx
 * 
 * MAIN APPLICATION COMPONENT: CREMIx CRM System
 * 
 * PURPOSE:
 * - Root component defining application structure and routing
 * - Manages authentication flow and route protection
 * - Defines the main navigation structure for different user roles
 * - Integrates all major system modules: Customer Management, Lead Management, 
 *   Opportunity Tracking, Ticket Support, Product Catalog, and Admin Dashboard
 * 
 * ARCHITECTURE:
 * - React Router for client-side navigation
 * - MainLayout wrapper providing consistent UI structure
 * - ProtectedRoute for authentication-based access control
 * - Role-based routing for Employee, Customer, and Admin interfaces
 * 
 * USER FLOWS:
 * 1. AUTHENTICATION: /login → User authentication → Role-based redirect
 * 2. CUSTOMER PORTAL: /customer/* → Customer dashboard and ticket management
 * 3. EMPLOYEE INTERFACE: /tickets/*, /leads/*, /customers/* → Work management
 * 4. ADMIN DASHBOARD: /admin/* → System administration and analytics
 * 
 * MAJOR MODULES:
 * - Customer Management: Customer data, communication history, service records
 * - Lead Management: Sales pipeline, lead tracking, conversion workflows  
 * - Opportunity Management: Sales opportunities, deal tracking, revenue forecasting
 * - Ticket System: Customer support, issue tracking, resolution workflows
 * - Product Catalog: Product/service management, categorization, pricing
 * - Admin Dashboard: System oversight, analytics, user management
 * 
 * INTEGRATION POINTS:
 * - AuthService: User authentication and session management
 * - TicketService: Support ticket workflow and customer communication
 * - CustomerService: Customer data management and relationship tracking
 * - LeadService: Sales pipeline and opportunity management
 * - ChatBot: Automated customer support and ticket creation
 * 
 * ROUTING STRATEGY:
 * - Public routes: /login, /register, /reset-password
 * - Protected routes: All business functionality requiring authentication
 * - Role-based access: Different interfaces for customers vs employees
 * - Legacy redirects: Maintain backward compatibility for existing bookmarks
 */

// Core React and routing dependencies
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout and authentication components
import MainLayout from './Components/MainLayout/MainLayout';           // Consistent page structure
import ProtectedRoute from './Components/common/ProtectedRoute';       // Authentication guard
import EmployeeRedirect from './Components/common/EmployeeRedirect';   // Role-based navigation

// AUTHENTICATION MODULE - User login, registration, password management
import Login from './Components/Auth/login';                           // Main login interface
import CustomerRegister from './Components/Auth/CustomerRegister';     // Customer self-registration
import ResetPassword from './Components/Auth/ResetPassword';           // Password recovery

// CUSTOMER PORTAL - Customer-facing interfaces
import CustomerDashboard from './Components/CustomerDashboard/CustomerDashboard';  // Customer main page

// LEAD MANAGEMENT MODULE - Sales pipeline and lead tracking
import ManageLeads from './Components/Leads/ManageLeads';              // Lead management interface
import LeadsRecycleBin from './Components/Leads/LeadRecycleBin';       // Deleted lead recovery
import LeadViewDetails from './Components/Leads/LeadViewDetails';      // Individual lead details
import ModernLeadsPage from './Components/Leads/ModernLeadsPage';      // Modern lead interface

// OPPORTUNITY MANAGEMENT MODULE - Deal tracking and sales forecasting
import ManageOpportunity from './Components/Opportunity/ManageOpportunity';         // Opportunity management
import OpportunityRecycleBin from './Components/Opportunity/OpportunityRecycleBin'; // Deleted opportunity recovery
import OpportunityViewDetails from './Components/Opportunity/OpportunityViewDetails'; // Opportunity details

// PRODUCT CATALOG MODULE - Product and service management
import Category from './Components/Catalog/Category';                  // Category management
import Products from './Components/Catalog/Products';                  // Product management

// CUSTOMER MANAGEMENT MODULE - Customer relationship management
import ManageCustomers from './Components/Customer/ManageCustomers';            // Customer management interface
import CustomerRecycleBin from './Components/Customer/CustomerRecycleBin';      // Deleted customer recovery
import CustomersViewDetails from './Components/Customer/CustomerViewDetails';   // Customer detail view
import ModernCustomersPage from './Components/Customer/ModernCustomersPage';    // Modern customer interface

// TICKET SYSTEM MODULE - Customer support and issue tracking
import Tickets from './Components/Tickets/Tickets';                    // General ticket interface
import OpenTickets from './Components/Tickets/OpenTickets';            // New/unassigned tickets
import MyTickets from './Components/Tickets/MyTickets';                // Employee's assigned tickets
import InProgressTickets from './Components/Tickets/InProgressTickets'; // Active work tickets
import ClosedTickets from './Components/Tickets/ClosedTickets';        // Completed ticket history

// DASHBOARD MODULES - Analytics and system overview
import ModernAdminDashboard from './Components/AdminDashboard/ModernAdminDashboard'; // Admin system overview
import ModernDashboard from './Components/Dashboard/ModernDashboard';                // Employee dashboard

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES - No authentication required */}
        <Route path="/login" element={<Login />} />
        
        {/* LEGACY REDIRECTS - Maintain backward compatibility */}
        <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Customer Register Route - outside MainLayout */}
        <Route path="/register" element={<CustomerRegister />} />
        
        {/* Reset Password Route - outside MainLayout */}
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Admin Dashboard Route - outside MainLayout for dedicated admin interface */}
        <Route path="/admin/dashboard" element={<ModernAdminDashboard />} />
        
        {/* Protected Routes - inside MainLayout */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route index element={<ModernDashboard />} />
          <Route path="dashboard" element={<ModernDashboard />} />
          
          {/* Customer Portal Route - moved inside MainLayout */}
          <Route path="customer-portal" element={<CustomerDashboard />} />
          
          {/* Leads Routes */}
          <Route path="leads" element={<ModernLeadsPage />} />
          <Route path="leads/manage" element={<ManageLeads />} />
          <Route path="leads/recycle-bin" element={<LeadsRecycleBin />} />
          <Route path="leads/:id" element={<LeadViewDetails />} />
          
          {/* Customers Routes */}
          <Route path="customers" element={<ModernCustomersPage />} />
          <Route path="customer/manage" element={<ManageCustomers />} />
          <Route path="customer/recycle-bin" element={<CustomerRecycleBin />} />
          <Route path="customer/:id" element={<CustomersViewDetails />} />
          
          {/* Opportunity Routes */}
          <Route path="opportunity/manage" element={<ManageOpportunity />} />
          <Route path="opportunity/recycle-bin" element={<OpportunityRecycleBin />} />
          <Route path="opportunity/:id" element={<OpportunityViewDetails />} />
          
          {/* Catalog Routes */}
          <Route path="catalog" element={<ModernDashboard />} />
          <Route path="catalog/products" element={<Products />} />
          <Route path="catalog/category" element={<Category />} />
          
          {/* Tickets Route - For employees in MainLayout */}
          <Route path="tickets" element={<Tickets />} />
          <Route path="tickets/open" element={<OpenTickets />} />
          <Route path="tickets/my-tickets" element={<MyTickets />} />
          <Route path="tickets/in-progress-tickets" element={<InProgressTickets />} />
          <Route path="tickets/closed" element={<ClosedTickets />} />
          
          {/* Catch all - redirect to login */}
          <Route path="/*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
