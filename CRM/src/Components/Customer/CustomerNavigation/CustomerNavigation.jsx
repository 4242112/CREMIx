import React from 'react';
import { UserIcon, PencilIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

const CustomerNavigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-6 h-6" /> },
    { id: 'notes', label: 'Notes', icon: <PencilIcon className="w-6 h-6" /> },
    { id: 'invoice', label: 'Invoice', icon: <DocumentTextIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="mb-4">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <div
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center p-3 border-b cursor-pointer transition-colors ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <span className={`mr-2 ${isActive ? 'text-white' : 'text-blue-600'}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerNavigation;
