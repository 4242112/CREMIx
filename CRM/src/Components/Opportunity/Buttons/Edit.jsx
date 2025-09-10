import React, { useState, useEffect } from "react";
import EmployeeService from "../../../services/EmployeeService";

const defaultSources = ["REFERRAL", "WEBSITE", "SOCIAL", "EMAIL", "OTHER"];

const EditOpportunity = ({ show, onClose, onSave, opportunity }) => {
  const [form, setForm] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchEmployeeNames();
    }
  }, [show]);

  useEffect(() => {
    if (opportunity && show) {
      setForm(JSON.parse(JSON.stringify(opportunity)));
    } else if (!show) {
      setForm(null);
    }
  }, [opportunity, show]);

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

  if (!form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("lead.")) {
      const leadField = name.split(".")[1];
      setForm({
        ...form,
        lead: {
          ...form.lead,
          [leadField]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form) {
      await onSave(form);
    }
  };

  const availableEmployees = employees.length > 0 ? employees : [];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        show ? "visible bg-black bg-opacity-50" : "invisible"
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl mx-4 w-3/4 h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h5 className="text-lg font-semibold">Edit Opportunity</h5>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="border-r pr-4">
              <h6 className="text-md font-medium mb-3 border-b pb-2">
                Customer Details
              </h6>

              {[
                {
                  label: "Name *",
                  name: "lead.name",
                  type: "text",
                  value: form.lead.name,
                },
                {
                  label: "Phone *",
                  name: "lead.phoneNumber",
                  type: "text",
                  value: form.lead.phoneNumber,
                },
                {
                  label: "Email *",
                  name: "lead.email",
                  type: "email",
                  value: form.lead.email,
                },
                {
                  label: "Address",
                  name: "lead.address",
                  type: "text",
                  value: form.lead.address || "",
                },
                {
                  label: "City",
                  name: "lead.city",
                  type: "text",
                  value: form.lead.city || "",
                },
                {
                  label: "State",
                  name: "lead.state",
                  type: "text",
                  value: form.lead.state || "",
                },
                {
                  label: "Zip Code",
                  name: "lead.zipCode",
                  type: "text",
                  value: form.lead.zipCode || "",
                },
                {
                  label: "Website",
                  name: "lead.website",
                  type: "text",
                  value: form.lead.website || "",
                },
                {
                  label: "Country",
                  name: "lead.country",
                  type: "text",
                  value: form.lead.country || "",
                },
              ].map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={field.value}
                    onChange={handleChange}
                    required={field.label.includes("*")}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Opportunity Details */}
            <div>
              <h6 className="text-md font-medium mb-3 border-b pb-2">
                Opportunity Details
              </h6>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Requirement
                </label>
                <input
                  type="text"
                  name="lead.requirement"
                  value={form.lead.requirement || ""}
                  onChange={handleChange}
                  placeholder="Interested In"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Expected Revenue
                </label>
                <input
                  type="number"
                  name="expectedRevenue"
                  value={form.expectedRevenue || ""}
                  onChange={handleChange}
                  placeholder="Expected Revenue"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Source *
                </label>
                <select
                  name="lead.source"
                  value={form.lead.source || ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select a Source</option>
                  {defaultSources.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Assigned To *
                </label>
                <select
                  name="lead.assignedTo"
                  value={form.lead.assignedTo || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select a Staff Member</option>
                  {isLoading ? (
                    <option value="" disabled>
                      Loading employees...
                    </option>
                  ) : (
                    availableEmployees.map((emp) => (
                      <option key={emp} value={emp}>
                        {emp}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Comment
                </label>
                <textarea
                  name="lead.comment"
                  value={form.lead.comment || ""}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Comment"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Update Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOpportunity;
