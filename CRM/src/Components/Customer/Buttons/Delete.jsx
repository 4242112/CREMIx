import React from "react";

const DeleteCustomer = ({ show, onClose, onConfirm, Customer }) => {
  if (!Customer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onConfirm();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        show ? "block" : "hidden"
      }`}
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-lg w-96">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h5 className="text-lg font-semibold">Move Customer to Recycle Bin</h5>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <p>Are you sure you want to move this Customer to the recycle bin?</p>
          <p className="mt-2">
            <strong>Name:</strong> {Customer.name}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            You can restore this Customer from the Recycle Bin later.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t p-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleSubmit}
          >
            Move to Recycle Bin
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomer;
