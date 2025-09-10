import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Pagination from "../common/Pagination";

const OpportunitiesTab = ({ onError }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const opportunitiesPerPage = 10;

  const fetchOpportunities = async () => {
    setLoadingOpportunities(true);
    try {
      const response = await fetch("http://localhost:8080/api/opportunities");
      if (!response.ok) throw new Error("Failed to fetch opportunities");

      const data = await response.json();
      setOpportunities(data);
      onError("");
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      onError("Failed to fetch opportunities. Please try again later.");
    } finally {
      setLoadingOpportunities(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    setFilteredOpportunities(
      opportunities.filter(
        (opportunity) =>
          opportunity.lead?.name
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
        Customer: opportunity.lead?.name || "N/A",
        "Assigned To": opportunity.lead?.assignedTo || "Unassigned",
        "Quotation Created": opportunity.quotationId ? "Yes" : "No",
        "Created Date": opportunity.createdDate
          ? new Date(opportunity.createdDate).toLocaleDateString()
          : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
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
        placeholder="Search by customer or assigned to"
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
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Assigned To</th>
              <th className="px-4 py-2 border">Quotation Created</th>
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
                  {opportunity.lead?.name || "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {opportunity.lead?.assignedTo || "Unassigned"}
                </td>
                <td className="px-4 py-2 border">
                  {opportunity.quotationId ? "Yes" : "No"}
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
