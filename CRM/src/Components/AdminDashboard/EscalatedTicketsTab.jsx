// FILE: src/Components/AdminDashboard/EscalatedTicketsTab.jsx
import React, { useState, useEffect } from "react";
import TicketService from "../../services/TicketService";
import TicketResolutionModal from "../Tickets/TicketResolutionModal";

const EscalatedTicketsTab = ({ onError }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchEscalatedTickets = async () => {
    try {
      setLoading(true);
      // Fetch all tickets and filter for escalated ones only (admin-level tickets)
      const response = await TicketService.getAllTickets();
      
      // Only show tickets that have been escalated to admin
      const escalatedTickets = response.filter(ticket => 
        ticket.status === 'URGENT'
      );
      
      setTickets(escalatedTickets);
    } catch (error) {
      console.error('Error fetching escalated tickets:', error);
      if (onError) {
        onError('Failed to load escalated tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshTickets = async () => {
    try {
      setRefreshing(true);
      await fetchEscalatedTickets();
    } finally {
      setRefreshing(false);
    }
  };

  const handleWorkOnTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleViewDetails = (ticket) => {
    setViewingTicket(ticket);
    setIsDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleResolutionSuccess = (message) => {
    if (onError) {
      // Use onError to show success message (assuming it can handle both error and success)
      onError(message);
    }
    // Refresh tickets after successful resolution
    fetchEscalatedTickets();
  };

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would have an endpoint for escalated tickets
        // For now, we'll fetch all tickets and filter for escalated ones
        const response = await TicketService.getAllTickets();
        
        // Filter for escalated tickets only (assuming there's an 'isEscalated' or 'priority' field)
        const escalatedTickets = response.filter(ticket => 
          ticket.priority === 'HIGH' || 
          ticket.priority === 'CRITICAL' || 
          ticket.isEscalated === true ||
          ticket.status === 'URGENT'
        );
        
        setTickets(escalatedTickets);
      } catch (error) {
        console.error('Error fetching escalated tickets:', error);
        if (onError) {
          onError('Failed to load escalated tickets');
        }
      } finally {
        setLoading(false);
      }
    };

    // Get current user info from localStorage or default
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(userInfo);

    loadTickets();
  }, [onError]);

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-600 text-white';
      case 'HIGH':
        return 'bg-orange-600 text-white';
      case 'MEDIUM':
        return 'bg-yellow-600 text-white';
      case 'LOW':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'URGENT':
        return 'border-red-200 bg-red-50 text-red-700';
      case 'OPEN':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'IN_PROGRESS':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      case 'RESOLVED':
        return 'border-green-200 bg-green-50 text-green-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading escalated tickets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Escalated Tickets</h2>
        <div className="flex items-center space-x-3">
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
            Admin Only
          </span>
          <button
            onClick={refreshTickets}
            disabled={refreshing}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {refreshing ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Refreshing...
              </span>
            ) : (
              'Refresh'
            )}
          </button>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Escalated Tickets</h3>
          <p className="text-gray-500">
            Escalated tickets will appear here when they require admin attention.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className={`border rounded-lg p-4 ${getStatusColor(ticket.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">
                  {ticket.subject || ticket.title || `Ticket #${ticket.id}`}
                </h3>
                <div className="flex items-center space-x-2">
                  {ticket.priority && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  )}
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    #{ticket.id}
                  </span>
                </div>
              </div>
              
              {ticket.description && (
                <p className="text-sm mb-3 line-clamp-2">
                  {ticket.description}
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="font-medium">Customer: </span>
                  <span>{ticket.customerName || ticket.customer?.name || 'Unknown'}</span>
                </div>
                <div>
                  <span className="font-medium">Created: </span>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
                <div>
                  <span className="font-medium">Assigned: </span>
                  <span>{ticket.assignedTo || ticket.employee?.name || 'Unassigned'}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-end mt-3 gap-2">
                {(ticket.status === 'URGENT' || ticket.status === 'NEW') && (
                  <button
                    onClick={() => handleWorkOnTicket(ticket)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    🛠️ Work On This
                  </button>
                )}
                <button
                  onClick={() => handleViewDetails(ticket)}
                  className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  📄 View Details
                </button>
              </div>
              
              {ticket.lastUpdated && (
                <div className="mt-2 text-xs">
                  <span className="font-medium">Last Updated: </span>
                  <span>{formatDate(ticket.lastUpdated)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ticket Resolution Modal */}
      <TicketResolutionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        ticket={selectedTicket}
        currentUser={currentUser}
        onSuccess={handleResolutionSuccess}
      />

      {/* Ticket Details Modal */}
      {isDetailsModalOpen && viewingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Ticket Details</h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket ID</label>
                <p className="text-gray-900">#{viewingTicket.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{viewingTicket.title || 'No title'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <p className="text-gray-900">{viewingTicket.customer || viewingTicket.customerName || 'Unknown'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  viewingTicket.status === 'URGENT' ? 'bg-red-100 text-red-800' :
                  viewingTicket.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                  viewingTicket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {viewingTicket.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  viewingTicket.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  viewingTicket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {viewingTicket.priority || 'NORMAL'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingTicket.description || 'No description available'}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p className="text-gray-900">{viewingTicket.created || 'Unknown'}</p>
              </div>
              
              {viewingTicket.assignedTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <p className="text-gray-900">{viewingTicket.assignedTo}</p>
                </div>
              )}
              
              {viewingTicket.lastUpdated && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{formatDate(viewingTicket.lastUpdated)}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              {(viewingTicket.status === 'URGENT' || viewingTicket.status === 'NEW') && (
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    handleWorkOnTicket(viewingTicket);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Work On This Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscalatedTicketsTab;
