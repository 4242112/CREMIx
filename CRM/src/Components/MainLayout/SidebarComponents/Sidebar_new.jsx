import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthService from "../../../services/AuthService";

// Simple arrow icon component
const ArrowIcon = ({ isOpen }) => (
  <svg 
    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// Simple logout icon component
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const location = useLocation();

  // Role detection
  const isAdmin = localStorage.getItem("adminAuth") === "true";
  const isCustomer = AuthService.isCustomerLoggedIn();
  const isEmployee = AuthService.isEmployeeLoggedIn && AuthService.isEmployeeLoggedIn();

  const toggleDropdown = (dropdownName) => {
    setExpandedDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem("adminAuth");
    }
    if (isCustomer) {
      AuthService.logoutCustomer();
    }
    if (isEmployee) {
      AuthService.logoutEmployee();
    }
    window.location.href = "/login";
  };

  // If no user is logged in, return empty sidebar
  if (!isAdmin && !isCustomer && !isEmployee) {
    return (
      <aside className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col w-64 z-40">
        <div className="p-4">No sidebar available</div>
      </aside>
    );
  }

  // Customer Sidebar
  if (isCustomer) {
    return (
      <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} z-40`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <span className={`font-bold text-xl text-blue-600 transition-all duration-300 ${collapsed ? 'hidden' : 'block'}`}>CREMIx</span>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M4 12h16' : 'M8 6l8 6-8 6'} />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            <li>
              <Link 
                to="/customer-portal?tab=quotation" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  location.search.includes('tab=quotation') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                📄 {!collapsed && 'Quotation'}
              </Link>
            </li>
            <li>
              <Link 
                to="/customer-portal?tab=invoice" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  location.search.includes('tab=invoice') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                🧾 {!collapsed && 'Invoice'}
              </Link>
            </li>
            <li>
              <Link 
                to="/customer-portal?tab=products" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  location.search.includes('tab=products') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                📦 {!collapsed && 'Products'}
              </Link>
            </li>
            <li>
              <Link 
                to="/customer-portal?tab=tickets" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  location.search.includes('tab=tickets') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                🎫 {!collapsed && 'Tickets'}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
            onClick={handleLogout}
          >
            <LogoutIcon />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
    );
  }

  // Employee Sidebar (WHITE BACKGROUND)
  if (isEmployee) {
    return (
      <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} font-inter z-40`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <span className={`font-bold text-xl text-blue-600 transition-all duration-300 ${collapsed ? 'hidden' : 'block'} tracking-wide`}>CREMIx</span>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M4 12h16' : 'M8 6l8 6-8 6'} />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col p-2 space-y-1">
            <li>
              <Link
                to="/"
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 tracking-wide ${
                  isActive("/")
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                } ${collapsed ? 'text-center' : ''}`}
              >
                📊 {!collapsed && <span className="ml-3 font-semibold tracking-wide">Dashboard</span>}
              </Link>
            </li>
            <li>
              <button
                className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  expandedDropdown === "leads"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                } ${collapsed ? 'justify-center' : ''}`}
                onClick={() => !collapsed && toggleDropdown("leads")}
              >
                <span className="flex items-center">
                  👥 {!collapsed && <span className="ml-3 font-semibold tracking-wide">Leads</span>}
                </span>
                {!collapsed && <ArrowIcon isOpen={expandedDropdown === "leads"} />}
              </button>
              {!collapsed && expandedDropdown === "leads" && (
                <ul className="ml-3 mt-1 space-y-1">
                  <li>
                    <Link
                      to="/leads/manage"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/leads/manage")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      📋 <span className="ml-2">Manage Leads</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/leads/recycle-bin"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/leads/recycle-bin")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      🗑 <span className="ml-2">Recycle Bin</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  expandedDropdown === "opportunity"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                } ${collapsed ? 'justify-center' : ''}`}
                onClick={() => !collapsed && toggleDropdown("opportunity")}
              >
                <span className="flex items-center">
                  📈 {!collapsed && <span className="ml-3 font-semibold tracking-wide">Opportunity</span>}
                </span>
                {!collapsed && <ArrowIcon isOpen={expandedDropdown === "opportunity"} />}
              </button>
              {!collapsed && expandedDropdown === "opportunity" && (
                <ul className="ml-3 mt-1 space-y-1">
                  <li>
                    <Link
                      to="/opportunity/manage"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/opportunity/manage")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      📋 <span className="ml-2">Manage Opportunities</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/opportunity/recycle-bin"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/opportunity/recycle-bin")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      🗑 <span className="ml-2">Recycle Bin</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  expandedDropdown === "customers"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                } ${collapsed ? 'justify-center' : ''}`}
                onClick={() => !collapsed && toggleDropdown("customers")}
              >
                <span className="flex items-center">
                  🧑‍🤝‍🧑 {!collapsed && <span className="ml-3 font-semibold tracking-wide">Customers</span>}
                </span>
                {!collapsed && <ArrowIcon isOpen={expandedDropdown === "customers"} />}
              </button>
              {!collapsed && expandedDropdown === "customers" && (
                <ul className="ml-3 mt-1 space-y-1">
                  <li>
                    <Link
                      to="/customer/manage"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/customer/manage")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      📋 <span className="ml-2">Manage Customers</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/customer/recycle-bin"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/customer/recycle-bin")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      🗑 <span className="ml-2">Recycle Bin</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* Catalog section for employees */}
            <li>
              <button
                className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  expandedDropdown === "catalog"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                } ${collapsed ? 'justify-center' : ''}`}
                onClick={() => !collapsed && toggleDropdown("catalog")}
              >
                <span className="flex items-center">
                  📦 {!collapsed && <span className="ml-3 font-semibold tracking-wide">Catalog</span>}
                </span>
                {!collapsed && <ArrowIcon isOpen={expandedDropdown === "catalog"} />}
              </button>
              {!collapsed && expandedDropdown === "catalog" && (
                <ul className="ml-3 mt-1 space-y-1">
                  <li>
                    <Link
                      to="/catalog/products"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/catalog/products")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      🛍️ <span className="ml-2">Products</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/catalog/category"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/catalog/category")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      📂 <span className="ml-2">Category</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  expandedDropdown === "tickets"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                } ${collapsed ? 'justify-center' : ''}`}
                onClick={() => !collapsed && toggleDropdown("tickets")}
              >
                <span className="flex items-center">
                  🎫 {!collapsed && <span className="ml-3 font-semibold tracking-wide">Tickets</span>}
                </span>
                {!collapsed && <ArrowIcon isOpen={expandedDropdown === "tickets"} />}
              </button>
              {!collapsed && expandedDropdown === "tickets" && (
                <ul className="ml-3 mt-1 space-y-1">
                  <li>
                    <Link
                      to="/tickets/closed"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/tickets/closed")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      🎟️ <span className="ml-2">Closed Tickets</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tickets/open"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/tickets/open")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      🎟️ <span className="ml-2">Open Tickets</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tickets/in-progress-tickets"
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive("/tickets/in-progress-tickets")
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                      }`}
                    >
                      🎟️ <span className="ml-2">In Progress Tickets</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            onClick={handleLogout}
          >
            <LogoutIcon />
            {!collapsed && <span className="font-semibold tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>
    );
  }

  // Admin Sidebar
  if (isAdmin) {
    return (
      <aside className={`fixed left-0 top-0 h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} z-40`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <span className={`font-bold text-xl text-white transition-all duration-300 ${collapsed ? 'hidden' : 'block'}`}>CREMIx</span>
          <button
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M4 12h16' : 'M8 6l8 6-8 6'} />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col p-2 space-y-1">
            <li>
              <Link
                to="/admin/dashboard?tab=leads"
                className={`block rounded px-2 py-2 text-sm ${
                  location.pathname === "/admin/dashboard" && location.search.includes("tab=leads")
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } ${collapsed ? 'text-center' : ''}`}
              >
                👥 {!collapsed && 'Leads'}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard?tab=opportunities"
                className={`block rounded px-2 py-2 text-sm ${
                  location.pathname === "/admin/dashboard" && location.search.includes("tab=opportunities")
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } ${collapsed ? 'text-center' : ''}`}
              >
                📈 {!collapsed && 'Opportunities'}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard?tab=customers"
                className={`block rounded px-2 py-2 text-sm ${
                  location.pathname === "/admin/dashboard" && location.search.includes("tab=customers")
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } ${collapsed ? 'text-center' : ''}`}
              >
                🧑‍🤝‍🧑 {!collapsed && 'Customers'}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard?tab=employees"
                className={`block rounded px-2 py-2 text-sm ${
                  location.pathname === "/admin/dashboard" && location.search.includes("tab=employees")
                    ? "bg-gray-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } ${collapsed ? 'text-center' : ''}`}
              >
                🧑‍💼 {!collapsed && 'Employees'}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all font-medium"
            onClick={handleLogout}
          >
            <LogoutIcon />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
    );
  }

  return null;
};

export default Sidebar;