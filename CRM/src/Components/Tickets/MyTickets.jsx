import React, { useState, useEffect } from 'react';
import TicketService, { TicketStatus, formatDate } from '../../services/TicketService';
import AuthService from '../../services/AuthService';
import Pagination from '../common/Pagination';
// keep bootstrap icons if you still use those icons
import 'bootstrap-icons/font/bootstrap-icons.css';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewMode, setViewMode] = useState('view');

  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5);

  const currentEmployee = AuthService.getCurrentEmployee();

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      if (!currentEmployee?.userId) {
        setError('Unable to identify current employee.');
        setLoading(false);
        return;
      }

      const allTickets = await TicketService.getAllTickets();

      const myTickets = allTickets.filter(
        (ticket) =>
          (ticket.employeeName === currentEmployee.name ||
            ticket.employeeId === currentEmployee.userId ||
            ticket.employeeEmail === currentEmployee.email) &&
          (ticket.status === TicketStatus.IN_PROGRESS || ticket.status === TicketStatus.RESOLVED)
      );

      // Sort tickets to ensure IN_PROGRESS tickets appear above RESOLVED tickets
      const sortedTickets = [...myTickets].sort((a, b) => {
        if (a.status === TicketStatus.IN_PROGRESS && b.status !== TicketStatus.IN_PROGRESS) {
          return -1;
        }
        if (a.status !== TicketStatus.IN_PROGRESS && b.status === TicketStatus.IN_PROGRESS) {
          return 1;
        }
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      });

      setTickets(sortedTickets);
      setError(null);
    } catch (err) {
      setError('Error loading your tickets. Please try again later.');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case TicketStatus.NEW:
        return 'bg-blue-500 text-white';
      case TicketStatus.IN_PROGRESS:
        return 'bg-yellow-400 text-black';
      case TicketStatus.RESOLVED:
        return 'bg-green-500 text-white';
      case TicketStatus.CLOSED:
        return 'bg-gray-500 text-white';
      case TicketStatus.URGENT:
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setViewMode('view');
    setShowTicketModal(true);
  };

  const handleEditTicket = () => {
    setViewMode('edit');
  };

  const handleCancelEdit = () => {
    setViewMode('view');
  };

  const handleSaveTicket = async () => {
    if (!selectedTicket) return;

    try {
      if (selectedTicket.status === TicketStatus.URGENT) {
        await TicketService.escalateTicket(selectedTicket.id);
        setError(null);
        setSuccessMessage('Ticket has been escalated to admin successfully.');
      } else {
        await TicketService.updateTicket(selectedTicket.id, selectedTicket);
        setError(null);
      }
      setShowTicketModal(false);
      fetchTickets();
    } catch (err) {
      setError('Failed to update ticket. Please try again.');
      console.error('Error updating ticket:', err);
    }
  };

  const handleTicketResolved = async () => {
    if (!selectedTicket) return;

    try {
      const updatedTicket = { ...selectedTicket, status: TicketStatus.RESOLVED };
      await TicketService.updateTicket(selectedTicket.id, updatedTicket);
      setShowTicketModal(false);
      fetchTickets();
      setError(null);
    } catch (err) {
      setError('Failed to mark ticket as resolved. Please try again.');
      console.error('Error updating ticket:', err);
    }
  };

  // Pagination slice
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  return (
    <div className="mt-4 px-4">
      <div
        className="flex justify-between items-center mb-4 p-4 rounded shadow"
        style={{ backgroundColor: '#1a2236', color: 'white' }}
      >
        <h3 className="m-0 text-lg font-semibold flex items-center">
          <i className="bi bi-person-workspace me-2 mr-2"></i>
          My Tickets
        </h3>
        <div>
          <button
            onClick={fetchTickets}
            className="inline-flex items-center px-3 py-1 text-sm bg-white text-gray-800 rounded hover:opacity-90"
          >
            <i className="bi bi-arrow-clockwise mr-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded">
            {error}
          </div>
        </div>
      )}
      {successMessage && (
        <div className="mb-4">
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded">
            {successMessage}
          </div>
        </div>
      )}

      <div>
        <div className="bg-white rounded shadow">
          <div className="p-4">
            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10" role="status" />
                <span className="sr-only">Loading...</span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center p-8 text-gray-600">
                <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3">You don't have any tickets currently assigned to you</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">#</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Subject</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Customer</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Created</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Updated</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-4 py-2 text-sm text-gray-700">{ticket.id}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{ticket.subject}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{ticket.customerName}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getBadgeClass(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">{formatDate(ticket.createdAt)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{formatDate(ticket.updatedAt)}</td>
                          <td className="px-4 py-2 text-sm">
                            <button
                              onClick={() => handleOpenTicket(ticket)}
                              className="inline-flex items-center px-3 py-1 text-sm border border-blue-500 rounded mr-2 hover:bg-blue-50"
                            >
                              <i className="bi bi-eye mr-2"></i>
                              View
                            </button>
                            {ticket.status === TicketStatus.IN_PROGRESS && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedTicket(ticket);
                                    handleTicketResolved();
                                  }}
                                  className="inline-flex items-center px-3 py-1 text-sm border border-green-500 rounded hover:bg-green-50 mr-2"
                                >
                                  <i className="bi bi-check-circle mr-2"></i>
                                  Resolve
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTicket({ ...ticket, status: TicketStatus.URGENT });
                                    handleSaveTicket();
                                  }}
                                  className="inline-flex items-center px-3 py-1 text-sm border border-red-500 rounded hover:bg-red-50"
                                >
                                  <i className="bi bi-arrow-up-circle mr-2"></i>
                                  Escalate
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    itemsPerPage={ticketsPerPage}
                    totalItems={tickets.length}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowTicketModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 z-10">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-medium">
                {viewMode === 'view' ? 'Ticket Details' : 'Edit Ticket'}
              </h3>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {selectedTicket && (
                viewMode === 'view' ? (
                  <div>
                    <h5 className="text-lg font-semibold">{selectedTicket.subject}</h5>
                    <div className={`inline-block px-2 py-1 text-xs font-medium rounded mt-2 ${getBadgeClass(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </div>

                    <p className="mt-4 font-semibold">Description:</p>
                    <div className="border p-3 bg-gray-50 rounded">{selectedTicket.description}</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium">Customer:</p>
                        <p className="text-sm">{selectedTicket.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email:</p>
                        <p className="text-sm">{selectedTicket.customerEmail}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium">Created:</p>
                        <p className="text-sm">{formatDate(selectedTicket.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Updated:</p>
                        <p className="text-sm">{formatDate(selectedTicket.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <input
                        type="text"
                        value={selectedTicket.subject || ''}
                        readOnly
                        disabled
                        className="w-full border px-3 py-2 rounded bg-gray-100"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        rows={5}
                        value={selectedTicket.description || ''}
                        readOnly
                        disabled
                        className="w-full border px-3 py-2 rounded bg-gray-100"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => setSelectedTicket({ ...selectedTicket, status: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                      >
                        <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TicketStatus.RESOLVED}>Resolved</option>
                        <option value={TicketStatus.URGENT}>Escalate to Admin</option>
                      </select>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="flex items-center justify-end px-4 py-3 border-t gap-2">
              {viewMode === 'view' ? (
                <>
                  <button
                    onClick={() => setShowTicketModal(false)}
                    className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    Close
                  </button>

                  {selectedTicket?.status === TicketStatus.IN_PROGRESS && (
                    <button
                      onClick={handleTicketResolved}
                      className="px-3 py-1 rounded border border-green-500 hover:bg-green-50"
                    >
                      <i className="bi bi-check-circle me-1 mr-2"></i> Mark as Resolved
                    </button>
                  )}

                  <button
                    onClick={handleEditTicket}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:opacity-95"
                  >
                    <i className="bi bi-pencil me-1 mr-2"></i> Edit
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTicket}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:opacity-95"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
