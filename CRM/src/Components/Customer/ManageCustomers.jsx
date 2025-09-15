import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EditCustomer from "./Buttons/Edit";
import DeleteCustomer from "./Buttons/Delete";
import CustomerForm from "./CustomerForm";
import CustomerService from "../../services/CustomerService";
import CustomerCard from "./CustomerCard";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Pagination from "../common/Pagination";
import { BiFilter, BiChevronDown, BiChevronUp, BiUser, BiStar, BiUserCheck, BiFile } from "react-icons/bi";

const ManageCustomers = () => {
  const navigate = useNavigate();
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [Customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const exportData = filteredCustomers.map((customer) => ({
        ID: customer.id || "",
        Name: customer.name || "",
        Email: customer.email || "",
        "Phone Number": customer.phoneNumber || "",
        Address: customer.address || "",
        City: customer.city || "",
        State: customer.state || "",
        Country: customer.country || "",
        Type: customer.type || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
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
      setError("Failed to export customers to Excel.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setExportLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.getAllCustomers();
      setCustomers(data);
      applyFilter(activeFilter, data);
    } catch (err) {
      setError(`Error fetching Customers: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filter, customers = Customers) => {
    if (filter === "ALL") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((c) => c.type === filter);
      setFilteredCustomers(filtered);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilter(filter);
    setDropdownOpen(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCloseCustomerForm = () => setShowCustomerForm(false);
  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedCustomer(null);
  };
  const handleCloseDeleteForm = () => {
    setShowDeleteForm(false);
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = async (data) => {
    setMessage(null);
    setError(null);
    try {
      await CustomerService.createCustomer(data);
      setMessage("Customer saved successfully!");
      setShowCustomerForm(false);
      await fetchCustomers();
    } catch (err) {
      setError("Error saving Customer. Please try again.");
    }
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowEditForm(true);
    setMessage(null);
    setError(null);
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteForm(true);
    setMessage(null);
    setError(null);
  };

  const handleUpdateCustomer = async (data) => {
    setMessage(null);
    setError(null);
    try {
      if (data.id) {
        await CustomerService.updateCustomer(data.id, data);
        setMessage("Customer updated successfully!");
        setShowEditForm(false);
        setSelectedCustomer(null);
        await fetchCustomers();
      }
    } catch (err) {
      setError("Error updating Customer. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCustomer || !selectedCustomer.id) return;

    setMessage(null);
    setError(null);
    try {
      await CustomerService.deleteCustomer(selectedCustomer.id);

      setCustomers((prev) =>
        prev.filter((c) => c.id !== selectedCustomer.id)
      );
      setFilteredCustomers((prev) =>
        prev.filter((c) => c.id !== selectedCustomer.id)
      );

      setMessage("Customer moved to recycle bin successfully!");
      setShowDeleteForm(false);
      setSelectedCustomer(null);

      await fetchCustomers();
    } catch (err) {
      console.error("Error in handleConfirmDelete:", err);
      setError("Error moving Customer to recycle bin. Please try again.");
    }
  };

  const handleViewDetails = (customer) => {
    if (customer.id) navigate(`/customer/${customer.id}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      applyFilter(activeFilter);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = Customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(lowercasedQuery) ||
          c.email?.toLowerCase().includes(lowercasedQuery) ||
          c.phoneNumber?.toLowerCase().includes(lowercasedQuery) ||
          c.address?.toLowerCase().includes(lowercasedQuery) ||
          c.city?.toLowerCase().includes(lowercasedQuery) ||
          c.country?.toLowerCase().includes(lowercasedQuery) ||
          c.type?.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredCustomers(
        activeFilter === "ALL"
          ? filtered
          : filtered.filter((c) => c.type === activeFilter)
      );
    }
  };

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 text-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold">Manage Customers</h2>
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-1 px-3 py-1 border border-white rounded hover:bg-gray-700"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <BiFilter />
              <span>
                {activeFilter === "ALL"
                  ? "All Customers"
                  : activeFilter === "NEW"
                  ? "New Customers"
                  : "Existing Customers"}
              </span>
              {activeFilter !== "ALL" && (
                <span className="bg-white text-gray-800 px-2 rounded">
                  {filteredCustomers.length}
                </span>
              )}
              {dropdownOpen ? <BiChevronUp /> : <BiChevronDown />}
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-1 w-full bg-white text-gray-800 rounded shadow z-10">
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${
                    activeFilter === "ALL" ? "font-bold" : ""
                  }`}
                  onClick={() => handleFilterChange("ALL")}
                >
                  <BiUser className="inline mr-2" />
                  All Customers
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${
                    activeFilter === "NEW" ? "font-bold" : ""
                  }`}
                  onClick={() => handleFilterChange("NEW")}
                >
                  <BiStar className="inline mr-2" />
                  New Customers
                </button>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${
                    activeFilter === "EXISTING" ? "font-bold" : ""
                  }`}
                  onClick={() => handleFilterChange("EXISTING")}
                >
                  <BiUserCheck className="inline mr-2" />
                  Existing Customers
                </button>
              </div>
            )}
          </div>
          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
            onClick={exportToExcel}
            disabled={exportLoading || loading || filteredCustomers.length === 0}
          >
            {exportLoading ? (
              <>
                <span className="loader-border h-4 w-4 border-2 border-white rounded-full animate-spin"></span>
                Exporting...
              </>
            ) : (
              <>
                <BiFile />
                Export to Excel
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {message && <div className="bg-green-200 text-green-800 px-4 py-2 rounded">{message}</div>}
      {error && <div className="bg-red-200 text-red-800 px-4 py-2 rounded">{error}</div>}

      {/* Search */}
      <div>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-gray-400"
          placeholder="Search customers by name, email, phone, address..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Customer List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading Customers...</div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded">
            No {activeFilter !== "ALL" ? activeFilter.toLowerCase() : ""} customers found.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onViewDetails={() => handleViewDetails(customer)}
              onEdit={() => handleEditCustomer(customer)}
              onConvert={() => {}}
              onDelete={() => handleDeleteCustomer(customer)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        itemsPerPage={customersPerPage}
        totalItems={filteredCustomers.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Forms */}
      <CustomerForm show={showCustomerForm} onClose={handleCloseCustomerForm} onSave={handleSaveCustomer} />
      <EditCustomer show={showEditForm} onClose={handleCloseEditForm} onSave={handleUpdateCustomer} customer={selectedCustomer} />
      <DeleteCustomer show={showDeleteForm} onClose={handleCloseDeleteForm} onConfirm={handleConfirmDelete} Customer={selectedCustomer} />
    </div>
  );
};

export default ManageCustomers;
