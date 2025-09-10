import React, { useEffect, useState } from "react";
import OpportunityService from "../../services/OpportunityService";

const RecycleBin = () => {
  const [deletedOpportunities, setDeletedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] =
    useState(false);

  const fetchDeletedOpportunities = async () => {
    setLoading(true);
    try {
      const data = await OpportunityService.getRecycleBinOpportunities();
      setDeletedOpportunities(data);
    } catch (err) {
      setError("Error fetching deleted opportunities. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedOpportunities();
  }, []);

  const handleRestore = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowRestoreConfirm(true);
  };

  const handlePermanentDelete = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowPermanentDeleteConfirm(true);
  };

  const confirmRestore = async () => {
    if (!selectedOpportunity) return;
    setMessage(null);
    setError(null);
    try {
      await OpportunityService.restoreOpportunity(selectedOpportunity.id);
      setMessage("Opportunity restored successfully!");
      setShowRestoreConfirm(false);
      setSelectedOpportunity(null);
      await fetchDeletedOpportunities();
    } catch (err) {
      setError("Error restoring Opportunity. Please try again.");
    }
  };

  const confirmPermanentDelete = async () => {
    if (!selectedOpportunity) return;
    setMessage(null);
    setError(null);
    try {
      await OpportunityService.permanentDeleteOpportunity(
        selectedOpportunity.id
      );
      setMessage("Opportunity permanently deleted successfully!");
      setShowPermanentDeleteConfirm(false);
      setSelectedOpportunity(null);
      await fetchDeletedOpportunities();
    } catch (err) {
      setError("Error permanently deleting Opportunity. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Opportunities Recycle Bin</h2>
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 border px-3 py-1.5 rounded hover:bg-gray-100"
        >
          <span>←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Success & Error Messages */}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded relative">
          <span>{message}</span>
          <button
            onClick={() => setMessage(null)}
            className="absolute top-1 right-2 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded relative">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-1 right-2 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : deletedOpportunities.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          Recycle bin is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deletedOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="bg-white border shadow rounded-lg overflow-hidden"
            >
              <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
                <h5 className="font-semibold">{opportunity.lead.name}</h5>
                <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded">
                  Deleted
                </span>
              </div>
              <div className="p-4">
                <div className="mb-3 text-sm space-y-1">
                  <div>
                    <strong>Phone:</strong> {opportunity.lead.phoneNumber}
                  </div>
                  <div>
                    <strong>Email:</strong> {opportunity.lead.email}
                  </div>
                  <div>
                    <strong>Assigned To:</strong>{" "}
                    {opportunity.lead.assignedTo || "Not Assigned"}
                  </div>
                  {opportunity.lead.requirement && (
                    <div>
                      <strong>Interested In:</strong>{" "}
                      {opportunity.lead.requirement}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleRestore(opportunity)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(opportunity)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {selectedOpportunity && showRestoreConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h5 className="font-semibold">Confirm Restore</h5>
              <button onClick={() => setShowRestoreConfirm(false)}>×</button>
            </div>
            <div className="p-4">
              <p>Are you sure you want to restore this Opportunity?</p>
              <p className="font-medium">
                Name: {selectedOpportunity.lead.name}
              </p>
            </div>
            <div className="flex justify-end space-x-2 border-t px-4 py-3">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestore}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {selectedOpportunity && showPermanentDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h5 className="font-semibold">Confirm Permanent Delete</h5>
              <button onClick={() => setShowPermanentDeleteConfirm(false)}>
                ×
              </button>
            </div>
            <div className="p-4">
              <p>
                Are you sure you want to permanently delete this Opportunity?
                This action cannot be undone.
              </p>
              <p className="font-medium">
                Name: {selectedOpportunity.lead.name}
              </p>
            </div>
            <div className="flex justify-end space-x-2 border-t px-4 py-3">
              <button
                onClick={() => setShowPermanentDeleteConfirm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmPermanentDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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
