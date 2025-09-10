import React, { useState, useEffect } from "react";
import { BiArchive } from "react-icons/bi";
import TicketService, { TicketStatus, formatDate } from "../../services/TicketService";
import Pagination from "../common/Pagination";

const ClosedTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const allTickets = await TicketService.getAllTickets();
      const closedTickets = allTickets.filter(
        (ticket) => ticket.status === TicketStatus.CLOSED
      );
      setTickets(closedTickets);
      setError(null);
    } catch (err) {
      setError("Error loading closed tickets. Please try again later.");
      console.error("Error fetching closed tickets:", err);
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
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  // Pagination logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-3 rounded bg-[#1a2236] text-white shadow">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <span className="material-icons">archive</span>
          Closed Tickets
        </h3>
        <button
          onClick={fetchTickets}
          className="bg-white text-black text-sm px-3 py-1 rounded shadow hover:bg-gray-200"
        >
          <span className="material-icons align-middle mr-1">refresh</span>
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {/* Card */}
      <div className="bg-white shadow rounded">
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center p-5">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center p-5">
              <BiArchive className="text-gray-400 text-6xl mx-auto mb-3" />
              <p className="mt-3 text-gray-500">No closed tickets found</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 border">#</th>
                      <th className="px-3 py-2 border">Subject</th>
                      <th className="px-3 py-2 border">Customer</th>
                      <th className="px-3 py-2 border">Handler</th>
                      <th className="px-3 py-2 border">Status</th>
                      <th className="px-3 py-2 border">Created</th>
                      <th className="px-3 py-2 border">Closed</th>
                      <th className="px-3 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border">{ticket.id}</td>
                        <td className="px-3 py-2 border">{ticket.subject}</td>
                        <td className="px-3 py-2 border">{ticket.customerName}</td>
                        <td className="px-3 py-2 border">
                          {ticket.employeeName || "N/A"}
                        </td>
                        <td className="px-3 py-2 border">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${getBadgeColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 border">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="px-3 py-2 border">
                          {formatDate(ticket.updatedAt)}
                        </td>
                        <td className="px-3 py-2 border">
                          <button
                            onClick={() => handleOpenTicket(ticket)}
                            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-xs px-2 py-1 rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
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

      {/* Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Ticket Details</h2>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              {selectedTicket && (
                <div>
                  <h5 className="text-xl font-semibold mb-2">
                    {selectedTicket.subject}
                  </h5>
                  <span
                    className={`inline-block mb-3 px-2 py-1 text-xs font-semibold rounded ${getBadgeColor(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status}
                  </span>

                  <p className="font-semibold">Description:</p>
                  <p className="border p-3 bg-gray-100 rounded">
                    {selectedTicket.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="font-semibold">Customer:</p>
                      <p>{selectedTicket.customerName}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Email:</p>
                      <p>{selectedTicket.customerEmail}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="font-semibold">Handled By:</p>
                    <p>{selectedTicket.employeeName || "N/A"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="font-semibold">Created:</p>
                      <p>{formatDate(selectedTicket.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Closed:</p>
                      <p>{formatDate(selectedTicket.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setShowTicketModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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

export default ClosedTickets;
