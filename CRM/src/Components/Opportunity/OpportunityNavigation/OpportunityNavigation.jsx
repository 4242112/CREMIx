import React from "react";

const OpportunityNavigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: "profile", label: "Profile", icon: "person" },
    { id: "calls", label: "Calls", icon: "telephone" },
    { id: "notes", label: "Notes", icon: "journal-text" },
    { id: "quotation", label: "Quotation", icon: "file-earmark-text" },
  ];

  return (
    <div className="mb-4">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <div
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center p-2 border-b transition cursor-pointer ${
              isActive ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            <i
              className={`bi bi-${item.icon} mr-2 text-lg ${
                isActive ? "text-white" : "text-blue-600"
              }`}
            ></i>
            <span className="font-medium text-base">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default OpportunityNavigation;
