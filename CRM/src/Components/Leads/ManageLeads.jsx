import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeadCard from "./LeadCard";
import LeadForm from "./LeadForm";
import EditLeads from "./Buttons/Edit";
import DeleteLead from "./Buttons/Delete";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Pagination from "../common/Pagination";
import AuthService from "../../services/AuthService";
import LeadService from "../../services/LeadService";
import OpportunityService from "../../services/OpportunityService";

const ManageLeads = () => {
  const navigate = useNavigate();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      if (!AuthService.isAnyUserLoggedIn()) {
        navigate('/login');
        return;
      }
      fetchLeads();
    };
    
    checkAuth();
  }, [navigate]);

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
          lead.requirement?.toLowerCase().includes(query) ||
          lead.source?.toLowerCase().includes(query) ||
          lead.assignedTo?.toLowerCase().includes(query)
      );
      setFilteredLeads(filtered);
    }
  }, [searchQuery, leads]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const exportToExcel = () => {
    setExportLoading(true);
    try {
      const exportData = leads.map((lead) => ({
        ID: lead.id || "",
        Name: lead.name || "",
        Email: lead.email || "",
        "Phone Number": lead.phoneNumber || "",
        Requirement: lead.requirement || "",
        "Expected Revenue": lead.expectedRevenue || "",
        "Conversion Probability": lead.conversionProbability
          ? `${lead.conversionProbability}%`
          : "",
        Source: lead.source || "",
        "Assigned To": lead.assignedTo || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 20 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
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
      setError("Failed to export leads to Excel.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setExportLoading(false);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await LeadService.getAllLeads();
      if (!Array.isArray(data)) throw new Error("Unexpected data format");
      data.reverse();
      setLeads(data);
    } catch (err) {
      setError(
        `Error fetching leads: ${err instanceof Error ? err.message : "Unknown"}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = () => {
    setShowLeadForm(true);
    setMessage(null);
    setError(null);
  };

  const handleCloseLeadForm = () => setShowLeadForm(false);
  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedLead(null);
  };
  const handleCloseDeleteForm = () => {
    setShowDeleteForm(false);
    setSelectedLead(null);
  };
  const handleCloseConvertConfirm = () => {
    setShowConvertConfirm(false);
    setSelectedLead(null);
  };

  const handleSaveLead = async (data) => {
    setMessage(null);
    setError(null);
    try {
      // Transform frontend form data to match backend DTO structure
      const leadData = {
        // Customer fields (flattened in DTO)
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode ? parseInt(data.zipCode) : null,
        country: data.country || "",
        website: data.website || "",
        
        // Lead fields
        requirement: data.requirement || "",
        assignedTo: data.assignedTo,
        source: data.source,
        conversionProbability: parseInt(data.conversionProbability) || 0,
        expectedRevenue: parseFloat(data.expectedRevenue) || 0.0,
      };

      console.log('Sending lead data:', leadData); // Debug log

      await LeadService.createLead(leadData);
      
      setMessage("Lead saved successfully!");
      setShowLeadForm(false);
      await fetchLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
      setError(`Error saving lead: ${error.message}`);
    }
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setShowEditForm(true);
  };

  const handleDeleteLead = (lead) => {
    setSelectedLead(lead);
    setShowDeleteForm(true);
  };

  const handleConvertLead = (lead) => {
    setSelectedLead(lead);
    setShowConvertConfirm(true);
  };

  const handleConfirmConvert = async () => {
    if (!selectedLead?.id) {
      setError("Cannot convert lead: Lead ID is missing");
      return;
    }
    try {
      const conversionData = {
        expectedRevenue: selectedLead.expectedRevenue || 0,
        conversionProbability: selectedLead.conversionProbability || 50,
      };
      await OpportunityService.convertLeadToOpportunity(selectedLead.id, conversionData);
      setMessage("Lead converted to opportunity successfully!");
      setShowConvertConfirm(false);
      setSelectedLead(null);
      await fetchLeads();
    } catch {
      setError("Error converting lead. Please try again.");
    }
  };

  const handleUpdateLead = async (data) => {
    try {
      await LeadService.updateLead(data.id, data);
      setMessage("Lead updated successfully!");
      setShowEditForm(false);
      setSelectedLead(null);
      await fetchLeads();
    } catch {
      setError("Error updating lead. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead) return;
    try {
      await LeadService.deleteLead(selectedLead.id);
      setMessage("Lead deleted successfully!");
      setShowDeleteForm(false);
      setSelectedLead(null);
      await fetchLeads();
    } catch {
      setError("Error deleting lead. Please try again.");
    }
  };

  const handleViewDetails = (lead) => {
    if (lead.id) navigate(`/leads/${lead.id}`);
  };

  // Pagination
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 p-4 rounded bg-gray-900 text-white shadow">
        <h2 className="text-xl font-semibold">Manage Leads</h2>
        <div className="flex gap-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center"
            onClick={exportToExcel}
            disabled={exportLoading || loading || leads.length === 0}
          >
            {exportLoading ? (
              <span className="animate-spin mr-2">⏳</span>
            ) : (
              "⬇️ Export to Excel"
            )}
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center"
            onClick={handleAddLead}
          >
            ➕ Add Lead
          </button>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Search leads..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Lead List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading leads...</div>
        </div>
      ) : currentLeads.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">No leads found.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onViewDetails={() => handleViewDetails(lead)}
              onEdit={() => handleEditLead(lead)}
              onConvert={() => handleConvertLead(lead)}
              onDelete={() => handleDeleteLead(lead)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <LeadForm
        show={showLeadForm}
        onClose={handleCloseLeadForm}
        onSave={handleSaveLead}
      />
      <EditLeads
        show={showEditForm}
        onClose={handleCloseEditForm}
        onSave={handleUpdateLead}
        lead={selectedLead}
      />
      <DeleteLead
        show={showDeleteForm}
        onClose={handleCloseDeleteForm}
        onConfirm={handleConfirmDelete}
        lead={selectedLead}
      />

      {/* Convert Lead Modal */}
      {showConvertConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Convert Lead to Opportunity
            </h3>
            {selectedLead && (
              <>
                <p>Are you sure you want to convert this lead?</p>
                <div className="bg-gray-100 rounded p-3 my-3">
                  <p>
                    <strong>Name:</strong> {selectedLead.name}
                  </p>
                  <p>
                    <strong>Requirement:</strong> {selectedLead.requirement}
                  </p>
                  {selectedLead.expectedRevenue && (
                    <p>
                      <strong>Expected Revenue:</strong> ₹
                      {selectedLead.expectedRevenue}
                    </p>
                  )}
                  {selectedLead.conversionProbability && (
                    <p>
                      <strong>Probability:</strong>{" "}
                      {selectedLead.conversionProbability}%
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={handleCloseConvertConfirm}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                onClick={handleConfirmConvert}
              >
                Convert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredLeads.length}
        itemsPerPage={leadsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ManageLeads;
