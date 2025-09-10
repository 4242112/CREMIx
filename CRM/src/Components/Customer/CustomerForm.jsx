import React, { useState, useEffect } from "react";

const initialForm = {
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
  hasPassword: false,
  type: "NEW",
};

const CustomerForm = ({ show, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!show) setForm(initialForm);
  }, [show]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Add / Edit Customer</h3>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b">
            {/* Customer Details */}
            <div>
              <h4 className="text-md font-semibold mb-4 border-b pb-2">
                Customer Details
              </h4>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name *</label>
                <div className="flex items-center border rounded">
                  <span className="px-2 text-gray-500">💼</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Customer Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1 outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Phone *
                </label>
                <div className="flex items-center border rounded">
                  <span className="px-2 text-gray-500">📞</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Customer Phone Number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                    pattern="^(\+?\d{2})?[0-9]{10}$"
                    className="w-full px-2 py-1 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <div className="flex items-center border rounded">
                  <span className="px-2 text-gray-500">✉️</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Customer Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1 outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <div className="flex items-center border rounded">
                  <span className="px-2 text-gray-500">🏦</span>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-2 py-1 outline-none"
                  />
                </div>
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">City</label>
                <div className="flex items-center border rounded">
                  <span className="px-2 text-gray-500">🏙️</span>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-2 py-1 outline-none"
                  />
                </div>
              </div>

              {/* State */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">State</label>
                <div className="flex items-center border rounded">
                  <span className="px-2 text-gray-500">🏢</span>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-2 py-1 outline-none"
                  />
                </div>
              </div>

              {/* Zip */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Zip Code
                </label>
                <div className="flex items-center border rounded">
                  <span className="px-2 text-gray-500">🔢</span>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip code"
                    value={form.zipCode}
                    onChange={handleChange}
                    className="w-full px-2 py-1 outline-none"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Website
                </label>
                <div className="flex items-center border rounded">
                  <span className="px-2 text-gray-500">🌐</span>
                  <input
                    type="text"
                    name="website"
                    placeholder="Website"
                    value={form.website}
                    onChange={handleChange}
                    className="w-full px-2 py-1 outline-none"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
