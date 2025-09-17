import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ModernDataTable from '../common/ModernDataTable';
import { Modal } from '../common/ui/Base.jsx';
import { Toast } from '../common/ui/Toast.jsx';
import { Spinner } from '../common/ui/Spinner.jsx';
import { Card } from '../common/ui/Base.jsx';

const EmployeesTab = ({ onError, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await fetch("http://localhost:8080/api/employees");
      if (!response.ok) throw new Error("Failed to fetch employees");

      const data = await response.json();
      setEmployees(data);
      setToast({
        open: true,
        message: 'Employees refreshed successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error("Error fetching employees:", err);
      setToast({
        open: true,
        message: 'Failed to fetch employees. Please try again later.',
        type: 'error'
      });
      if (onError) onError("Failed to fetch employees. Please try again later.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    const loadInitialEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const response = await fetch("http://localhost:8080/api/employees");
        if (!response.ok) throw new Error("Failed to fetch employees");

        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setToast({
          open: true,
          message: 'Failed to fetch employees. Please try again later.',
          type: 'error'
        });
        if (onError) onError("Failed to fetch employees. Please try again later.");
      } finally {
        setLoadingEmployees(false);
      }
    };
    
    loadInitialEmployees();
  }, [onError]);

  const handleCreateEmployee = async () => {
    const errors = {};
    
    // Name validation
    if (!newEmployee.name) {
      errors.name = "Name is required";
    } else if (newEmployee.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }
    
    // Email validation
    if (!newEmployee.email) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmployee.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    
    // Phone validation (matches backend pattern: ^(\+?\d{2})?[0-9]{10}$)
    if (!newEmployee.phone) {
      errors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^(\+?\d{2})?[0-9]{10}$/;
      if (!phoneRegex.test(newEmployee.phone)) {
        errors.phone = "Phone number must be 10 digits, optionally with 2-digit country code";
      }
    }
    
    // Password validation
    if (!newEmployee.password) {
      errors.password = "Password is required";
    } else if (newEmployee.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    
    if (newEmployee.password !== newEmployee.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newEmployee.name,
          email: newEmployee.email,
          phone: newEmployee.phone,
          hashedPassword: newEmployee.password,
        }),
      });

      if (!response.ok) {
        // Get detailed error message from response
        let errorMessage = "Failed to create employee";
        try {
          const errorData = await response.text();
          console.error("API Error Response:", errorData);
          errorMessage = `Failed to create employee (${response.status}): ${errorData}`;
        } catch {
          errorMessage = `Failed to create employee (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const newEmployeeData = await response.json();
      setEmployees([...employees, newEmployeeData]);
      setToast({
        open: true,
        message: 'Employee created successfully!',
        type: 'success'
      });
      if (onSuccess) onSuccess("Employee created successfully!");
      setShowEmployeeModal(false);
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setFormErrors({});
    } catch (err) {
      console.error("Error creating employee:", err);
      const errorMessage = err.message || 'Failed to create employee. Please try again.';
      setToast({
        open: true,
        message: errorMessage,
        type: 'error'
      });
      if (onError) onError(errorMessage);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee({
      id: employee.id,
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      password: "",
      confirmPassword: "",
    });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async () => {
    // Professional validation with detailed feedback
    const errors = {};
    
    // Name validation
    if (!editingEmployee.name || editingEmployee.name.trim() === "") {
      errors.name = "Full name is required";
    } else if (editingEmployee.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s]+$/.test(editingEmployee.name.trim())) {
      errors.name = "Name can only contain letters and spaces";
    }
    
    // Email validation
    if (!editingEmployee.email || editingEmployee.email.trim() === "") {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingEmployee.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (!editingEmployee.phone || editingEmployee.phone.trim() === "") {
      errors.phone = "Phone number is required";
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(editingEmployee.phone.replace(/[\s\-()]/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }

    // Password validation only if new password is provided
    if (editingEmployee.password && editingEmployee.password.trim() !== "") {
      if (editingEmployee.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(editingEmployee.password)) {
        errors.password = "Password must contain uppercase, lowercase, and number";
      }
      
      if (!editingEmployee.confirmPassword || editingEmployee.confirmPassword.trim() === "") {
        errors.confirmPassword = "Please confirm your new password";
      } else if (editingEmployee.password !== editingEmployee.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else if (editingEmployee.confirmPassword && editingEmployee.confirmPassword.trim() !== "") {
      errors.password = "Please enter a new password first";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Smooth scroll to first error
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.border-red-400');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorElement.focus();
        }
      }, 100);
      return;
    }

    try {
      // Create update data object with trimmed values
      const updateData = {
        name: editingEmployee.name.trim(),
        email: editingEmployee.email.trim().toLowerCase(),
        phone: editingEmployee.phone.trim(),
      };

      // Only include password if it's being changed
      if (editingEmployee.password && editingEmployee.password.trim() !== "") {
        updateData.hashedPassword = editingEmployee.password;
      }

      const response = await fetch(`http://localhost:8080/api/employees/${editingEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update employee");

      const updatedEmployee = await response.json();
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? updatedEmployee : emp
      ));
      
      // Professional success feedback
      setToast({
        open: true,
        message: '✅ Employee profile updated successfully!',
        type: 'success'
      });
      
      if (onSuccess) onSuccess("Employee updated successfully!");
      setShowEditModal(false);
      setEditingEmployee(null);
      setFormErrors({});
    } catch (err) {
      console.error("Error updating employee:", err);
      setToast({
        open: true,
        message: '❌ Failed to update employee. Please check your information and try again.',
        type: 'error'
      });
      if (onError) onError("Failed to update employee. Please try again.");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/employees/${employeeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete employee");

      setEmployees(
        employees.filter((employee) => employee.id !== employeeId)
      );
      setToast({
        open: true,
        message: 'Employee deleted successfully!',
        type: 'success'
      });
      if (onSuccess) onSuccess("Employee deleted successfully!");
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error("Error deleting employee:", err);
      setToast({
        open: true,
        message: 'Failed to delete employee. Please try again.',
        type: 'error'
      });
      if (onError) onError("Failed to delete employee. Please try again.");
    }
  };

  const confirmDelete = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setShowDeleteModal(true);
  };

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const exportData = employees.map((employee) => ({
        ID: employee.id || "",
        Name: employee.name || "",
        Email: employee.email || "",
        "Phone Number": employee.phoneNumber || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const currentDate = new Date().toISOString().split("T")[0];
      saveAs(data, `Employees_Export_${currentDate}.xlsx`);

      setToast({
        open: true,
        message: 'Employees exported to Excel successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      setToast({
        open: true,
        message: 'Failed to export employees to Excel.',
        type: 'error'
      });
      if (onError) onError("Failed to export employees to Excel.");
    } finally {
      setExportLoading(false);
    }
  };

  // Transform employees data for the table
  const employeesData = employees.map(employee => ({
    id: employee.id,
    name: employee.name || 'N/A',
    email: employee.email || 'N/A',
    phone: employee.phoneNumber || 'N/A',
    createdAt: employee.createdAt || new Date().toISOString().split('T')[0]
  }));

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-muted">{row.email}</div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone'
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  if (loadingEmployees) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8 animate-slideUp">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Employees
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your employee database with modern tools</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchEmployees}
            disabled={loadingEmployees}
            className="px-5 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            {loadingEmployees ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            Refresh
          </button>
          <button
            onClick={exportToExcel}
            disabled={exportLoading}
            className="px-5 py-3 border-2 border-green-300 text-green-700 rounded-xl hover:bg-green-50 hover:border-green-400 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            {exportLoading ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Export Excel
          </button>
          <button 
            onClick={() => setShowEmployeeModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Employee
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Employees</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{employees.length}</p>
              <p className="text-xs text-blue-600 mt-1">All registered employees</p>
            </div>
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Active Today</p>
              <p className="text-3xl font-bold text-green-900 mt-2">0</p>
              <p className="text-xs text-green-600 mt-1">Currently online</p>
            </div>
            <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">New This Month</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {employees.filter(e => {
                  const empDate = new Date(e.createdAt || new Date());
                  const thisMonth = new Date();
                  return empDate.getMonth() === thisMonth.getMonth() && 
                         empDate.getFullYear() === thisMonth.getFullYear();
                }).length}
              </p>
              <p className="text-xs text-purple-600 mt-1">Recently added</p>
            </div>
            <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {loadingEmployees && employees.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Spinner className="w-12 h-12 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Loading employees...</p>
            </div>
          </div>
        ) : (
          <ModernDataTable
            data={employeesData}
            columns={columns}
            title="All Employees"
            onEdit={handleEditEmployee}
            onDelete={confirmDelete}
            searchable={true}
          />
        )}
      </div>

      {/* Create Employee Modal */}
      <Modal open={showEmployeeModal} onClose={() => setShowEmployeeModal(false)}>
        <div className="p-8 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Create New Employee</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["name", "email", "phone", "password", "confirmPassword"].map(
              (field) => (
                <div key={field} className={field.includes("password") ? "md:col-span-1" : ""}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace("Password", " Password")}
                  </label>
                  <div className="relative">
                    <input
                      type={field.includes("password") ? "password" : "text"}
                      value={newEmployee[field]}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, [field]: e.target.value })
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                        formErrors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      placeholder={`Enter ${field.charAt(0).toLowerCase() + field.slice(1).replace("Password", " password")}`}
                    />
                    {field.includes("password") && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors[field] && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formErrors[field]}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
          
          <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowEmployeeModal(false);
                setNewEmployee({
                  name: "",
                  email: "",
                  phone: "",
                  password: "",
                  confirmPassword: "",
                });
                setFormErrors({});
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateEmployee}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Employee
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="bg-white rounded-lg w-full max-w-2xl mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-lg font-semibold text-gray-900">Edit Employee</h2>
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingEmployee(null);
                setFormErrors({});
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4">
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateEmployee(); }}>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEmployee ? editingEmployee.name : ""}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                    {/* Phone and Email in same row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={editingEmployee ? editingEmployee.phone : ""}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {formErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={editingEmployee ? editingEmployee.email : ""}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.email ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                        )}
                      </div>
                    </div>

                {/* Password fields in same row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                      <span className="text-gray-400 text-xs ml-1">(leave blank to keep current)</span>
                    </label>
                    <input
                      type="password"
                      value={editingEmployee ? editingEmployee.password || "" : ""}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, password: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={editingEmployee ? editingEmployee.confirmPassword || "" : ""}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, confirmPassword: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Status and Role in same row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editingEmployee ? editingEmployee.status || "Active" : "Active"}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={editingEmployee ? editingEmployee.role || "Employee" : "Employee"}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingEmployee(null);
                      setFormErrors({});
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Update Employee
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-center p-8 bg-gradient-to-br from-white to-red-50">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Delete Employee</h3>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Are you sure you want to delete this employee? This action cannot be undone and will permanently remove all employee data.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteEmployee(employeeToDelete)}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Delete Employee
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        open={toast.open}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      />
      </div>
    </div>
  );
};

export default EmployeesTab;
