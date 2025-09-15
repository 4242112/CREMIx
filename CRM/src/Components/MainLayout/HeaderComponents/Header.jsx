import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import { motion, AnimatePresence } from "framer-motion";

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
    <header className="bg-white border-b border-border shadow-card h-16 sticky top-0 z-40">
      <div className="w-full h-full px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo and App Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-xl font-bold text-primary">CREMIx</h1>
            <span className="text-xs text-muted bg-accent/10 px-2 py-1 rounded-full">SaaS CRM</span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-background hover:bg-border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleDropdown}
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {currentUser?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-medium text-sm text-gray-900">
                  {currentUser?.name || "User"}
                </div>
                <div className="text-xs text-muted">
                  {currentUser?.email || "user@example.com"}
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-muted transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-modal border border-border z-50"
                >
                  {currentUser && (
                    <div className="px-4 py-3 border-b border-border">
                      <div className="font-medium text-gray-900">{currentUser.name}</div>
                      <div className="text-sm text-muted">{currentUser.email}</div>
                    </div>
                  )}
                  <div className="py-2">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      onClick={handleLogout}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
