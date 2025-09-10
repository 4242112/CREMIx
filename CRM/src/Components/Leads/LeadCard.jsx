import React from "react";
import { Lead } from "../../services/LeadService";

const LeadCard = ({ lead, onViewDetails, onEdit, onConvert, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 rounded-t-lg" style={{ backgroundColor: '#2e4a7a', color: 'white' }}>
        <h5 className="text-lg font-semibold">{lead.name}</h5>
        {lead.createdDate && (
          <small className="text-sm">
            <strong>Created on: {lead.createdDate}</strong>
          </small>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3" style={{ backgroundColor: '#f0f4fa' }}>
        <div className="space-y-1 mb-3">
          <div><strong>Phone: </strong>{lead.phoneNumber}</div>
          <div><strong>Email: </strong>{lead.email}</div>
          <div><strong>Assigned To: </strong>{lead.assignedTo || 'Super Admin'}</div>
          {lead.requirement && <div><strong>Interested In: </strong>{lead.requirement}</div>}
          {lead.expectedRevenue !== undefined && <div><strong>Expected Revenue: </strong>₹{lead.expectedRevenue.toFixed(2)}</div>}
          {lead.conversionProbability !== undefined && <div><strong>Conversion Probability: </strong>{lead.conversionProbability}%</div>}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onViewDetails}
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-1"
          >
            👁️ View Details
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-1 rounded bg-gray-500 text-white text-sm hover:bg-gray-600 flex items-center gap-1"
          >
            ✏️ Edit
          </button>
          <button
            onClick={onConvert}
            className="px-3 py-1 rounded bg-green-500 text-white text-sm hover:bg-green-600 flex items-center gap-1"
          >
            ➡️ Convert To Opportunity
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 flex items-center gap-1"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
