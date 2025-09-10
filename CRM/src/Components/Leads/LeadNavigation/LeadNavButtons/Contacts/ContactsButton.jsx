import React from 'react';
import { Lead } from '../../../../../services/LeadService';

const ContactsButton = ({ lead }) => {
  if (!lead) return null;

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <h5 className="text-lg font-semibold">Contacts</h5>
        <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1">
          <span className="material-icons text-sm">add</span>
          Add Contact
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-gray-500">No contacts found for this lead.</p>
      </div>
    </div>
  );
};

export default ContactsButton;
