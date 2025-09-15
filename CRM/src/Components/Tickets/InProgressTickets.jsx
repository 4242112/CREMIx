import React, { useState, useEffect } from 'react';
import TicketService, { TicketStatus, formatDate } from '../../services/TicketService';

const InProgressTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewMode, setViewMode] = useState('view');

  // AI features - Commented out
  // const [suggestions, setSuggestions] = useState([]);
  // const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  // const [suggestionsError, setSuggestionsError] = useState(null);
  // const [generatedText, setGeneratedText] = useState('');
  // const [generating, setGenerating] = useState(false);
  // const [responseTone, setResponseTone] = useState('professional');
  
  const [customResponse, setCustomResponse] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const allTickets = await TicketService.getAllTickets();

      const inProgressTickets = allTickets.filter(
        ticket => ticket.status === TicketStatus.IN_PROGRESS
      );

      setTickets(inProgressTickets);
      setError(null);
    } catch (err) {
      setError('Error loading in-progress tickets. Please try again later.');
      console.error('Error fetching in-progress tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case TicketStatus.NEW:
        return 'bg-blue-500 text-white';
      case TicketStatus.IN_PROGRESS:
        return 'bg-yellow-400 text-black';
      case TicketStatus.RESOLVED:
        return 'bg-green-500 text-white';
      case TicketStatus.CLOSED:
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setViewMode('view');
    setShowTicketModal(true);
    setCustomResponse('');
    setActiveTab('details');
  };

  // Removed handleEditTicket as it's no longer needed - Done button now closes modal

  const handleSaveDraft = async () => {
    if (!selectedTicket || !customResponse.trim()) {
      setError('Please enter a response before saving.');
      return;
    }

    try {
      // Save the draft response to the ticket
      const updatedTicket = {
        ...selectedTicket,
        draftResponse: customResponse,
        lastUpdated: new Date().toISOString()
      };
      
      await TicketService.updateTicket(selectedTicket.id, updatedTicket);
      setError(null);
      
      // Show success message or update UI as needed
      console.log('Draft saved successfully');
      
      // Optionally refresh the ticket data
      fetchTickets();
    } catch (err) {
      setError('Failed to save draft. Please try again.');
      console.error('Error saving draft:', err);
    }
  };

  const handleCloseModal = () => {
    setShowTicketModal(false);
    setSelectedTicket(null);
    setCustomResponse('');
    setViewMode('view');
    setActiveTab('details');
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket || !selectedTicket.id) return;

    try {
      await TicketService.updateTicket(selectedTicket.id, selectedTicket);
      setShowTicketModal(false);
      fetchTickets();
      setError(null);
    } catch (err) {
      setError('Failed to update ticket. Please try again.');
      console.error('Error updating ticket:', err);
    }
  };

  // AI features
  // Removed AI functionality - AITicketService no longer available
  // const fetchAiSuggestions = async () => {
  //   if (!selectedTicket || !selectedTicket.id) return;

  //   setAiLoading(true);
  //   setAiError(null);

  //   try {
  //     const suggestions = await AITicketService.getResponseSuggestions(selectedTicket.id);
  //     setAiResponseSuggestions(suggestions);
  //   } catch (err) {
  //     console.error('Error fetching AI suggestions:', err);
  //     setAiError('Failed to load AI suggestions. Please try again.');
  //   } finally {
  //     setAiLoading(false);
  //   }
  // };

  // Removed AI functionality - AITicketService no longer available
  // const generateResponseDraft = async () => {
  //   if (!selectedTicket || !selectedTicket.id) return;

  //   setAiLoading(true);
  //   setAiError(null);

  //   try {
  //     const responseText = await AITicketService.generateResponseDraft(selectedTicket.id, responseTone);
  //     setCustomResponse(responseText);
  //   } catch (err) {
  //     console.error('Error generating response draft:', err);
  //     setAiError('Failed to generate response draft. Please try again.');
  //   } finally {
  //     setAiLoading(false);
  //   }
  // };

  // Removed AI-related functions since AITicketService is no longer available

  // Removed copyToClipboard function as Save button now saves to database

  return (
    <div className="p-4">
      {/* Header */}
      <div
        className="flex justify-between items-center mb-4 p-3 rounded"
        style={{
          backgroundColor: '#1a2236',
          color: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      >
        <h3 className="m-0 flex items-center gap-2">
          <span aria-hidden>⏳</span>
          In-Progress Tickets
        </h3>
        <div>
          <button
            onClick={fetchTickets}
            className="bg-white text-black text-sm px-3 py-1 rounded shadow hover:bg-gray-200"
          >
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4">
          <div className="rounded bg-red-100 text-red-700 p-3">{error}</div>
        </div>
      )}

      {/* Card */}
      <div className="bg-white shadow rounded">
        <div className="p-4">
          {loading ? (
            <div className="text-center p-5">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center p-5">
              <div className="text-gray-400 text-6xl">📋</div>
              <p className="mt-3 text-gray-500">No tickets are currently in progress</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 border">#</th>
                    <th className="px-3 py-2 border">Subject</th>
                    <th className="px-3 py-2 border">Customer</th>
                    <th className="px-3 py-2 border">Handled By</th>
                    <th className="px-3 py-2 border">Status</th>
                    <th className="px-3 py-2 border">Created</th>
                    <th className="px-3 py-2 border">Last Updated</th>
                    <th className="px-3 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border align-top">{ticket.id}</td>
                      <td className="px-3 py-2 border align-top">{ticket.subject}</td>
                      <td className="px-3 py-2 border align-top">{ticket.customerName}</td>
                      <td className="px-3 py-2 border align-top">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${'bg-blue-200 text-blue-800'}`}>
                          {ticket.employeeName || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-3 py-2 border align-top">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${getBadgeColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 border align-top">{formatDate(ticket.createdAt)}</td>
                      <td className="px-3 py-2 border align-top">{formatDate(ticket.updatedAt)}</td>
                      <td className="px-3 py-2 border align-top">
                        <button
                          onClick={() => handleOpenTicket(ticket)}
                          className="text-xs px-2 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {viewMode === 'view' ? 'Ticket Details' : 'Edit Ticket'}
              </h2>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              {selectedTicket && viewMode === 'view' ? (
                <>
                  {/* Tabs */}
                  <div>
                    <div className="flex gap-2 border-b mb-4">
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`py-2 px-3 -mb-px ${activeTab === 'details' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-600'}`}
                      >
                        ℹ️ Details
                      </button>
                      <button
                        onClick={() => setActiveTab('response-composer')}
                        className={`py-2 px-3 -mb-px ${activeTab === 'response-composer' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-600'}`}
                      >
                        ✏️ Compose Response
                      </button>
                      {/* AI Suggestions Tab - Commented out until AITicketService is available
                      <button
                        onClick={() => setActiveTab('ai-suggestions')}
                        className={`py-2 px-3 -mb-px ${activeTab === 'ai-suggestions' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-600'}`}
                      >
                        🤖 AI Suggestions
                      </button>
                      */}
                    </div>

                    {activeTab === 'details' && (
                      <div>
                        <h5 className="text-xl font-semibold">{selectedTicket.subject}</h5>
                        <div className={`inline-block mb-3 px-2 py-1 text-xs font-semibold rounded ${getBadgeColor(selectedTicket.status)}`}>
                          {selectedTicket.status}
                        </div>

                        <p className="font-semibold mt-2">Description:</p>
                        <div className="border p-3 bg-gray-100 rounded whitespace-pre-wrap">{selectedTicket.description}</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="mb-1 font-semibold">Customer:</p>
                            <p>{selectedTicket.customerName}</p>
                          </div>
                          <div>
                            <p className="mb-1 font-semibold">Email:</p>
                            <p>{selectedTicket.customerEmail}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="mb-1 font-semibold">Assigned To:</p>
                            <p>{selectedTicket.employeeName || 'Unassigned'}</p>
                          </div>
                          <div>
                            <p className="mb-1 font-semibold">Employee Email:</p>
                            <p>{selectedTicket.employeeEmail || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="mb-1 font-semibold">Created:</p>
                            <p>{formatDate(selectedTicket.createdAt)}</p>
                          </div>
                          <div>
                            <p className="mb-1 font-semibold">Last Updated:</p>
                            <p>{formatDate(selectedTicket.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* activeTab === 'ai-suggestions' && (
                      <div>
                        {aiError && <div className="rounded bg-red-100 text-red-700 p-3 mb-3">{aiError}</div>}

                        {!aiResponseSuggestions && !aiLoading && (
                          <div className="text-center p-5">
                            <div className="text-yellow-400 text-4xl">💡</div>
                            <p className="mt-3 text-gray-600">Get AI assistance with responding to this ticket</p>
                            <div className="mt-3">
                              <button
                                onClick={fetchAiSuggestions}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                              >
                                ✨ Generate Response Suggestions
                              </button>
                            </div>
                          </div>
                        )}

                        {aiLoading && (
                          <div className="text-center p-5">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500"></div>
                            <p className="mt-3 text-gray-600">Analyzing ticket and generating suggestions...</p>
                          </div>
                        )}

                        {aiResponseSuggestions && (
                          <div>
                            <div className="mb-4 rounded bg-gray-50 p-3">
                              <h5 className="mb-2 font-semibold">Ticket Analysis</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p><strong>Sentiment:</strong> <span className={`inline-block px-2 py-0.5 rounded text-xs ${getSentimentBadge(aiResponseSuggestions.analysis.sentiment)}`}>{aiResponseSuggestions.analysis.sentiment}</span></p>
                                  <p className="mt-1"><strong>Urgency:</strong> <span className={`inline-block px-2 py-0.5 rounded text-xs ${getUrgencyBadge(aiResponseSuggestions.analysis.urgency)}`}>{aiResponseSuggestions.analysis.urgency}</span></p>
                                </div>
                                <div>
                                  <p><strong>Complexity:</strong> {aiResponseSuggestions.analysis.complexity}</p>
                                  <p className="mt-1"><strong>Keywords:</strong> {aiResponseSuggestions.analysis.keywords}</p>
                                </div>
                              </div>
                            </div>

                            <h5 className="mb-2">Response Suggestions</h5>
                            <p className="text-sm text-gray-500 mb-3">Select a suggestion to use as a starting point for your response.</p>

                            <div className="space-y-3">
                              {aiResponseSuggestions.suggestions.map((suggestion, index) => (
                                <div key={index} className={`border rounded ${selectedSuggestion === suggestion ? 'border-blue-500' : 'border-gray-200'}`}>
                                  <div className="flex justify-between items-center p-3 border-b">
                                    <div>
                                      <strong>Suggestion {index + 1}</strong>
                                      <span className="ml-2 text-sm text-gray-500">{index === 0 ? '(Brief)' : index === 1 ? '(Detailed)' : '(With Questions)'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleSelectSuggestion(suggestion)}
                                        className="text-sm px-2 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                                      >
                                        ✓ Use This
                                      </button>
                                      <button
                                        onClick={() => copyToClipboard(suggestion)}
                                        className="text-sm px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
                                      >
                                        📋
                                      </button>
                                    </div>
                                  </div>
                                  <div className="p-3 whitespace-pre-wrap">{suggestion}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )} */}

                    {activeTab === 'response-composer' && (
                      <div>
                        <div className="mb-3 flex justify-between items-start gap-3">
                          <label className="font-semibold">Response Draft</label>
                          {/* AI generation features - Commented out until AITicketService is available
                          <div className="flex gap-2 items-center">
                            <select
                              value={responseTone}
                              onChange={(e) => setResponseTone(e.target.value)}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="professional">Professional</option>
                              <option value="friendly">Friendly</option>
                              <option value="apologetic">Apologetic</option>
                              <option value="technical">Technical</option>
                            </select>
                            <button
                              onClick={generateResponseDraft}
                              disabled={generating}
                              className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                            >
                              {generating ? '⏳ Generating...' : '🤖 Generate Draft'}
                            </button>
                          </div>
                          */}
                        </div>

                        <textarea
                          rows={8}
                          value={customResponse}
                          onChange={(e) => setCustomResponse(e.target.value)}
                          placeholder="Type or generate a response to the customer..."
                          className="w-full border rounded p-3 text-sm bg-white"
                        />

                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            onClick={() => setCustomResponse('')}
                            className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                          >
                            ✖ Clear
                          </button>
                          <button
                            onClick={handleSaveDraft}
                            className="text-sm px-3 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                          >
                            � Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>

              ) : selectedTicket && viewMode === 'edit' ? (
                <div>
                  <div className="mb-3">
                    <label className="block mb-1 font-medium">Subject</label>
                    <input
                      type="text"
                      value={selectedTicket.subject}
                      readOnly
                      disabled
                      className="w-full border rounded p-2 bg-gray-100 text-sm"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                      rows={5}
                      value={selectedTicket.description}
                      readOnly
                      disabled
                      className="w-full border rounded p-2 bg-gray-100 text-sm"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block mb-1 font-medium">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => setSelectedTicket({ ...selectedTicket, status: e.target.value })}
                      className="w-full border rounded p-2 text-sm"
                    >
                      <option value={TicketStatus.NEW}>New</option>
                      <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TicketStatus.RESOLVED}>Resolved</option>
                      <option value={TicketStatus.CLOSED}>Closed</option>
                    </select>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              {viewMode === 'view' ? (
                <>
                  <button
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    ✓ Done
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setViewMode('view')}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTicket}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    ✓ Save Changes
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

export default InProgressTickets;
