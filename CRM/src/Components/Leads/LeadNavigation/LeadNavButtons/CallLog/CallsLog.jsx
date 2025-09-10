import React, { useState, useEffect } from "react";
import { Lead } from "../../../../../services/LeadService";
import CallsLogForm from "./CallsLogForm";
import CallLogService from "../../../../../services/CallLogService";

const CallsButton = ({ lead }) => {
  const [showForm, setShowForm] = useState(false);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const date = new Date();
  const [currentCall, setCurrentCall] = useState({
    title: "",
    description: "",
    type: "INCOMING",
    dateTime: [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()],
    minutes: 0,
    seconds: 0,
    customerName: lead.name,
    employeeName: lead.assignedTo || "Admin",
    customerEmail: lead.email,
  });

  useEffect(() => {
    const loadCallLogs = async () => {
      if (!lead) return;
      setLoading(true);
      try {
        let data = [];
        if (lead.email) data = await CallLogService.getCallLogsByCustomerEmail(lead.email);
        if (data.length === 0 && lead.id) data = await CallLogService.getCallLogsByCustomerId(lead.id);
        if (data.length === 0 && lead.name) data = await CallLogService.getCallLogsByCustomerName(lead.name);
        setCalls(data);
        setError(null);
      } catch (err) {
        setError("Failed to load call logs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadCallLogs();
  }, [lead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const callLogWithEmail = { ...currentCall, customerEmail: lead.email || currentCall.customerEmail };
      let savedCall;
      if (callLogWithEmail.id) {
        savedCall = await CallLogService.updateCallLog(callLogWithEmail.id, callLogWithEmail);
        setCalls(calls.map((call) => (call.id === savedCall.id ? savedCall : call)));
      } else {
        savedCall = await CallLogService.createCallLog(callLogWithEmail);
        setCalls([...calls, savedCall]);
      }
      setShowForm(false);
      setCurrentCall({
        title: "",
        description: "",
        type: "INCOMING",
        dateTime: [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()],
        minutes: 0,
        seconds: 0,
        customerName: lead.name,
        employeeName: lead.assignedTo || "Admin",
        customerEmail: lead.email,
      });
      setError(null);
    } catch (err) {
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
      const dateObj = new Date(year, month - 1, day, hour, minute);
      return dateObj.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="shadow rounded-lg bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h5 className="text-blue-700 font-semibold flex items-center gap-2">
          📞 Calls
        </h5>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          ➕ Add Call
        </button>
      </div>

      <div className="p-4">
        {error && <div className="text-red-600 mb-3">{error}</div>}
        {loading && <div className="text-center py-3">⏳ Loading...</div>}

        {showForm && (
          <CallsLogForm
            currentCall={currentCall}
            setCurrentCall={setCurrentCall}
            handleSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        {!loading && calls.length === 0 && !showForm ? (
          <p className="text-gray-500 text-center">No calls logged for this lead.</p>
        ) : (
          <div className="relative pl-5 border-l-2 border-gray-300">
            {calls.map((call) => (
              <div key={call.id} className="mb-6 relative pl-6">
                <div className="absolute left-0 w-3 h-3 bg-blue-600 rounded-full top-2"></div>
                <div className="bg-white p-4 rounded shadow border">
                  <h5 className="text-blue-700 font-semibold mb-1">📞 {call.title}</h5>
                  <p className="text-gray-600 mb-2">💬 {call.description}</p>

                  <div className="text-gray-700 text-sm mb-1">
                    <strong>Type:</strong> {call.type}
                  </div>
                  <div className="text-gray-700 text-sm mb-1">
                    <strong>Time:</strong> {formatDateDisplay(call.dateTime)}
                  </div>
                  <div className="text-gray-700 text-sm mb-1">
                    <strong>Duration:</strong> {call.minutes}m {call.seconds}s
                  </div>
                  <div className="text-gray-700 text-sm mb-1">
                    <strong>Customer:</strong> {call.customerName}{" "}
                    {call.customerEmail && <span className="text-gray-500">({call.customerEmail})</span>}
                  </div>
                  <div className="text-gray-700 text-sm mb-2">
                    <strong>Employee:</strong> {call.employeeName}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-2 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                      onClick={() => handleEdit(call)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="px-2 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                      onClick={() => handleDelete(call.id)}
                    >
                      🗑️ Delete
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
