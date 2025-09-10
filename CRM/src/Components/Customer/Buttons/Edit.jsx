import React, { useState, useEffect } from "react";
import {
  BriefcaseIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  FlagIcon,
} from "@heroicons/react/24/solid";

const EditCustomer = ({ show, onClose, onSave, customer }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (customer && show) {
      setForm(JSON.parse(JSON.stringify(customer)));
    } else if (!show) {
      setForm(null);
    }
  }, [customer, show]);

  if (!form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form) {
      await onSave(form);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const iconWrapperClass =
    "w-10 h-10 flex items-center justify-center bg-gray-100 rounded-l";

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        show ? "block" : "hidden"
      }`}
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl w-1/3 max-w-5xl px-10 h-[67vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center border-b p-4">
            <h5 className="text-lg font-semibold">Edit Customer</h5>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-4 gap-6 border-b">
            <div>
              <h6 className="mb-4 text-md font-semibold border-b pb-2">
                Customer Details
              </h6>

              {/* Name */}
              <div className="mb-3">
                <label className="block mb-1">Name *</label>
                <div className="flex">
                  <div className={iconWrapperClass}>
                    <BriefcaseIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Customer Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="block mb-1">Phone *</label>
                <div className="flex">
                  <div className={iconWrapperClass}>
                    <PhoneIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Customer Phone Number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="block mb-1">Email *</label>
                <div className="flex">
                  <div className={iconWrapperClass}>
                    <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Customer Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="block mb-1">Address</label>
                <div className="flex">
                  <div className={iconWrapperClass}>
                    <MapPinIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={form.address || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* City */}
              <div className="mb-3">
                <label className="block mb-1">City</label>
                <div className="flex">
                  <div className={iconWrapperClass}>
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* State */}
              <div className="mb-3">
                <label className="block mb-1">State</label>
                <div className="flex">
                  <div className={iconWrapperClass}>
                    <MapPinIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={form.state || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div className="mb-3">
                <label className="block mb-1">Zip Code</label>
                <div className="flex">
                  <div className={iconWrapperClass}>
                    <span className="text-gray-600">#</span>
                  </div>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip code"
                    value={form.zipCode || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Website */}
              <div className="mb-3">
                <label className="block mb-1">Website</label>
                <div className="flex">
                  <div className={iconWrapperClass}>
                    <GlobeAltIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    name="website"
                    placeholder="Website"
                    value={form.website || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Country */}
              <div className="mb-3">
                <label className="block mb-1">Country</label>
                <div className="flex">
                  <div className={iconWrapperClass}>
                    <FlagIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={form.country || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
