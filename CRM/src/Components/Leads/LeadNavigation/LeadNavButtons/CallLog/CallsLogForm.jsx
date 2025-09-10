import React from 'react';
import { CallLog, dateToDateTime } from '../../../../../services/CallLogService';

const CallsLogForm = ({ currentCall, setCurrentCall, handleSubmit, onCancel }) => {
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
            <h5 className="text-lg font-semibold flex items-center gap-2">
                <span className="material-icons">note_add</span>
                Add Call Log
            </h5>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <span className="material-icons text-gray-500">title</span>
                    Title
                </label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentCall.title}
                    onChange={(e) => setCurrentCall({ ...currentCall, title: e.target.value })}
                    placeholder="Enter call title"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <span className="material-icons text-gray-500">chat</span>
                    Description
                </label>
                <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentCall.description}
                    onChange={(e) => setCurrentCall({ ...currentCall, description: e.target.value })}
                    placeholder="Enter description"
                    rows={3}
                />
            </div>

            {/* Call Type */}
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <span className="material-icons text-gray-500">call</span>
                    Call Type
                </label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentCall.type}
                    onChange={(e) =>
                        setCurrentCall({ ...currentCall, type: e.target.value })
                    }
                    required
                >
                    <option value="INCOMING">Incoming</option>
                    <option value="OUTGOING">Outgoing</option>
                    <option value="MISSED">Missed</option>
                </select>
            </div>

            {/* Date & Time */}
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <span className="material-icons text-gray-500">event</span>
                    Date & Time
                </label>
                <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={
                        Array.isArray(currentCall.dateTime)
                            ? `${currentCall.dateTime[0]}-${String(currentCall.dateTime[1]).padStart(2, '0')}-${String(
                                  currentCall.dateTime[2]
                              ).padStart(2, '0')}T${String(currentCall.dateTime[3]).padStart(2, '0')}:${String(
                                  currentCall.dateTime[4]
                              ).padStart(2, '0')}`
                            : ''
                    }
                    onChange={(e) =>
                        setCurrentCall({ ...currentCall, dateTime: dateToDateTime(new Date(e.target.value)) })
                    }
                    required
                />
            </div>

            {/* Minutes & Seconds */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                        <span className="material-icons text-gray-500">timer</span>
                        Minutes
                    </label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentCall.minutes}
                        onChange={(e) => setCurrentCall({ ...currentCall, minutes: parseInt(e.target.value) || 0 })}
                        min={0}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                        <span className="material-icons text-gray-500">timer</span>
                        Seconds
                    </label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentCall.seconds}
                        onChange={(e) => setCurrentCall({ ...currentCall, seconds: parseInt(e.target.value) || 0 })}
                        min={0}
                        max={59}
                        required
                    />
                </div>
            </div>

            {/* Customer Name */}
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <span className="material-icons text-gray-500">person</span>
                    Customer Name (Lead)
                </label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    value={currentCall.customerName}
                    disabled
                    readOnly
                />
            </div>

            {/* Employee Name */}
            <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <span className="material-icons text-gray-500">badge</span>
                    Employee Name (Assigned To)
                </label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    value={currentCall.employeeName}
                    disabled
                    readOnly
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-1"
                >
                    <span className="material-icons">check_circle</span> Save
                </button>
                <button
                    type="button"
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-1"
                    onClick={onCancel}
                >
                    <span className="material-icons">cancel</span> Cancel
                </button>
            </div>
        </form>
    );
};

export default CallsLogForm;
