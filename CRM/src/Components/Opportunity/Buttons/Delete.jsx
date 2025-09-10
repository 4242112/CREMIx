import React from "react";

const DeleteOpportunity = ({ show, onClose, onConfirm, Opportunity }) => {
  if (!Opportunity) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <>
      {show && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h5 className="text-lg font-semibold">
                Move Opportunity to Recycle Bin
              </h5>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-3">
              <p>Are you sure you want to move this Opportunity to the recycle bin?</p>
              <p>
                <strong>Name:</strong> {Opportunity.lead.name}
              </p>
              <p className="text-gray-500 text-sm">
                You can restore this Opportunity from the Recycle Bin later.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t px-4 py-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Move to Recycle Bin
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteOpportunity;
