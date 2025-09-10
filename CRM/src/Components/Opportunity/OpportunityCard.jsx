import React from "react";

const OpportunityCard = ({ opportunity, onViewDetails, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg mb-4 border">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#2e4a7a] text-white px-4 py-2 rounded-t-lg">
        <h5 className="text-lg font-semibold">{opportunity.lead?.name}</h5>
        <div className="text-sm">
          {opportunity.createdDate && (
            <strong>Created on: {opportunity.createdDate}</strong>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="bg-[#f0f4fa] p-4 rounded-b-lg">
        <div className="mb-3 space-y-1 text-sm">
          <div>
            <strong>Phone: </strong> {opportunity.lead?.phoneNumber}
          </div>
          <div>
            <strong>Email: </strong> {opportunity.lead?.email}
          </div>
          <div>
            <strong>Assigned To: </strong>{" "}
            {opportunity.lead?.assignedTo || "Super Admin"}
          </div>
          {opportunity.lead?.requirement && (
            <div>
              <strong>Requirement: </strong> {opportunity.lead.requirement}
            </div>
          )}

          {/* Quotation Flag */}
          <div>
            <strong>Quotation: </strong>
            {opportunity.quotationId ? (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                Created
              </span>
            ) : (
              <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-xs font-medium">
                Not Created
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center"
            onClick={onViewDetails}
          >
            <i className="bi bi-eye mr-1"></i> View Details
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded flex items-center"
            onClick={onEdit}
          >
            <i className="bi bi-pencil mr-1"></i> Edit
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded flex items-center"
            onClick={onDelete}
          >
            <i className="bi bi-trash mr-1"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
