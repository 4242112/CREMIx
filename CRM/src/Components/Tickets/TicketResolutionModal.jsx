import React, { useState } from 'react';
import ResolvedTicketService from '../../services/ResolvedTicketService';

const TicketResolutionModal = ({ 
  isOpen, 
  onClose, 
  ticket, 
  currentUser, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    title: ticket?.subject || '',
    ticketDescription: ticket?.description || '',
    resolveDescription: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resolveDescription.trim()) {
      setError('Please provide a resolution description');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const resolvedTicketData = {
        title: formData.title,
        ticketDescription: formData.ticketDescription,
        resolveDescription: formData.resolveDescription,
        originalTicketId: ticket.id,
        employeeId: currentUser?.userId || currentUser?.id || 1, // Default to 1 if no user
        adminId: currentUser?.userId || currentUser?.id || 1 // Same person for now
      };

      await ResolvedTicketService.createResolvedTicket(resolvedTicketData);
      
      if (onSuccess) {
        onSuccess('Ticket resolved successfully!');
      }
      
      onClose();
    } catch (err) {
      console.error('Error resolving ticket:', err);
      setError('Failed to resolve ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: ticket?.subject || '',
      ticketDescription: ticket?.description || '',
      resolveDescription: ''
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            🛠️ Resolve Ticket #{ticket?.id}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Resolution Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter resolution title"
              required
            />
          </div>

          {/* Original Ticket Description (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original Ticket Description
            </label>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 min-h-[80px]">
              {formData.ticketDescription || 'No description available'}
            </div>
          </div>

          {/* Resolution Description */}
          <div>
            <label htmlFor="resolveDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Resolution Details *
            </label>
            <textarea
              id="resolveDescription"
              name="resolveDescription"
              value={formData.resolveDescription}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe how you resolved this ticket..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Please provide detailed information about the resolution steps taken.
            </p>
          </div>

          {/* Ticket Info */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Ticket Information</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Ticket ID:</strong> #{ticket?.id}</p>
              <p><strong>Customer:</strong> {ticket?.customerName || 'Unknown'}</p>
              <p><strong>Status:</strong> {ticket?.status}</p>
              <p><strong>Priority:</strong> {ticket?.priority || 'Normal'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.resolveDescription.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Resolving...
                </>
              ) : (
                '✅ Mark as Resolved'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketResolutionModal;