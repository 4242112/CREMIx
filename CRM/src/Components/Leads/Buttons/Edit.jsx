import React, { useState, useEffect } from "react";
import { LeadSource } from "../../../services/LeadService";
import EmployeeService from "../../../services/EmployeeService";

const defaultSources = Object.values(LeadSource).map(s => s.toUpperCase());

const EditLeads = ({ show, onClose, onSave, lead }) => {
  const [form, setForm] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) fetchEmployeeNames();
  }, [show]);

  useEffect(() => {
    if (lead && show) setForm({ ...lead });
    else if (!show) setForm(null);
  }, [lead, show]);

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

  if (!form || !show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form) await onSave(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-1">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded shadow-lg overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b flex-shrink-0">
            <h5 className="text-base font-semibold">Edit Lead</h5>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 text-lg"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto flex-grow min-h-0">
            {/* Customer Details */}
            <div className="border-r pr-3">
              <h6 className="text-sm font-semibold mb-2 border-b pb-1">Customer Details</h6>

              <InputField
                label="Name *"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Lead Name"
              />
              <InputField
                label="Phone *"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Customer Phone Number"
              />
              <InputField
                label="Email *"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Customer Email"
              />
              <InputField
                label="Address"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                placeholder="Address"
              />
              <InputField
                label="City"
                name="city"
                value={form.city || ""}
                onChange={handleChange}
                placeholder="City"
              />
              <InputField
                label="State"
                name="state"
                value={form.state || ""}
                onChange={handleChange}
                placeholder="State"
              />
              <InputField
                label="Zip Code"
                name="zipCode"
                value={form.zipCode || ""}
                onChange={handleChange}
                placeholder="Zip Code"
              />
              <InputField
                label="Website"
                name="website"
                value={form.website || ""}
                onChange={handleChange}
                placeholder="Website"
              />
              <InputField
                label="Country"
                name="country"
                value={form.country || ""}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>

            {/* Lead Details */}
            <div className="pl-3">
              <h6 className="text-sm font-semibold mb-2 border-b pb-1">Lead Details</h6>

              <InputField
                label="Requirement"
                name="requirement"
                value={form.requirement || ""}
                onChange={handleChange}
                placeholder="Interested In"
              />
              <InputField
                label="Expected Revenue (₹)"
                name="expectedRevenue"
                type="number"
                value={form.expectedRevenue || ""}
                onChange={handleChange}
                placeholder="Expected Revenue"
                min="0"
                step="0.01"
              />
              <InputField
                label="Conversion Probability (%)"
                name="conversionProbability"
                type="number"
                value={form.conversionProbability || ""}
                onChange={handleChange}
                placeholder="Probability of Conversion"
                min="0"
                max="100"
                step="1"
              />
              <SelectField
                label="Source *"
                name="source"
                value={form.source || ""}
                onChange={handleChange}
                options={defaultSources}
              />
              <SelectField
                label="Assigned To *"
                name="assignedTo"
                value={form.assignedTo || ""}
                onChange={handleChange}
                options={employees}
                disabled={isLoading}
                placeholder={isLoading ? "Loading employees..." : "Select a Staff Member"}
              />
              <TextareaField
                label="Comment"
                name="comment"
                value={form.comment || ""}
                onChange={handleChange}
                placeholder="Comment"
                rows={2}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-4 py-2 border-t gap-2 flex-shrink-0">
            <button
              type="button"
              className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Update Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input, Select, Textarea components for Tailwind styling
const InputField = ({ label, name, value, onChange, type = "text", placeholder, min, max, step }) => (
  <div className="mb-1.5">
    <label className="block text-xs font-medium mb-0.5">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring focus:border-blue-300"
      required={label.includes("*")}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options = [], disabled = false, placeholder }) => (
  <div className="mb-1.5">
    <label className="block text-xs font-medium mb-0.5">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring focus:border-blue-300"
      required={label.includes("*")}
    >
      <option value="">{placeholder || `Select ${label}`}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const TextareaField = ({ label, name, value, onChange, rows = 3, placeholder }) => (
  <div className="mb-1.5">
    <label className="block text-xs font-medium mb-0.5">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring focus:border-blue-300"
    />
  </div>
);

export default EditLeads;
