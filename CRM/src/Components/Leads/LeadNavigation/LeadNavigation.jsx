import React from "react";

const LeadNavigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "calls", label: "Calls", icon: "📞" },
    { id: "notes", label: "Notes", icon: "📝" },
  ];

  return (
    <div className="mb-4">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <div
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center p-3 cursor-pointer border-b transition-colors duration-200
              ${isActive ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
          >
            <span
              className={`w-6 h-6 mr-2 flex items-center justify-center text-lg
                ${isActive ? "text-white" : "text-blue-600"}`}
            >
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default LeadNavigation;
