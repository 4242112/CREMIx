// FILE: src/Components/AdminDashboard/CustomersTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import Pagination from "../common/Pagination";
import QuotationService from "../../services/QuotationService";
import CustomerService from "../../services/CustomerService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function CustomersTab({ onError }) {
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  


  const fetchCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    try {
      const data = await CustomerService.getAllCustomers();
      setCustomers(data);
      onError("");
    } catch (err) {
      console.error("Error fetching customers:", err);
      onError("Failed to fetch customers. Please try again later.");
    } finally {
      setLoadingCustomers(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const exportData = customers.map((customer) => ({
        ID: customer.id || "",
        Name: customer.name || "",
        Email: customer.email || "",
        "Phone Number": customer.phoneNumber || "",
        Address: customer.address || "",
        City: customer.city || "",
        State: customer.state || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const currentDate = new Date().toISOString().split("T")[0];
      saveAs(data, `Customers_Export_${currentDate}.xlsx`);

      setMessage("Customers exported to Excel successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      onError("Failed to export customers to Excel.");
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = customers.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(query) ||
          customer.email?.toLowerCase().includes(query) ||
          customer.phoneNumber?.toLowerCase().includes(query) ||
          customer.address?.toLowerCase().includes(query) ||
          customer.city?.toLowerCase().includes(query) ||
          customer.state?.toLowerCase().includes(query)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const renderLoading = () => (
    <div className="text-center py-10">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading data...</p>
    </div>
  );

  if (loadingCustomers) {
    return renderLoading();
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="p-4 mb-3 text-blue-700 bg-blue-100 rounded-lg inline-block">
          No customers found.
        </div>
        <button
          onClick={fetchCustomers}
          className="mt-3 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Refresh Customers
        </button>
      </div>
    );
  }

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-3 rounded bg-gray-900 text-white shadow">
        <h5 className="m-0 text-lg font-semibold">All Customers</h5>
        <div className="space-x-2">
          <button
            onClick={fetchCustomers}
            className="px-3 py-1.5 bg-white text-gray-800 rounded text-sm hover:bg-gray-100 border"
          >
            ⟳ Refresh
          </button>
          <button
            onClick={exportToExcel}
            disabled={exportLoading}
            className={`px-3 py-1.5 rounded text-sm ${
              exportLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {exportLoading ? (
              <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "⬇ Export to Excel"
            )}
          </button>
        </div>
      </div>

      {/* Success message */}
      {message && (
        <div className="p-3 mb-3 text-green-700 bg-green-100 rounded">
          {message}
        </div>
      )}

      {/* Search */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-l focus:ring focus:ring-blue-300"
        />
        <button
          onClick={() => setSearchQuery("")}
          className="px-3 py-2 bg-gray-200 border border-l-0 rounded-r hover:bg-gray-300"
        >
          ✕
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Contact Information</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{customer.id}</td>
                <td className="py-2 px-4 border-b">{customer.name}</td>
                <td className="py-2 px-4 border-b">
                  <div>{customer.email}</div>
                  <div>{customer.phoneNumber}</div>
                </td>
                <td className="py-2 px-4 border-b">
                  {customer.city && customer.state
                    ? `${customer.city}, ${customer.state}`
                    : customer.address || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">
    
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredCustomers.length}
          itemsPerPage={customersPerPage}
          onPageChange={setCurrentPage}
        />
      </div>


    </div>
  );
}
