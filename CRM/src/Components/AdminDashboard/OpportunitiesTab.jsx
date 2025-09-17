import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Pagination from "../common/Pagination";
import OpportunityService from "../../services/OpportunityService";

const OpportunitiesTab = ({ onError }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const opportunitiesPerPage = 10;

  const fetchOpportunities = useCallback(async () => {
    setLoadingOpportunities(true);
    try {
      const data = await OpportunityService.getAllOpportunities();
      setOpportunities(data);
      onError("");
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      onError("Failed to fetch opportunities. Please try again later.");
    } finally {
      setLoadingOpportunities(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  useEffect(() => {
    setFilteredOpportunities(
      opportunities.filter(
        (opportunity) =>
          // Search in lead name or customer email for quote requests
          opportunity.lead?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          opportunity.customer?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          opportunity.customer?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          opportunity.title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          opportunity.lead?.assignedTo
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, opportunities]);

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const exportData = opportunities.map((opportunity) => ({
        ID: opportunity.id || "",
        Title: opportunity.title || `Opportunity for ${opportunity.lead?.name || opportunity.customer?.name || "Unknown"}`,
        Description: opportunity.description || "",
        Customer: opportunity.customer?.name || opportunity.lead?.name || "N/A",
        "Customer Email": opportunity.customer?.email || opportunity.customerEmail || "",
        Stage: opportunity.stage || "NEW",
        Type: opportunity.lead ? "From Lead" : "Quote Request",
        "Quotation Created": opportunity.quotation || opportunity.quotationId ? "Yes" : "No",
        "Created Date": opportunity.createdAt || opportunity.createdDate
          ? new Date(opportunity.createdAt || opportunity.createdDate).toLocaleDateString()
          : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      worksheet["!cols"] = [
        { wch: 5 },  // ID
        { wch: 30 }, // Title
        { wch: 40 }, // Description
        { wch: 25 }, // Customer
        { wch: 30 }, // Customer Email
        { wch: 10 }, // Stage
        { wch: 15 }, // Type
        { wch: 15 }, // Quotation Created
        { wch: 15 }, // Created Date
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Opportunities");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const currentDate = new Date().toISOString().split("T")[0];
      saveAs(data, `Opportunities_Export_${currentDate}.xlsx`);

      setMessage("✅ Opportunities exported to Excel successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      onError("Failed to export opportunities to Excel.");
    } finally {
      setExportLoading(false);
    }
  };

  if (loadingOpportunities) {
    return (
      <div className="flex flex-col justify-center items-center py-10 text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 border-solid"></div>
        <p className="mt-3">Loading data...</p>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="flex flex-col items-center py-10">
        <div className="bg-blue-100 text-blue-700 px-4 py-3 rounded w-full max-w-lg text-center">
          ℹ️ No opportunities found.
        </div>
        <button
          onClick={fetchOpportunities}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          🔄 Refresh Opportunities
        </button>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastOpportunity = currentPage * opportunitiesPerPage;
  const indexOfFirstOpportunity =
    indexOfLastOpportunity - opportunitiesPerPage;
  const currentOpportunities = filteredOpportunities.slice(
    indexOfFirstOpportunity,
    indexOfLastOpportunity
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4 rounded-lg bg-gray-900 text-white shadow-md">
        <h5 className="text-lg font-semibold">All Opportunities</h5>
        <div className="flex space-x-2">
          <button
            onClick={fetchOpportunities}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            🔄 Refresh
          </button>
          <button
            onClick={exportToExcel}
            disabled={exportLoading}
            className={`px-3 py-1.5 rounded text-sm ${
              exportLoading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {exportLoading ? "⏳ Exporting..." : "📊 Export to Excel"}
          </button>
        </div>
      </div>

      {/* Success message */}
      {message && (
        <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by customer, title, or assigned to"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-500"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Title/Description</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Stage</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOpportunities.map((opportunity) => (
              <tr
                key={opportunity.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 border">{opportunity.id}</td>
                <td className="px-4 py-2 border">
                  <div>
                    <div className="font-medium">
                      {opportunity.title || `Opportunity for ${opportunity.lead?.name || opportunity.customer?.name || "Unknown"}`}
                    </div>
                    {opportunity.description && (
                      <div className="text-sm text-gray-600 mt-1">
                        {opportunity.description.length > 50 
                          ? `${opportunity.description.substring(0, 50)}...` 
                          : opportunity.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border">
                  <div>
                    <div className="font-medium">
                      {opportunity.customer?.name || opportunity.lead?.name || "N/A"}
                    </div>
                    {(opportunity.customer?.email || opportunity.customerEmail) && (
                      <div className="text-sm text-gray-600">
                        {opportunity.customer?.email || opportunity.customerEmail}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    opportunity.stage === 'NEW' ? 'bg-blue-100 text-blue-800' :
                    opportunity.stage === 'WON' ? 'bg-green-100 text-green-800' :
                    opportunity.stage === 'LOST' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {opportunity.stage || 'NEW'}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    opportunity.lead ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {opportunity.lead ? 'From Lead' : 'Quote Request'}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      onClick={() => {/* Add view details functionality */}}
                    >
                      View
                    </button>
                    {!opportunity.quotation && (
                      <button 
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        onClick={() => {/* Add create quotation functionality */}}
                      >
                        Create Quote
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredOpportunities.length}
        itemsPerPage={opportunitiesPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default OpportunitiesTab;
