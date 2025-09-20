import React, { useState, useEffect, useCallback } from 'react';
import CallLogService from '../../../../services/CallLogService';

const CallsButton = ({ customer }) => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCalls = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CallLogService.getCallLogsByCustomerId(customer.id);
      setCalls(data);
    } catch (err) {
      console.error('Error fetching calls:', err);
      setError('Failed to load call logs');
    } finally {
      setLoading(false);
    }
  }, [customer.id]);

  useEffect(() => {
    if (customer?.id) {
      fetchCalls();
    }
  }, [customer, fetchCalls]);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="border-b px-4 py-3">
        <h5 className="text-lg font-semibold text-gray-800">Call Logs</h5>
      </div>
      <div className="p-4">
        {calls.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <i className="bi bi-telephone text-4xl mb-3 block"></i>
            <p>No call logs found for this customer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {calls.map((call) => (
              <div key={call.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <i className={`bi bi-${call.callType === 'INCOMING' ? 'arrow-down-left' : 'arrow-up-right'} text-lg ${
                      call.callType === 'INCOMING' ? 'text-green-600' : 'text-blue-600'
                    }`}></i>
                    <span className="font-medium">{call.callType}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(call.callDateTime).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Duration:</strong> {call.duration} minutes</p>
                  {call.purpose && <p><strong>Purpose:</strong> {call.purpose}</p>}
                  {call.outcome && <p><strong>Outcome:</strong> {call.outcome}</p>}
                  {call.notes && <p><strong>Notes:</strong> {call.notes}</p>}
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