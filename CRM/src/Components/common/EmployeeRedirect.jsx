// FILE: src/Components/common/EmployeeRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const EmployeeRedirect = ({ children }) => {
  // If user is an employee, redirect them to the unified dashboard
  if (AuthService.isEmployeeLoggedIn()) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // If not an employee (customer), show the original component
  return children;
};

export default EmployeeRedirect;