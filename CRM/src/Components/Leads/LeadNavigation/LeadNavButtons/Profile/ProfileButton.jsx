import React from 'react';
import { Lead } from "../../../../../services/LeadService";

const ProfileButton = ({ lead }) => {
  if (!lead) return null;

  const renderRow = (label, value) => (
    <tr className="border-b last:border-b-0">
      <th className="text-left px-4 py-2 w-48 font-medium">{label}</th>
      <td className="px-4 py-2">{value || '-'}</td>
    </tr>
  );

  return (
    <div className="space-y-4">
      {/* Customer Details Section */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h5 className="text-lg font-semibold">Customer Details</h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {renderRow('Name:', lead.name)}
              {renderRow('Phone:', lead.phoneNumber)}
              {renderRow('Email:', lead.email)}
              {renderRow('Address:', lead.address)}
              {renderRow('Website:', lead.website)}
              {renderRow('City:', lead.city)}
              {renderRow('State:', lead.state)}
              {renderRow('Zip Code:', lead.zipCode)}
              {renderRow('Country:', lead.country)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Section */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h5 className="text-lg font-semibold">Lead Details</h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {renderRow('Interested In:', lead.requirement)}
              {renderRow('Source:', lead.source)}
              {renderRow('Assigned To:', lead.assignedTo || 'Super Admin')}
              {renderRow('Comment:', lead.comment)}
              {lead.createdBy && renderRow('Created By:', lead.createdBy)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileButton;
