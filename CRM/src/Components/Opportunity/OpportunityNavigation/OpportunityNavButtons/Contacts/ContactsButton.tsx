import React from "react";

const ContactsButton = ({ opportunity }) => {
  if (!opportunity) return null;

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h5 className="text-lg font-semibold text-gray-800">Contacts</h5>
        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
          ➕ Add Contact
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-gray-500">No contacts found for this Opportunity.</p>
      </div>
    </div>
  );
};

export default ContactsButton;
