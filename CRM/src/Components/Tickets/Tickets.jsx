import React, { useState, useEffect } from "react";
import TicketService, {
  TicketStatus,
  formatDate,
} from "../../services/TicketService";
import AuthService from "../../services/AuthService";
import Pagination from "../common/Pagination";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewMode, setViewMode] = useState("view");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    status: TicketStatus.NEW,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);

  const isEmployee = AuthService.isEmployeeLoggedIn();
  const currentEmployee = AuthService.getCurrentEmployee();
  const isAdmin = currentEmployee?.role === "ADMIN";

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await TicketService.getAllTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      setError("Error loading tickets. Please try again later.");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case TicketStatus.NEW:
        return "bg-blue-500 text-white";
      case TicketStatus.IN_PROGRESS:
        return "bg-yellow-500 text-black";
      case TicketStatus.RESOLVED:
        return "bg-green-500 text-white";
      case TicketStatus.CLOSED:
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setViewMode("view");
    setShowTicketModal(true);
  };

  const handleEditTicket = () => {
    setViewMode("edit");
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket || !selectedTicket.id) return;

    try {
      await TicketService.updateTicket(selectedTicket.id, selectedTicket);
      setShowTicketModal(false);
      fetchTickets();
      setError(null);
    } catch (err) {
      setError("Failed to update ticket. Please try again.");
      console.error("Error updating ticket:", err);
    }
  };

  const handleCreateTicket = async () => {
    const customerId = 1;
    try {
      await TicketService.createTicket(newTicket, customerId);
      setShowCreateModal(false);
      setNewTicket({
        subject: "",
        description: "",
        status: TicketStatus.NEW,
      });
      fetchTickets();
      setError(null);
    } catch (err) {
      setError("Failed to create ticket. Please try again.");
      console.error("Error creating ticket:", err);
    }
  };

  const confirmDelete = (id) => {
    setTicketToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTicket = async () => {
    if (ticketToDelete === null) return;

    try {
      await TicketService.deleteTicket(ticketToDelete);
      setShowDeleteConfirm(false);
      fetchTickets();
      setError(null);
    } catch (err) {
      setError("Failed to delete ticket. Please try again.");
      console.error("Error deleting ticket:", err);
    }
  };

  const handleTicket = async () => {
    if (!selectedTicket?.id || !currentEmployee?.userId) return;

    try {
      await TicketService.assignTicketToEmployee(
        selectedTicket.id,
        currentEmployee.userId
      );
      setShowTicketModal(false);
      fetchTickets();
      setError(null);
    } catch (err) {
      setError("Failed to handle ticket. Please try again.");
      console.error("Error handling ticket:", err);
    }
  };

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-3 rounded bg-slate-900 text-white shadow">
        <h3 className="m-0 flex items-center gap-2">🎟️ Support Tickets</h3>
        <div className="flex gap-2">
          <button
            onClick={fetchTickets}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ New Ticket
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Ticket Table */}
      <div className="bg-white shadow rounded">
        {loading ? (
          <div className="text-center p-5">Loading...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center p-5 text-gray-500">
            📭 No tickets found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Created</th>
                  <th className="p-2 border">Last Updated</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{ticket.id}</td>
                    <td className="p-2 border">{ticket.subject}</td>
                    <td className="p-2 border">{ticket.customerName}</td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getBadgeColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="p-2 border">
                      {formatDate(ticket.updatedAt)}
                    </td>
                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => handleOpenTicket(ticket)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        👁 View
                      </button>
                      <button
                        onClick={() => ticket.id && confirmDelete(ticket.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              itemsPerPage={ticketsPerPage}
              totalItems={tickets.length}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
