import React, { useEffect, useState } from "react";
import LeadService from "../../services/LeadService";

const RecycleBin = () => {
  const [deletedLeads, setDeletedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false);

  const fetchDeletedLeads = async () => {
    setLoading(true);
    try {
      const data = await LeadService.getRecycleBinLeads();
      setDeletedLeads(data);
    } catch (err) {
      setError("Error fetching deleted leads. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedLeads();
  }, []);

  const handleRestore = (lead) => {
    setSelectedLead(lead);
    setShowRestoreConfirm(true);
  };

  const handlePermanentDelete = (lead) => {
    setSelectedLead(lead);
    setShowPermanentDeleteConfirm(true);
  };

  const confirmRestore = async () => {
    if (!selectedLead) return;

    setMessage(null);
    setError(null);
    try {
      await LeadService.restoreLead(selectedLead.id);
      setMessage("Lead restored successfully!");
      setShowRestoreConfirm(false);
      setSelectedLead(null);
      await fetchDeletedLeads();
    } catch (error) {
      setError(`Error restoring lead: ${error.message || "Please try again."}`);
    }
  };

  const confirmPermanentDelete = async () => {
    if (!selectedLead) return;

    setMessage(null);
    setError(null);
    try {
      await LeadService.permanentDeleteLead(selectedLead.id);
      setMessage("Lead permanently deleted successfully!");
      setShowPermanentDeleteConfirm(false);
      setSelectedLead(null);
      await fetchDeletedLeads();
    } catch (error) {
      setError(`Error permanently deleting lead: ${error.message || "Please try again."}`);
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Leads Recycle Bin</h2>
        <button
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 flex items-center gap-2"
          onClick={() => window.history.back()}
        >
          &#8592; Back
        </button>
      </div>

      {message && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-green-800 font-bold">&times;</button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-800 font-bold">&times;</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : deletedLeads.length === 0 ? (
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded">Recycle bin is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deletedLeads.map((lead) => (
            <div key={lead.id} className="border rounded shadow p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-lg font-semibold">{lead.name}</h5>
                <span className="bg-gray-300 text-gray-700 text-sm px-2 py-1 rounded">Deleted</span>
              </div>
              <div className="mb-3 text-sm">
                <div><strong>Phone:</strong> {lead.phoneNumber}</div>
                <div><strong>Email:</strong> {lead.email}</div>
                <div><strong>Assigned To:</strong> {lead.assignedTo || "Not Assigned"}</div>
                {lead.requirement && <div><strong>Interested In:</strong> {lead.requirement}</div>}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => handleRestore(lead)}
                >
                  Restore
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handlePermanentDelete(lead)}
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {selectedLead && showRestoreConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6">
            <h5 className="text-lg font-semibold mb-4">Confirm Restore</h5>
            <p>Are you sure you want to restore this lead?</p>
            <p className="font-semibold">Name: {selectedLead.name}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowRestoreConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={confirmRestore}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {selectedLead && showPermanentDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6">
            <h5 className="text-lg font-semibold mb-4">Confirm Permanent Delete</h5>
            <p>Are you sure you want to permanently delete this lead? This action cannot be undone.</p>
            <p className="font-semibold">Name: {selectedLead.name}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowPermanentDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmPermanentDelete}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecycleBin;
