import React from "react";

const CustomerCard = ({ customer, onViewDetails, onEdit, onDelete }) => {

  const getBadgeColor = () => {
    switch (customer.type) {
      case 'NEW':
        return 'bg-green-500';
      case 'EXISTING':
        return 'bg-teal-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="shadow-md border rounded-lg mb-4">
      {/* Header */}
      <div
        className="flex justify-between items-center px-4 py-2 rounded-t-lg"
        style={{ backgroundColor: '#2e4a7a', color: 'white' }}
      >
        <h5 className="text-lg font-semibold">{customer.name}</h5>
        <span className={`text-sm px-2 py-1 rounded ${getBadgeColor()}`}>
          {customer.type || 'UNKNOWN'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4" style={{ backgroundColor: '#f0f4fa' }}>
        <div className="mb-3">
          <div className="mb-1">
            <strong>Phone: </strong> {customer.phoneNumber}
          </div>
          <div className="mb-1">
            <strong>Email: </strong> {customer.email}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12H9m12 0c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
                />
              </svg>
              View Details
            </button>
          )}

          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5m-5-5l5-5m0 0l-5 5m5-5H13"
                />
              </svg>
              Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
