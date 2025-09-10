import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";

const Header = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (AuthService.isEmployeeLoggedIn()) {
      const employee = AuthService.getCurrentEmployee();
      setCurrentUser({
        name: employee?.name || "",
        email: employee?.email || "",
      });
    } else if (AuthService.isCustomerLoggedIn()) {
      const customer = AuthService.getCurrentCustomer();
      setCurrentUser({
        name: customer?.name || "",
        email: customer?.email || "",
      });
    } else {
      const adminData = localStorage.getItem("adminAuth");
      if (adminData) {
        const admin = JSON.parse(adminData);
        setCurrentUser({
          name: admin.adminName || "",
          email: admin.email || "",
        });
      }
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    if (AuthService.isEmployeeLoggedIn()) {
      AuthService.logoutEmployee();
    } else {
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("customerAuth");
    }
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="bg-[#0f1627] text-white h-14 sticky top-0 shadow">
      <div className="w-full">
        <div className="flex items-center py-2 px-4">
          <div className="flex-grow">
            <h1 className="text-xl font-bold flex items-center">
              <span className="mr-2">👥</span>
              CREMIx
            </h1>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center text-sm bg-[#2d3a5d] hover:bg-[#374773] text-white rounded px-2 py-1"
              onClick={toggleDropdown}
            >
              <span className="mr-1">👤</span>
              {currentUser?.name || "Profile"}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 min-w-[180px] bg-white text-gray-800 rounded shadow-lg border border-gray-200 z-50">
                {currentUser && (
                  <div className="px-4 py-2">
                    <div className="font-bold">{currentUser.name}</div>
                    <div className="text-sm text-gray-500">
                      {currentUser.email}
                    </div>
                  </div>
                )}
                <div className="border-t my-1"></div>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#0f1627] transition-colors"
                  onClick={handleLogout}
                >
                  <span className="mr-2">↪️</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
