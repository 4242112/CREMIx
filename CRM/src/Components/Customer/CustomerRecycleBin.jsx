import React, { useEffect, useState } from "react";
import CustomerService from "../../services/CustomerService";

const CustomerRecycleBin = () => {
  const [deletedCustomers, setDeletedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false);

  const fetchDeletedCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.getDeletedCustomers();
      // Filter to only show customers that are actually deleted (status = 'DELETED')
      // If status field doesn't exist, show all (fallback for backwards compatibility)
      const actuallyDeletedCustomers = data.filter(customer => 
        !customer.status || customer.status === 'DELETED'
      );
      setDeletedCustomers(actuallyDeletedCustomers);
    } catch (err) {
      setError("Error fetching deleted Customers. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedCustomers();
  }, []);

  const handleRestore = (customer) => {
    setSelectedCustomer(customer);
    setShowRestoreConfirm(true);
  };

  const handlePermanentDelete = (customer) => {
    setSelectedCustomer(customer);
    setShowPermanentDeleteConfirm(true);
  };

  const confirmRestore = async () => {
    if (!selectedCustomer || !selectedCustomer.id) return;
    setMessage(null);
    setError(null);
    try {
      await CustomerService.restoreCustomer(selectedCustomer.id);
      setMessage("Customer restored successfully!");
      setShowRestoreConfirm(false);
      setSelectedCustomer(null);
      await fetchDeletedCustomers();
    } catch (err) {
      setError("Error restoring Customer. Please try again.");
    }
  };

  const confirmPermanentDelete = async () => {
    if (!selectedCustomer || !selectedCustomer.id) return;
    setMessage(null);
    setError(null);
    try {
      await CustomerService.permanentlyDeleteCustomer(selectedCustomer.id);
      setMessage("Customer permanently deleted successfully!");
      setShowPermanentDeleteConfirm(false);
      setSelectedCustomer(null);
      await fetchDeletedCustomers();
    } catch (err) {
      setError("Error permanently deleting Customer. Please try again.");
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Customers Recycle Bin</h2>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100 flex items-center"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
      </div>

      {/* Alerts */}
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded flex justify-between items-center">
          {message}
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded flex justify-between items-center">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : deletedCustomers.length === 0 ? (
        <div className="p-4 bg-blue-100 text-blue-800 rounded">Recycle bin is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deletedCustomers.map((customer) => (
            <div key={customer.id} className="border rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-semibold">{customer.name}</h5>
                <span className="text-xs px-2 py-1 bg-gray-300 rounded">Deleted</span>
              </div>
              <div className="mb-3">
                <div><strong>Phone:</strong> {customer.phoneNumber}</div>
                <div><strong>Email:</strong> {customer.email}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleRestore(customer)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center text-sm"
                >
                  ↺ Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(customer)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center text-sm"
                >
                  🗑️ Delete Permanently
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {selectedCustomer && showRestoreConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Restore</h3>
            <p>Are you sure you want to restore this Customer?</p>
            <p className="mt-2"><strong>Name:</strong> {selectedCustomer.name}</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="px-4 py-2 bg-gray-500 rounded text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestore}
                className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {selectedCustomer && showPermanentDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Permanent Delete</h3>
            <p>Are you sure you want to permanently delete this Customer? This action cannot be undone.</p>
            <p className="mt-2"><strong>Name:</strong> {selectedCustomer.name}</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPermanentDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 rounded text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmPermanentDelete}
                className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
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

export default CustomerRecycleBin;
