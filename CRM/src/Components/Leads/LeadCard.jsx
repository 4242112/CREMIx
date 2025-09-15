import React from "react";

const LeadCard = ({ lead, onViewDetails, onEdit, onConvert, onDelete }) => {
  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate random avatar colors similar to the design
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-yellow-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Main Content */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className={`w-16 h-16 ${getAvatarColor(lead.name)} rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}>
            {getInitials(lead.name)}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {lead.name}
            </h3>
            <p className="text-gray-500 text-sm">
              {lead.email}
            </p>
          </div>
        </div>
        
        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-200 mb-4 block"
        >
          View Details
        </button>
        
        {/* Action buttons - show on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onConvert}
              className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs hover:bg-green-200 transition-colors"
            >
              Convert
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
