// These are the main React and routing tools we use
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout and authentication components for consistent pages and secure access
import MainLayout from './Components/MainLayout/MainLayout';           // Keeps every page looking the same
import ProtectedRoute from './Components/common/ProtectedRoute';       // Only lets logged-in users see private pages
import EmployeeRedirect from './Components/common/EmployeeRedirect';   // Sends users to the right dashboard based on their role

// Authentication: Login, register, and reset password features
import Login from './Components/Auth/login';                           // The main login screen
import CustomerRegister from './Components/Auth/CustomerRegister';     // Where customers can sign themselves up
import ResetPassword from './Components/Auth/ResetPassword';           // For users who forgot their password

// Customer Portal: Everything customers see and use
import CustomerDashboard from './Components/CustomerDashboard/CustomerDashboard';  // The main dashboard for customers

// Lead Management: Track and manage sales leads
import ManageLeads from './Components/Leads/ManageLeads';              // Where you manage all your leads
import LeadsRecycleBin from './Components/Leads/LeadRecycleBin';       // Restore deleted leads here
import LeadViewDetails from './Components/Leads/LeadViewDetails';      // See details about a specific lead
import ModernLeadsPage from './Components/Leads/ModernLeadsPage';      // A fresh, modern look for leads

// Opportunity Management: Track deals and forecast sales
import ManageOpportunity from './Components/Opportunity/ManageOpportunity';         // Manage all your sales opportunities
import OpportunityRecycleBin from './Components/Opportunity/OpportunityRecycleBin'; // Restore deleted opportunities
import OpportunityViewDetails from './Components/Opportunity/OpportunityViewDetails'; // See details about a specific opportunity

// Product Catalog: Manage products and services
import Category from './Components/Catalog/Category';                  // Organize products into categories
import Products from './Components/Catalog/Products';                  // Manage all products here

// Customer Management: Build and maintain customer relationships
import ManageCustomers from './Components/Customer/ManageCustomers';            // Manage all your customers here
import CustomerRecycleBin from './Components/Customer/CustomerRecycleBin';      // Restore deleted customers
import CustomersViewDetails from './Components/Customer/CustomerViewDetails';   // See details about a specific customer
import ModernCustomersPage from './Components/Customer/ModernCustomersPage';    // A modern look for customer management

// Ticket System: Help customers and track issues
import Tickets from './Components/Tickets/Tickets';                    // See all support tickets
import OpenTickets from './Components/Tickets/OpenTickets';            // View new or unassigned tickets
import MyTickets from './Components/Tickets/MyTickets';                // See tickets assigned to you
import InProgressTickets from './Components/Tickets/InProgressTickets'; // Track tickets that are being worked on
import ClosedTickets from './Components/Tickets/ClosedTickets';        // Browse through completed tickets

// Dashboards: Get an overview and analytics for the system
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
            <MainLayout>
              <EmployeeRedirect>
                <Navigate to="/customer/dashboard" replace />
              </EmployeeRedirect>
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Employee/Admin Routes */}
        <Route path="/tickets" element={
          <ProtectedRoute>
            <MainLayout>
              <Tickets />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tickets/open" element={
          <ProtectedRoute>
            <MainLayout>
              <OpenTickets />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tickets/my" element={
          <ProtectedRoute>
            <MainLayout>
              <MyTickets />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tickets/in-progress" element={
          <ProtectedRoute>
            <MainLayout>
              <InProgressTickets />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tickets/closed" element={
          <ProtectedRoute>
            <MainLayout>
              <ClosedTickets />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/leads" element={
          <ProtectedRoute>
            <MainLayout>
              <ModernLeadsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/leads/manage" element={
          <ProtectedRoute>
            <MainLayout>
              <ManageLeads />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/leads/recycle-bin" element={
          <ProtectedRoute>
            <MainLayout>
              <LeadsRecycleBin />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/leads/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <LeadViewDetails />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/opportunities" element={
          <ProtectedRoute>
            <MainLayout>
              <ManageOpportunity />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/opportunities/recycle-bin" element={
          <ProtectedRoute>
            <MainLayout>
              <OpportunityRecycleBin />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/opportunities/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <OpportunityViewDetails />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/customers" element={
          <ProtectedRoute>
            <MainLayout>
              <ModernCustomersPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/customers/manage" element={
          <ProtectedRoute>
            <MainLayout>
              <ManageCustomers />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/customers/recycle-bin" element={
          <ProtectedRoute>
            <MainLayout>
              <CustomerRecycleBin />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/customers/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <CustomersViewDetails />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/catalog/categories" element={
          <ProtectedRoute>
            <MainLayout>
              <Category />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/catalog/products" element={
          <ProtectedRoute>
            <MainLayout>
              <Products />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <ModernDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <CustomerDashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
