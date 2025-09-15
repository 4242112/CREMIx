import React, { useState, useEffect } from "react";
import TicketService, { Ticket, TicketStatus, formatDate } from "../../services/TicketService";

const CustomerTickets = ({ customerId, customerEmail }) => {
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [creatingTicket, setCreatingTicket] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  const statusPriority = {
    [TicketStatus.NEW]: 1,
    [TicketStatus.RESOLVED]: 2,
    [TicketStatus.IN_PROGRESS]: 3,
    [TicketStatus.CLOSED]: 4,
  };

  const sortTicketsByPriority = (ticketsToSort) => {
    return [...ticketsToSort].sort(
      (a, b) =>
        (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999)
    );
  };

  useEffect(() => {
    if (customerId || customerEmail) fetchCustomerTickets();
  }, [customerId, customerEmail]);

  const fetchCustomerTickets = async () => {
    if (!customerId && !customerEmail) return;
    setLoadingTickets(true);
    try {
      let data = [];
      if (customerId) data = await TicketService.getTicketsByCustomerId(customerId);
      else if (customerEmail) data = await TicketService.getTicketsByEmail(customerEmail);
      setTickets(sortTicketsByPriority(data));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tickets. Please try again later.");
    } finally {
      setLoadingTickets(false);
    }
  };

  const refreshTickets = async () => {
    setSuccessMessage(null);
    await fetchCustomerTickets();
    setSuccessMessage("Tickets refreshed successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateTicket = async () => {
    if (!ticketSubject || !ticketDescription || !customerId) {
      setError("Please fill in all fields to create a ticket.");
      return;
    }
    setCreatingTicket(true);
    try {
      const newTicket = {
        subject: ticketSubject,
        description: ticketDescription,
        status: TicketStatus.NEW,
        customerId,
      };
      await TicketService.createTicket(newTicket, customerId);
      setSuccessMessage("Ticket created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowTicketModal(false);
      setTicketSubject("");
      setTicketDescription("");
      await fetchCustomerTickets();
    } catch (err) {
      console.error(err);
      setError("Failed to create ticket. Please try again later.");
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetailsModal(true);
  };

  const handleConfirmResolution = async (ticketId) => {
    if (!ticketId) return;
    setProcessingAction(true);
    try {
      await TicketService.confirmTicketResolution(ticketId);
      setSuccessMessage("Ticket resolution confirmed and closed successfully!");
      setShowTicketDetailsModal(false);
      await fetchCustomerTickets();
    } catch (err) {
      console.error(err);
      setError("Failed to confirm ticket resolution. Please try again.");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDenyResolution = async (ticketId) => {
    if (!ticketId) return;
    setProcessingAction(true);
    try {
      await TicketService.denyTicketResolution(ticketId);
      setSuccessMessage("Ticket returned to in-progress status.");
      setShowTicketDetailsModal(false);
      await fetchCustomerTickets();
    } catch (err) {
      console.error(err);
      setError("Failed to deny ticket resolution. Please try again.");
    } finally {
      setProcessingAction(false);
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case TicketStatus.NEW:
        return "bg-blue-100 text-blue-800";
      case TicketStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800";
      case TicketStatus.RESOLVED:
        return "bg-green-100 text-green-800";
      case TicketStatus.CLOSED:
        return "bg-gray-200 text-gray-800";
      case TicketStatus.URGENT:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loadingTickets) {
    return (
      <div className="text-center py-10">
        <div className="inline-block w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-700">Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white shadow rounded p-4">
        <h5 className="font-semibold">Your Support Tickets</h5>
        <button
          className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
          onClick={refreshTickets}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
          <button
            className="absolute top-1 right-2 text-green-700 font-bold"
            onClick={() => setSuccessMessage(null)}
          >
            ×
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            className="absolute top-1 right-2 text-red-700 font-bold"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* No tickets */}
      {tickets.length === 0 && (
        <div className="text-center py-10 text-gray-500 space-y-2">
          <div className="text-6xl">🎫</div>
          <h4>No Tickets Found</h4>
          <p>You haven't created any support tickets yet. Need help? Create a new ticket.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowTicketModal(true)}
          >
            Create New Ticket
          </button>
        </div>
      )}

      {/* Tickets Table */}
      {tickets.length > 0 && (
        <div className="overflow-x-auto">
          <button
            className="mb-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowTicketModal(true)}
          >
            + New Ticket
          </button>
          <table className="min-w-full border border-gray-200 table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">#</th>
                <th className="px-3 py-2 border">Subject</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Created</th>
                <th className="px-3 py-2 border">Updated</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border">{ticket.id}</td>
                  <td className="px-3 py-2 border">{ticket.subject}</td>
                  <td className={`px-2 py-1 border rounded text-sm ${getBadgeColor(ticket.status)}`}>
                    {ticket.status}
                  </td>
                  <td className="px-3 py-2 border">{formatDate(ticket.createdAt)}</td>
                  <td className="px-3 py-2 border">{formatDate(ticket.updatedAt)}</td>
                  <td className="px-3 py-2 border">
                    <div className="flex gap-1">
                      <button
                        className="px-2 py-1 text-blue-600 border border-blue-600 rounded text-sm hover:bg-blue-50"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold"
              onClick={() => setShowTicketModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">Create New Ticket</h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Subject</label>
                <input
                  type="text"
                  placeholder="Enter ticket subject"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter ticket description"
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowTicketModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleCreateTicket}
                disabled={creatingTicket}
              >
                {creatingTicket ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showTicketDetailsModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold"
              onClick={() => setShowTicketDetailsModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2">{selectedTicket.subject}</h3>
            <span className={`inline-block mb-3 px-2 py-1 rounded text-sm ${getBadgeColor(selectedTicket.status)}`}>
              {selectedTicket.status}
            </span>
            <p className="font-medium mb-1">Description:</p>
            <p className="border p-3 bg-gray-50 mb-3 rounded">{selectedTicket.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="font-medium mb-1">Created:</p>
                <p>{formatDate(selectedTicket.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Last Updated:</p>
                <p>{formatDate(selectedTicket.updatedAt)}</p>
              </div>
            </div>

            {selectedTicket.status === TicketStatus.RESOLVED && (
              <div className="mt-3 border-t pt-3">
                <h6 className="font-medium mb-1">Resolution Confirmation</h6>
                <p className="mb-3">This ticket has been resolved by our support team. Please confirm if the issue has been resolved to your satisfaction.</p>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleConfirmResolution(selectedTicket.id)}
                    disabled={processingAction}
                  >
                    Confirm Resolution
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDenyResolution(selectedTicket.id)}
                    disabled={processingAction}
                  >
                    Deny Resolution
                  </button>
                </div>
              </div>
            )}

            {/* Show message for already escalated tickets */}
            {selectedTicket.status === TicketStatus.URGENT && (
              <div className="mt-3 border-t pt-3">
                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <h6 className="font-medium mb-1 text-orange-800">Ticket Escalated</h6>
                  <p className="text-sm text-orange-700">
                    This ticket has been escalated to our admin team and will receive priority attention.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowTicketDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTickets;
