import React from "react";

const DeleteLead = ({ show, onClose, onConfirm, lead }) => {
  if (!lead || !show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md rounded shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-semibold">Move Lead to Recycle Bin</h5>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2 text-sm">
          <p>Are you sure you want to move this lead to the recycle bin?</p>
          <p>
            <strong>Name:</strong> {lead.name}
          </p>
          <p className="text-gray-500 text-xs">
            You can restore this lead from the Recycle Bin later.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Move to Recycle Bin
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLead;
