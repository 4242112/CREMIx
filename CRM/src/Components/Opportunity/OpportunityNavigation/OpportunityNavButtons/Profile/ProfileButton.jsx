import React from "react";

const ProfileButton = ({ opportunity }) => {
  if (!opportunity) return null;

  return (
    <div className="space-y-6">
      {/* Customer Details */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h5 className="text-lg font-semibold text-gray-800">
            Customer Details
          </h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <th className="w-48 px-4 py-2 font-medium text-gray-700">
                  Name:
                </th>
                <td className="px-4 py-2">{opportunity.lead.name}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Phone:
                </th>
                <td className="px-4 py-2">{opportunity.lead.phoneNumber}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Email:
                </th>
                <td className="px-4 py-2">{opportunity.lead.email}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Website:
                </th>
                <td className="px-4 py-2">
                  {opportunity.lead.website || "-"}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">City:</th>
                <td className="px-4 py-2">{opportunity.lead.city || "-"}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">State:</th>
                <td className="px-4 py-2">{opportunity.lead.state || "-"}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Zip Code:
                </th>
                <td className="px-4 py-2">{opportunity.lead.zipCode || "-"}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Country:
                </th>
                <td className="px-4 py-2">{opportunity.lead.country || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Opportunity Details */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h5 className="text-lg font-semibold text-gray-800">
            Opportunity Details
          </h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <th className="w-48 px-4 py-2 font-medium text-gray-700">
                  Interested In:
                </th>
                <td className="px-4 py-2">
                  {opportunity.lead.requirement || "-"}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Source:
                </th>
                <td className="px-4 py-2">
                  {opportunity.lead.source || "-"}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Assigned To:
                </th>
                <td className="px-4 py-2">
                  {opportunity.lead.assignedTo || "Super Admin"}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Expected Revenue:
                </th>
                <td className="px-4 py-2">
                  {opportunity.expectedRevenue
                    ? `₹${opportunity.expectedRevenue}`
                    : "-"}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Probability:
                </th>
                <td className="px-4 py-2">
                  {opportunity.conversionProbability
                    ? `${opportunity.conversionProbability}%`
                    : "-"}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Comment:
                </th>
                <td className="px-4 py-2">{opportunity.lead.comment || "-"}</td>
              </tr>
              {opportunity.lead.createdBy && (
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-700">
                    Created By:
                  </th>
                  <td className="px-4 py-2">{opportunity.lead.createdBy}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileButton;
