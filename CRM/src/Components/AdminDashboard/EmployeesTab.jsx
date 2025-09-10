import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Pagination from "../common/Pagination";

const EmployeesTab = ({ onError, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
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

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const results = employees.filter((employee) =>
      Object.values(employee).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredEmployees(results);
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await fetch("http://localhost:8080/api/employees");
      if (!response.ok) throw new Error("Failed to fetch employees");

      const data = await response.json();
      setEmployees(data);
      onError("");
    } catch (err) {
      console.error("Error fetching employees:", err);
      onError("Failed to fetch employees. Please try again later.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleCreateEmployee = async () => {
    const errors = {};
    if (!newEmployee.name) errors.name = "Name is required";
    if (!newEmployee.email) errors.email = "Email is required";
    if (!newEmployee.phone) errors.phone = "Phone number is required";
    if (!newEmployee.password) errors.password = "Password is required";
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

      if (!response.ok) throw new Error("Failed to create employee");

      const newEmployeeData = await response.json();
      setEmployees([...employees, newEmployeeData]);
      onSuccess("Employee created successfully!");
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
      onError("Failed to create employee. Please try again.");
    }
  };

  const handleDeleteEmployee = async () => {
    if (employeeToDelete === null) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/employees/${employeeToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete employee");

      setEmployees(
        employees.filter((employee) => employee.id !== employeeToDelete)
      );
      onSuccess("Employee deleted successfully!");
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error("Error deleting employee:", err);
      onError("Failed to delete employee. Please try again.");
    }
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

      setMessage("Employees exported to Excel successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      onError("Failed to export employees to Excel.");
    } finally {
      setExportLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  if (loadingEmployees) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-600">Loading data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-800 text-white rounded-lg shadow">
        <h5 className="m-0">All Employees</h5>
        <div className="space-x-2">
          <button
            onClick={() => setShowEmployeeModal(true)}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded text-white"
          >
            + Create Employee
          </button>
          <button
            onClick={fetchEmployees}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Refresh
          </button>
          <button
            onClick={exportToExcel}
            disabled={exportLoading}
            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
          >
            {exportLoading ? "Exporting..." : "Export to Excel"}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mb-3 p-2 bg-green-100 text-green-700 text-center rounded">
          {message}
        </div>
      )}

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-3 py-2 border rounded"
        />
        <button
          onClick={() => setSearchQuery("")}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ✕
        </button>
      </div>

      {/* Employees Table */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-5 text-gray-500">No employees found.</div>
      ) : (
        <>
          <table className="min-w-full border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{employee.id}</td>
                  <td className="px-4 py-2 border">{employee.name}</td>
                  <td className="px-4 py-2 border">{employee.email}</td>
                  <td className="px-4 py-2 border">{employee.phoneNumber}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => {
                        setEmployeeToDelete(employee.id);
                        setShowDeleteModal(true);
                      }}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Info */}
          <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
            <div>
              Showing {indexOfFirstEmployee + 1} to{" "}
              {Math.min(indexOfLastEmployee, filteredEmployees.length)} of{" "}
              {filteredEmployees.length} employees
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredEmployees.length}
              itemsPerPage={employeesPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* Create Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Create New Employee</h3>
            <div className="space-y-3">
              {["name", "email", "phone", "password", "confirmPassword"].map(
                (field) => (
                  <div key={field}>
                    <input
                      type={
                        field.includes("password") ? "password" : "text"
                      }
                      placeholder={
                        field.charAt(0).toUpperCase() +
                        field.slice(1).replace("Password", " Password")
                      }
                      value={newEmployee[field]}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, [field]: e.target.value })
                      }
                      className={`w-full px-3 py-2 border rounded ${
                        formErrors[field] ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors[field] && (
                      <p className="text-red-500 text-sm">
                        {formErrors[field]}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
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
                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEmployee}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmployee}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesTab;
