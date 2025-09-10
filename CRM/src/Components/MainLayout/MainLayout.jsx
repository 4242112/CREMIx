import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./HeaderComponents/Header";
import Sidebar from "./SidebarComponents/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        {/* Sidebar with fixed width */}
        <div className="w-[200px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main
          className="flex-grow p-3 bg-[#f5f7fa]"
          style={{ minHeight: "calc(100vh - 56px)" }}
        >
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
