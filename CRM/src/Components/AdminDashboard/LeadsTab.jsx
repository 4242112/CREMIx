import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const LeadsTab = ({ onError }) => {
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLeads(leads);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = leads.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query) ||
          lead.phoneNumber?.toLowerCase().includes(query) ||
          lead.source?.toLowerCase().includes(query) ||
          lead.assignedTo?.toLowerCase().includes(query) ||
          (lead.expectedRevenue?.toString() || "").includes(query) ||
          (lead.conversionProbability?.toString() || "").includes(query)
      );
      setFilteredLeads(filtered);
    }
  }, [searchQuery, leads]);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const response = await fetch("http://localhost:8080/api/leads");
      if (!response.ok) throw new Error("Failed to fetch leads");

      const data = await response.json();
      setLeads(data);
      onError("");
    } catch (err) {
      console.error("Error fetching leads:", err);
      onError("Failed to fetch leads. Please try again later.");
    } finally {
      setLoadingLeads(false);
    }
  };

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const exportData = leads.map((lead) => ({
        ID: lead.id || "",
        Name: lead.name || "",
        Email: lead.email || "",
        Source: lead.source || "",
        "Expected Revenue": lead.expectedRevenue?.toFixed(2) || "0.00",
        Probability: `${lead.conversionProbability || 0}%`,
        "Assigned To": lead.assignedTo || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 20 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const currentDate = new Date().toISOString().split("T")[0];
      saveAs(data, `Leads_Export_${currentDate}.xlsx`);

      setMessage("Leads exported to Excel successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      onError("Failed to export leads to Excel.");
    } finally {
      setExportLoading(false);
    }
  };

  if (loadingLeads) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-md inline-block">
          No leads found.
        </div>
        <button
          onClick={fetchLeads}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh Leads
        </button>
      </div>
    );
  }

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-3 rounded bg-gray-900 text-white shadow-md">
        <h5 className="m-0 font-semibold">All Leads</h5>
        <div className="flex space-x-2">
          <button
            onClick={fetchLeads}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Refresh
          </button>
          <button
            onClick={exportToExcel}
            disabled={exportLoading}
            className={`px-3 py-1 rounded-md ${
              exportLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {exportLoading ? "Exporting..." : "Export to Excel"}
          </button>
        </div>
      </div>

      {/* Success message */}
      {message && (
        <div className="mb-3 bg-green-100 text-green-800 px-4 py-2 rounded-md">
          {message}
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search leads..."
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Leads table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Source</th>
              <th className="px-4 py-2 border">Expected Revenue</th>
              <th className="px-4 py-2 border">Probability</th>
              <th className="px-4 py-2 border">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{lead.id}</td>
                <td className="px-4 py-2 border">
                  <div>{lead.name}</div>
                  <small className="text-gray-500">{lead.email}</small>
                </td>
                <td className="px-4 py-2 border">{lead.source}</td>
                <td className="px-4 py-2 border">
                  ₹ {lead.expectedRevenue?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-2 border">
                  {lead.conversionProbability || 0}%
                </td>
                <td className="px-4 py-2 border">{lead.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>
          Showing {indexOfFirstLead + 1} to{" "}
          {Math.min(indexOfLastLead, filteredLeads.length)} of{" "}
          {filteredLeads.length} results
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredLeads.length}
          itemsPerPage={leadsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default LeadsTab;
