import React, { useState, useEffect } from "react";
// Removed unused Opportunity import - type not needed in JavaScript
import CallLogService from "../../../../../services/CallLogService";
import CallsLogForm from "../../../../Leads/LeadNavigation/LeadNavButtons/CallLog/CallsLogForm";

const CallsButton = ({ opportunity }) => {
  const [showForm, setShowForm] = useState(false);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const date = new Date();
  const [currentCall, setCurrentCall] = useState({
    title: "",
    description: "",
    type: "INCOMING",
    dateTime: [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ],
    minutes: 0,
    seconds: 0,
    customerName: opportunity.lead.name,
    employeeName: opportunity.lead.assignedTo || "Admin",
  });

  useEffect(() => {
    const loadCallLogs = async () => {
      if (!opportunity || !opportunity.lead) return;

      setLoading(true);
      try {
        let data = [];

        if (opportunity.lead.id) {
          data = await CallLogService.getCallLogsByCustomerId(
            opportunity.lead.id
          );
        }

        if (data.length === 0 && opportunity.id) {
          data = await CallLogService.getCallLogsByCustomerId(opportunity.id);
        }

        if (data.length === 0 && opportunity.lead.name) {
          data = await CallLogService.getCallLogsByCustomerName(
            opportunity.lead.name
          );
        }

        setCalls(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load call logs:", err);
        setError("Failed to load call logs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCallLogs();
  }, [opportunity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let savedCall;
      if (currentCall.id) {
        savedCall = await CallLogService.updateCallLog(
          currentCall.id,
          currentCall
        );
        setCalls(calls.map((call) => (call.id === savedCall.id ? savedCall : call)));
      } else {
        savedCall = await CallLogService.createCallLog(currentCall);
        setCalls([...calls, savedCall]);
      }

      setShowForm(false);
      setCurrentCall({
        title: "",
        description: "",
        type: "INCOMING",
        dateTime: [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
        ],
        minutes: 0,
        seconds: 0,
        customerName: opportunity.lead.name,
        employeeName: opportunity.lead.assignedTo || "Admin",
      });
      setError(null);
    } catch (err) {
      console.error("Error saving call log:", err);
      setError("Failed to save call log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await CallLogService.deleteCallLog(id);
      setCalls(calls.filter((call) => call.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting call log:", err);
      setError("Failed to delete call log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (call) => {
    setCurrentCall({ ...call });
    setShowForm(true);
  };

  const formatDateDisplay = (dateValue) => {
    try {
      const [year, month, day, hour, minute] = dateValue;
      const date = new Date(year, month - 1, day, hour, minute);
      return date.toLocaleString();
    } catch (err) {
      console.error("Error formatting date:", err, dateValue);
      return "Invalid Date";
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h5 className="text-lg font-semibold text-gray-800 flex items-center">
          📞 Calls
        </h5>
        <button
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          ➕ Add Call
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {showForm && (
          <CallsLogForm
            currentCall={currentCall}
            setCurrentCall={setCurrentCall}
            handleSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        {!loading && calls.length === 0 && !showForm ? (
          <p className="text-gray-500 text-center">
            No calls logged for this opportunity.
          </p>
        ) : (
          <div className="relative border-l-2 border-gray-200 ml-4">
            {calls.map((call) => (
              <div key={call.id} className="relative mb-6 pl-6">
                {/* Dot marker */}
                <div className="absolute -left-[9px] top-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>

                {/* Card */}
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h5 className="text-blue-600 font-semibold flex items-center mb-2">
                    📞 {call.title}
                  </h5>
                  <p className="text-gray-600 mb-2">💬 {call.description}</p>

                  <p className="text-sm mb-1">
                    <span className="font-semibold">Type:</span> {call.type}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Time:</span>{" "}
                    {formatDateDisplay(call.dateTime)}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Duration:</span> {call.minutes}m{" "}
                    {call.seconds}s
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Customer:</span>{" "}
                    {call.customerName}
                  </p>
                  <p className="text-sm mb-3">
                    <span className="font-semibold">Employee:</span>{" "}
                    {call.employeeName}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                      onClick={() => handleEdit(call)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50"
                      onClick={() => handleDelete(call.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallsButton;
