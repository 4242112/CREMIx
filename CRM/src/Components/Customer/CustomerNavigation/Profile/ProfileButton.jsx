import React from 'react';

const ProfileButton = ({ customer }) => {
  if (!customer) return null;

  return (
    <div>
      {/* Customer Details Section */}
      <div className="bg-white shadow-md rounded-lg mb-4">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
          <h5 className="text-lg font-semibold">Customer Details</h5>
        </div>
        <div className="p-4">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b">
                <th className="w-48 py-2 font-medium text-gray-700">Name:</th>
                <td className="py-2">{customer.name}</td>
              </tr>
              <tr className="border-b">
                <th className="w-48 py-2 font-medium text-gray-700">Phone:</th>
                <td className="py-2">{customer.phoneNumber}</td>
              </tr>
              <tr className="border-b">
                <th className="w-48 py-2 font-medium text-gray-700">Email:</th>
                <td className="py-2">{customer.email}</td>
              </tr>
              <tr className="border-b">
                <th className="w-48 py-2 font-medium text-gray-700">Website:</th>
                <td className="py-2">{customer.website || '-'}</td>
              </tr>
              <tr className="border-b">
                <th className="w-48 py-2 font-medium text-gray-700">City:</th>
                <td className="py-2">{customer.city || '-'}</td>
              </tr>
              <tr className="border-b">
                <th className="w-48 py-2 font-medium text-gray-700">State:</th>
                <td className="py-2">{customer.state || '-'}</td>
              </tr>
              <tr className="border-b">
                <th className="w-48 py-2 font-medium text-gray-700">Zip Code:</th>
                <td className="py-2">{customer.zipCode || '-'}</td>
              </tr>
              <tr>
                <th className="w-48 py-2 font-medium text-gray-700">Country:</th>
                <td className="py-2">{customer.country || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileButton;
