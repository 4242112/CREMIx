import React, { useState } from "react";
import Header from "./HeaderComponents/Header";
import Sidebar_new from "./SidebarComponents/Sidebar_new";
import ConnectionStatus from "../common/ConnectionStatus";

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <Sidebar_new 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />

      {/* Main content area with dynamic left margin based on sidebar state */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Connection Status Indicator */}
      <ConnectionStatus />
    </div>
  );
};

export default MainLayout;
