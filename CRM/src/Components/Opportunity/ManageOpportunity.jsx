import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EditOpportunity from "./Buttons/Edit";
import DeleteOpportunity from "./Buttons/Delete";
import OpportunityCard from "./OpportunityCard";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import OpportunityForm from "./OpportunityForm";
import Pagination from "../common/Pagination";

const API_URL = "http://localhost:8080/api/opportunities";

const ManageOpportunity = () => {
  const navigate = useNavigate();
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [Opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const exportData = filteredOpportunities.map((opportunity) => ({
        ID: opportunity.id || "",
        Stage: opportunity.stage || "",
        "Expected Revenue": opportunity.expectedRevenue || "",
        Probability: opportunity.conversionProbability
          ? `${opportunity.conversionProbability}%`
          : "",
        "Lead Name": opportunity.lead?.name || "",
        "Lead Email": opportunity.lead?.email || "",
        "Lead Phone": opportunity.lead?.phoneNumber || "",
        "Quotation Status": opportunity.quotationId ? "Created" : "Not Created",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 25 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 18 },
        { wch: 18 },
        { wch: 20 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Opportunities");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const currentDate = new Date().toISOString().split("T")[0];
      saveAs(data, `Opportunities_Export_${currentDate}.xlsx`);

      setMessage("Opportunities exported to Excel successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      setError("Failed to export opportunities to Excel.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setExportLoading(false);
    }
  };

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Failed to fetch Opportunities: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("API returned unexpected data format");
      data.reverse();
      setOpportunities(data);
      applyFilter(activeFilter, data);
    } catch (err) {
      setError(
        `Error fetching Opportunities: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filter, opportunities = Opportunities) => {
    if (filter === "ALL") {
      setFilteredOpportunities(opportunities);
    } else if (filter === "WITH_QUOTATION") {
      setFilteredOpportunities(opportunities.filter((o) => o.quotationId));
    } else if (filter === "WITHOUT_QUOTATION") {
      setFilteredOpportunities(opportunities.filter((o) => !o.quotationId));
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilter(filter);
    setDropdownOpen(false);
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleCloseOpportunityForm = () => setShowOpportunityForm(false);
  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedOpportunity(null);
  };
  const handleCloseDeleteForm = () => {
    setShowDeleteForm(false);
    setSelectedOpportunity(null);
  };

  const handleSaveOpportunity = async (data) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save Opportunity");
      setMessage("Opportunity saved successfully!");
      setShowOpportunityForm(false);
      await fetchOpportunities();
    } catch {
      setError("Error saving Opportunity. Please try again.");
    }
  };

  const handleEditOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowEditForm(true);
  };

  const handleDeleteOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDeleteForm(true);
  };

  const handleUpdateOpportunity = async (data) => {
    try {
      const response = await fetch(`${API_URL}/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update Opportunity");
      setMessage("Opportunity updated successfully!");
      setShowEditForm(false);
      setSelectedOpportunity(null);
      await fetchOpportunities();
    } catch {
      setError("Error updating Opportunity. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedOpportunity) return;
    try {
      const response = await fetch(`${API_URL}/${selectedOpportunity.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete Opportunity");
      setMessage("Opportunity moved to recycle bin successfully!");
      setShowDeleteForm(false);
      setSelectedOpportunity(null);
      await fetchOpportunities();
    } catch {
      setError("Error moving Opportunity to recycle bin. Please try again.");
    }
  };

  const handleViewDetails = (opportunity) => {
    if (opportunity.id) navigate(`/opportunity/${opportunity.id}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) return setFilteredOpportunities(Opportunities);

    const lowercased = query.toLowerCase();
    setFilteredOpportunities(
      Opportunities.filter(
        (o) =>
          o.lead?.name?.toLowerCase().includes(lowercased) ||
          o.lead?.email?.toLowerCase().includes(lowercased) ||
          o.lead?.phoneNumber?.toLowerCase().includes(lowercased) ||
          o.stage?.toLowerCase().includes(lowercased) ||
          o.expectedRevenue?.toString().toLowerCase().includes(lowercased) ||
          o.conversionProbability?.toString().toLowerCase().includes(lowercased)
      )
    );
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4 rounded bg-gray-900 text-white shadow">
        <h2 className="text-xl font-semibold">Manage Opportunities</h2>

        <div className="flex gap-2 items-center">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center border border-gray-400 px-3 py-2 rounded text-white hover:bg-gray-700"
            >
              <i className="bi bi-funnel mr-2"></i>
              <span>
                {activeFilter === "ALL"
                  ? "All Opportunities"
                  : activeFilter === "WITH_QUOTATION"
                  ? "With Quotation"
                  : "Without Quotation"}
              </span>
              {activeFilter !== "ALL" && (
                <span className="ml-2 bg-white text-gray-800 px-2 py-0.5 rounded text-xs">
                  {filteredOpportunities.length}
                </span>
              )}
              <i className={`bi bi-chevron-${dropdownOpen ? "up" : "down"} ml-2`}></i>
            </button>

            {dropdownOpen && (
              <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-10">
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    activeFilter === "ALL" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleFilterChange("ALL")}
                >
                  <i className="bi bi-grid mr-2"></i>All Opportunities
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    activeFilter === "WITH_QUOTATION" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleFilterChange("WITH_QUOTATION")}
                >
                  <i className="bi bi-file-earmark-check mr-2"></i>With Quotation
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    activeFilter === "WITHOUT_QUOTATION" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleFilterChange("WITHOUT_QUOTATION")}
                >
                  <i className="bi bi-file-earmark-x mr-2"></i>Without Quotation
                </button>
              </div>
            )}
          </div>

          {/* Export button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
            onClick={exportToExcel}
            disabled={exportLoading || loading || filteredOpportunities.length === 0}
          >
            {exportLoading ? (
              <>
                <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4 mr-2"></span>
                Exporting...
              </>
            ) : (
              <>
                <i className="bi bi-file-earmark-excel mr-2"></i>Export to Excel
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {message && <div className="mb-4 p-3 rounded bg-green-100 text-green-800">{message}</div>}
      {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-800">{error}</div>}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Search opportunities by name, email, stage, revenue..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading Opportunities...</div>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">No Opportunities found.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.map((Opportunity) => (
            <OpportunityCard
              key={Opportunity.id}
              opportunity={Opportunity}
              onViewDetails={() => handleViewDetails(Opportunity)}
              onEdit={() => handleEditOpportunity(Opportunity)}
              onDelete={() => handleDeleteOpportunity(Opportunity)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredOpportunities.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <OpportunityForm
        show={showOpportunityForm}
        onClose={handleCloseOpportunityForm}
        onSave={handleSaveOpportunity}
      />
      <EditOpportunity
        show={showEditForm}
        onClose={handleCloseEditForm}
        onSave={handleUpdateOpportunity}
        opportunity={selectedOpportunity}
      />
      <DeleteOpportunity
        show={showDeleteForm}
        onClose={handleCloseDeleteForm}
        onConfirm={handleConfirmDelete}
        Opportunity={selectedOpportunity}
      />
    </div>
  );
};

export default ManageOpportunity;
