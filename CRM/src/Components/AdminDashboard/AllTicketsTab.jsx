// FILE: src/Components/AdminDashboard/AllTicketsTab.jsx
import React, { useState, useEffect } from "react";
import TicketService from "../../services/TicketService";

const AllTicketsTab = ({ onError }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL, NEW, IN_PROGRESS, ESCALATED, CLOSED

  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      const response = await TicketService.getAllTickets();
      setTickets(response || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      if (onError) {
        onError('Failed to load tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshTickets = async () => {
    try {
      setRefreshing(true);
      await fetchAllTickets();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const getFilteredTickets = () => {
    if (filter === 'ALL') return tickets;
    return tickets.filter(ticket => ticket.status === filter);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'ESCALATED':
        return 'bg-red-100 text-red-800';
      case 'CLOSED':
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEscalateTicket = async (ticketId) => {
    try {
      await TicketService.escalateTicket(ticketId);
      await refreshTickets();
    } catch (error) {
      console.error('Error escalating ticket:', error);
      if (onError) {
        onError('Failed to escalate ticket');
      }
    }
  };

  const handleAssignTicket = async (ticketId, employeeId) => {
    try {
      await TicketService.assignTicketToEmployee(ticketId, employeeId);
      await refreshTickets();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      if (onError) {
        onError('Failed to assign ticket');
      }
    }
  };

  const filteredTickets = getFilteredTickets();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Tickets</h2>
          <p className="text-gray-600">Manage all customer support tickets</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Tickets ({tickets.length})</option>
            <option value="NEW">New ({tickets.filter(t => t.status === 'NEW').length})</option>
            <option value="IN_PROGRESS">In Progress ({tickets.filter(t => t.status === 'IN_PROGRESS').length})</option>
            <option value="ESCALATED">Escalated ({tickets.filter(t => t.status === 'ESCALATED').length})</option>
            <option value="CLOSED">Closed ({tickets.filter(t => t.status === 'CLOSED').length})</option>
          </select>
          
          {/* Refresh button */}
          <button
            onClick={refreshTickets}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Tickets table */}
      {filteredTickets.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600">
            {filter === 'ALL' 
              ? 'No tickets have been created yet.' 
              : `No tickets with status "${filter}" found.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.subject || 'No Subject'}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {ticket.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ticket.customer?.name || ticket.customerName || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ticket.customer?.email || ticket.customerEmail || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(ticket.status)}`}>
                        {ticket.status || 'NEW'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL' 
                          ? 'bg-red-100 text-red-800' 
                          : ticket.priority === 'MEDIUM' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority || 'NORMAL'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        View
                      </button>
                      {ticket.status !== 'ESCALATED' && (
                        <button 
                          onClick={() => handleEscalateTicket(ticket.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Escalate
                        </button>
                      )}
                      {ticket.status === 'NEW' && (
                        <button className="text-green-600 hover:text-green-900 transition-colors">
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTicketsTab;