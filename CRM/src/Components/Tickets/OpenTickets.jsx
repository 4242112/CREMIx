import React, { useState, useEffect } from "react";
import TicketService, { TicketStatus, formatDate } from "../../services/TicketService";
import AuthService from "../../services/AuthService";
import Pagination from "../common/Pagination";

const OpenTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("details");

  const currentEmployee = AuthService.getCurrentEmployee();
  const isAdmin = currentEmployee?.role === "ADMIN";

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const allTickets = await TicketService.getAllTickets();
      // Show only NEW status tickets
      const newTickets = allTickets.filter(
        (ticket) => ticket.status === TicketStatus.NEW || ticket.status === 'NEW'
      );
      setTickets(newTickets);
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
        return "bg-gray-200 text-black";
    }
  };

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
    setActiveTab("details");
  };

  const handleAcceptTicket = async () => {
    if (!selectedTicket || !currentEmployee) return;

    try {
      await TicketService.assignTicketToEmployee(
        selectedTicket.id,
        currentEmployee.userId
      );
      setShowTicketModal(false);
      fetchTickets();
      setError(null);
    } catch (err) {
      setError("Failed to accept ticket. Please try again.");
      console.error("Error updating ticket:", err);
    }
  };

  const showAcceptButton = !isAdmin;

  // Get current tickets for the page
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-slate-900 text-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="bi bi-inbox mr-2"></i> Open Tickets
        </h3>
        <button
          onClick={fetchTickets}
          className="bg-white text-slate-900 px-3 py-1 rounded shadow hover:bg-slate-100"
        >
          <i className="bi bi-arrow-clockwise mr-2"></i> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <i className="bi bi-inbox text-5xl"></i>
            <p className="mt-3">No new tickets available</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">#</th>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{ticket.id}</td>
                    <td className="p-2">{ticket.subject}</td>
                    <td className="p-2">{ticket.customerName}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${getBadgeColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-2">{formatDate(ticket.createdAt)}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleOpenTicket(ticket)}
                        className="border border-blue-500 text-blue-500 px-2 py-1 rounded text-sm hover:bg-blue-50"
                      >
                        <i className="bi bi-eye"></i> View
                      </button>
                      {showAcceptButton && (
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            handleAcceptTicket();
                          }}
                          className="border border-green-500 text-green-500 px-2 py-1 rounded text-sm hover:bg-green-50"
                        >
                          <i className="bi bi-check-circle"></i> Accept
                        </button>
                      )}
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
          </>
        )}
      </div>

      {/* Ticket Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h4 className="font-semibold">Ticket Details</h4>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              {/* Tabs */}
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 ${
                    activeTab === "details"
                      ? "border-b-2 border-blue-500 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  <i className="bi bi-info-circle mr-1"></i> Details
                </button>
                {/* AI Analysis Tab - Commented out until AITicketService is available
                <button
                  onClick={() => setActiveTab("ai-analysis")}
                  className={`px-4 py-2 ${
                    activeTab === "ai-analysis"
                      ? "border-b-2 border-blue-500 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  <i className="bi bi-robot mr-1"></i> AI Analysis
                </button>
                */}
              </div>

              {/* Details Tab */}
              {activeTab === "details" && (
                <div>
                  <h5>{selectedTicket.subject}</h5>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded mb-3 ${getBadgeColor(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status}
                  </span>

                  <p className="font-semibold">Description:</p>
                  <p className="border p-3 bg-gray-50 rounded">
                    {selectedTicket.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="font-semibold">Customer:</p>
                      <p>{selectedTicket.customerName}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Email:</p>
                      <p>{selectedTicket.customerEmail}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Created:</p>
                      <p>{formatDate(selectedTicket.createdAt)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Analysis Tab - Commented out until AITicketService is available
              {activeTab === "ai-analysis" && (
                <div>
                  {aiError && (
                    <div className="p-3 bg-red-100 text-red-700 rounded mb-3">
                      {aiError}
                    </div>
                  )}

                  {!ticketAnalysis && !aiLoading && (
                    <div className="text-center p-5">
                      <i className="bi bi-graph-up text-5xl text-blue-500"></i>
                      <p className="mt-3">
                        Get AI-powered insights about this ticket
                      </p>
                      <button
                        onClick={analyzeTicket}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        <i className="bi bi-magic mr-1"></i> Analyze Ticket
                      </button>
                    </div>
                  )}

                  {aiLoading && (
                    <div className="text-center p-5">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mx-auto"></div>
                      <p className="mt-3">Analyzing ticket...</p>
                    </div>
                  )}

                  {ticketAnalysis && (
                    <div className="bg-gray-50 border rounded p-4">
                      <h5 className="mb-3 font-semibold">Ticket Analysis</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p>
                            <strong>Sentiment:</strong>{" "}
                            <span
                              className={`px-2 py-1 text-xs rounded ${getSentimentBadge(
                                ticketAnalysis.sentiment
                              )}`}
                            >
                              {ticketAnalysis.sentiment}
                            </span>
                          </p>
                          <p>
                            <strong>Urgency:</strong>{" "}
                            <span
                              className={`px-2 py-1 text-xs rounded ${getUrgencyBadge(
                                ticketAnalysis.urgency
                              )}`}
                            >
                              {ticketAnalysis.urgency}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Complexity:</strong>{" "}
                            {ticketAnalysis.complexity}
                          </p>
                          <p>
                            <strong>Keywords:</strong>{" "}
                            {ticketAnalysis.keywords}
                          </p>
                        </div>
                      </div>

                      <hr className="my-4" />

                      <h6 className="mb-2 font-semibold">
                        Smart Recommendations
                      </h6>
                      <ul className="list-disc pl-5 space-y-2">
                        {ticketAnalysis.urgency.toLowerCase() === "high" && (
                          <li className="text-red-600 font-medium">
                            ⚠️ This ticket requires immediate attention
                          </li>
                        )}
                        {ticketAnalysis.complexity.toLowerCase() ===
                          "complex" && (
                          <li className="text-yellow-600 font-medium">
                            🧩 May require specialized knowledge or escalation
                          </li>
                        )}
                        {ticketAnalysis.sentiment.toLowerCase() ===
                          "negative" && (
                          <li className="text-blue-600 font-medium">
                            😟 Customer appears frustrated; consider
                            prioritizing
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              */}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t p-4">
              <button
                onClick={() => setShowTicketModal(false)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                Close
              </button>
              {showAcceptButton && (
                <button
                  onClick={handleAcceptTicket}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  <i className="bi bi-check-circle mr-1"></i> Accept Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenTickets;
