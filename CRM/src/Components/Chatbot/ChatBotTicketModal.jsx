/**
 * ChatBotTicketModal.jsx
 * 
 * COMPONENT: Chatbot-to-Ticket Creation Interface
 * 
 * PURPOSE:
 * - Convert chatbot conversations into formal support tickets
 * - Bridge the gap between automated chat and human support
 * - Capture customer issues that require technical assistance
 * - Integrate chatbot context with ticket management system
 * 
 * WORKFLOW:
 * 1. Customer interacts with chatbot and requests human support
 * 2. Chatbot determines issue requires ticket creation
 * 3. This modal opens with pre-populated data from chat context
 * 4. Customer can review/edit ticket details before submission
 * 5. Ticket created with 'NEW' status and routed to employee dashboard
 * 6. Customer receives confirmation with ticket ID for tracking
 * 
 * PROPS:
 * - isOpen: Boolean controlling modal visibility
 * - onClose: Function to close modal and return to chat
 * - chatbotData: Object containing conversation context and suggested values
 * - currentUser: Customer information for ticket attribution
 * - onSuccess: Callback function for successful ticket creation
 * 
 * INTEGRATION POINTS:
 * - TicketService: Creates tickets with proper NEW status and fallback handling
 * - ChatBot: Receives conversation context and category suggestions
 * - Customer Dashboard: Created tickets appear in customer ticket list
 * - Employee Dashboard: New tickets appear in employee queue for processing
 * 
 * DATA FLOW:
 * Chatbot Context → Form Pre-population → Validation → TicketService.createTicket() → 
 * Demo/API Storage → Employee Queue → Customer Confirmation
 * 
 * FEATURES:
 * - Form validation for required fields
 * - Priority selection (LOW, MEDIUM, HIGH, URGENT)
 * - Category classification for proper routing
 * - Conversation summary inclusion in ticket description
 * - Error handling with user-friendly messages
 * - Loading states during submission
 * - Source tracking ('CHATBOT') for analytics
 */

import React, { useState } from 'react';
import TicketService from '../../services/TicketService'; // Enabled for proper integration

const ChatBotTicketModal = ({ 
  isOpen, 
  onClose, 
  chatbotData = {},    // Conversation context from chatbot
  currentUser,         // Customer information
  onSuccess            // Success callback for chat interface
}) => {
  // FORM STATE - Pre-populated from chatbot conversation
  const [formData, setFormData] = useState({
    subject: chatbotData.category || '',                    // Suggested subject from chat
    description: chatbotData.customerMessage || '',        // Customer's message from chat
    priority: 'MEDIUM',                                     // Default priority for chatbot tickets
    category: chatbotData.category || 'General Support'    // Category classification
  });
  
  // UI STATE MANAGEMENT
  const [submitting, setSubmitting] = useState(false);     // Prevent double submission
  const [error, setError] = useState(null);                // Form validation and API errors

  /**
   * FORM INPUT HANDLER
   * Updates form state as customer modifies pre-populated values
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * TICKET CREATION HANDLER
   * Validates form data and creates ticket via TicketService
   * Includes conversation context and ensures NEW status
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // VALIDATION: Ensure required fields are completed
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // TICKET DATA PREPARATION - Include chatbot context and conversation summary
      const ticketData = {
        subject: formData.subject,
        description: `${formData.description}\n\n--- Chatbot Conversation Summary ---\n${chatbotData.conversationSummary || 'Customer requested support via chatbot.'}`,
        priority: formData.priority,
        status: 'NEW', // Ensure tickets created by chatbot always have NEW status
        customerId: currentUser?.userId || currentUser?.id || 1,
        customerName: currentUser?.name || 'Chatbot User',
        customerEmail: currentUser?.email || 'chatbot@demo.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: formData.category,
        source: 'CHATBOT' // Mark as chatbot-created for tracking
      };

      console.log('Creating ticket with data:', ticketData);
      
      // Use TicketService to create the ticket properly
      const result = await TicketService.createTicket(ticketData, ticketData.customerId);
      console.log('Chatbot ticket created successfully:', result);
      
      if (onSuccess) {
        onSuccess(`Support ticket created successfully! Ticket ID: ${result.id || `TCK-${Date.now()}`}. Our team will get back to you soon.`);
      }
      
      onClose();
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      subject: chatbotData.category || '',
      description: chatbotData.customerMessage || '',
      priority: 'MEDIUM',
      category: chatbotData.category || 'General Support'
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              🎫
            </div>
            <h2 className="text-xl font-semibold">
              Create Support Ticket
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <span className="mr-2">ℹ️</span>
              <p className="text-sm">
                Our chatbot couldn't resolve your issue, but don't worry! Our support team will help you personally.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low - General inquiry</option>
              <option value="MEDIUM">Medium - Standard support</option>
              <option value="HIGH">High - Urgent issue</option>
              <option value="CRITICAL">Critical - Service down</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide detailed information about your issue..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your conversation with the chatbot will be included automatically.
            </p>
          </div>

          {/* Chatbot Context Info */}
          {chatbotData.category && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Chatbot Session Info</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Category:</strong> {chatbotData.category}</p>
                {chatbotData.issue && <p><strong>Issue Type:</strong> {chatbotData.issue}</p>}
                <p><strong>Attempted Solutions:</strong> Yes, via chatbot</p>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Your Information</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Name:</strong> {currentUser?.name || 'Not provided'}</p>
              <p><strong>Email:</strong> {currentUser?.email || 'Not provided'}</p>
              <p><strong>Customer ID:</strong> #{currentUser?.userId || currentUser?.id || 'Unknown'}</p>
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
              disabled={submitting || !formData.subject.trim() || !formData.description.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Creating Ticket...
                </>
              ) : (
                '🎫 Create Support Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBotTicketModal;