import React from "react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "PR";
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate random avatar colors
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
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // Truncate description to specific word count
  const truncateDescription = (description, maxWords = 10) => {
    if (!description) return "";
    const words = description.split(' ');
    if (words.length <= maxWords) return description;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const getStatusColor = () => {
    switch (product.status) {
      case 'Available':
        return 'bg-green-100 text-green-700';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      case 'Discontinued':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Main Content */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className={`w-16 h-16 ${getAvatarColor(product.name)} rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}>
            {getInitials(product.name)}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-500 text-sm mb-2 line-clamp-2" title={product.description}>
              {truncateDescription(product.description)}
            </p>
            <p className="text-gray-600 text-sm font-medium">
              ₹ {product.price?.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Status and Category Badges */}
        <div className="flex gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {product.status}
          </span>
          {product.category && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {product.category}
            </span>
          )}
        </div>
        
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

export default ProductCard;
