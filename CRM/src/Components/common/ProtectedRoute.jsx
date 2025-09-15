import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const ProtectedRoute = ({ children, roles = [] }) => {
  // Check if any user is logged in
  const isEmployeeLoggedIn = AuthService.isEmployeeLoggedIn && AuthService.isEmployeeLoggedIn();
  const isCustomerLoggedIn = AuthService.isCustomerLoggedIn();
  const isAdminLoggedIn = AuthService.isAdminLoggedIn();
  
  const isAuthenticated = isEmployeeLoggedIn || isCustomerLoggedIn || isAdminLoggedIn;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has required role
  if (roles.length > 0) {
    let hasRequiredRole = false;
    
    if (roles.includes('admin') && isAdminLoggedIn) {
      hasRequiredRole = true;
    }
    if (roles.includes('employee') && isEmployeeLoggedIn) {
      hasRequiredRole = true;
    }
    if (roles.includes('customer') && isCustomerLoggedIn) {
      hasRequiredRole = true;
    }
    
    if (!hasRequiredRole) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
