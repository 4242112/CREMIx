import React from 'react';

const ProfileButton = ({ customer }) => {
  if (!customer) return null;

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
                <td className="px-4 py-2">{customer.name}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Phone:
                </th>
                <td className="px-4 py-2">{customer.phoneNumber}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Email:
                </th>
                <td className="px-4 py-2">{customer.email}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Website:
                </th>
                <td className="px-4 py-2">
                  {customer.website || "-"}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">City:</th>
                <td className="px-4 py-2">{customer.city || "-"}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">State:</th>
                <td className="px-4 py-2">{customer.state || "-"}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Zip Code:
                </th>
                <td className="px-4 py-2">{customer.zipCode || "-"}</td>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">
                  Country:
                </th>
                <td className="px-4 py-2">{customer.country || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileButton;
