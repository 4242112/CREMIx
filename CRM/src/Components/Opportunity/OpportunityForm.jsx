import React, { useState, useEffect } from "react";
import EmployeeService from "../../services/EmployeeService";

const defaultSources = [
  "WEBSITE",
  "INTERNET",
  "REFERRAL",
  "BROCHURE",
  "ADVERTISEMENT",
  "EMAIL",
  "PHONE",
  "EVENT",
  "OTHER",
  "UNKNOWN",
];

const initialForm = {
  stage: "NEW",
  lead: {
    id: undefined,
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    website: "",
    country: "",
    requirement: "",
    assignedTo: "",
    stage: "",
    comment: "",
    source: "",
  },
  expectedRevenue: 0,
  conversionProbability: 0,
};

const OpportunityForm = ({
  show,
  onClose,
  onSave,
  sourceOptions = defaultSources,
  employeeOptions = [],
}) => {
  const [form, setForm] = useState(initialForm);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchEmployeeNames();
    }
    if (!show) {
      setForm(initialForm);
    }
  }, [show]);

  const fetchEmployeeNames = async () => {
    setIsLoading(true);
    try {
      const names = await EmployeeService.getAllEmployeeNames();
      setEmployees(names);
    } catch (error) {
      console.error("Error fetching employee names:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      lead: {
        ...form.lead,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  const availableEmployees = employees.length > 0 ? employees : employeeOptions;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-5xl rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h5 className="text-lg font-semibold">Add / Edit Opportunity</h5>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
          </div>

          {/* Body */}
          <div className="flex flex-col md:flex-row px-6 py-4 gap-6">
            {/* Customer Details */}
            <div className="md:w-1/2 space-y-4 border-r border-gray-200 pr-4">
              <h6 className="font-semibold border-b pb-1 mb-2">Customer Details</h6>

              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Opportunity Name"
                  value={form.lead.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Customer Phone Number"
                  value={form.lead.phoneNumber}
                  onChange={handleChange}
                  required
                  pattern="^(\\+?\\d{2})?[0-9]{10}$"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Customer Email"
                  value={form.lead.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Other customer fields */}
              {["address", "city", "state", "zipCode", "website", "country"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    placeholder={field}
                    value={form.lead[field]}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Opportunity Details */}
            <div className="md:w-1/2 space-y-4 pl-4">
              <h6 className="font-semibold border-b pb-1 mb-2">Opportunity Details</h6>

              <div>
                <label className="block text-sm font-medium mb-1">Requirement</label>
                <input
                  type="text"
                  name="requirement"
                  placeholder="Required"
                  value={form.lead.requirement}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Source *</label>
                <select
                  name="source"
                  value={form.lead.source}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select a Source</option>
                  {sourceOptions.map((src) => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assigned To *</label>
                <select
                  name="assignedTo"
                  value={form.lead.assignedTo}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select a Staff Member</option>
                  {isLoading ? (
                    <option value="" disabled>Loading employees...</option>
                  ) : (
                    availableEmployees.map((emp) => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                  name="comment"
                  placeholder="Comment"
                  value={form.lead.comment}
                  onChange={handleChange}
                  rows="2"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;
