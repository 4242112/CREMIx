import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthService from "../../../services/AuthService";

const Sidebar = () => {
  const location = useLocation();
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const customerAuth = localStorage.getItem("customerAuth");
    if (customerAuth) {
      try {
        const customerData = JSON.parse(customerAuth);
        if (customerData.isAuthenticated) {
          setIsCustomer(true);
          setIsAdmin(false);
          setIsEmployee(false);
          return;
        }
      } catch (e) {
        console.error("Error parsing customer auth data:", e);
      }
    }

    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth) {
      try {
        const adminData = JSON.parse(adminAuth);
        if (adminData.isAuthenticated) {
          setIsAdmin(true);
          setIsEmployee(false);
          setIsCustomer(false);
          return;
        }
      } catch (e) {
        console.error("Error parsing admin auth data:", e);
      }
    }

    const employeeAuth = AuthService.getCurrentEmployee();
    if (employeeAuth) {
      if (employeeAuth.role === "ADMIN") {
        setIsAdmin(true);
        setIsEmployee(false);
        setIsCustomer(false);
        return;
      } else {
        setIsAdmin(false);
        setIsEmployee(true);
        setIsCustomer(false);
      }
    } else if (AuthService.isEmployeeLoggedIn()) {
      setIsAdmin(false);
      setIsEmployee(true);
      setIsCustomer(false);
    }
  }, []);

  const toggleDropdown = (dropdownName) => {
    setExpandedDropdown((prev) =>
      prev === dropdownName ? null : dropdownName
    );
  };

  const isActive = (path) => location.pathname === path;

  // Customer Sidebar
  const renderCustomerSidebar = () => (
    <ul className="flex flex-col p-2 space-y-1 overflow-y-auto flex-grow">
      <li>
        <Link
          to="/customer-portal?tab=quotations"
          className={`block rounded px-2 py-2 text-sm ${
            location.pathname === "/customer-portal" &&
            (location.search.includes("tab=quotations") || !location.search)
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
        >
          📄 Quotations
        </Link>
      </li>
      <li>
        <Link
          to="/customer-portal?tab=invoices"
          className={`block rounded px-2 py-2 text-sm ${
            location.pathname === "/customer-portal" &&
            location.search.includes("tab=invoices")
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
        >
          🧾 Invoices
        </Link>
      </li>
      <li>
        <Link
          to="/customer-portal?tab=tickets"
          className={`block rounded px-2 py-2 text-sm ${
            location.pathname === "/customer-portal" &&
            location.search.includes("tab=tickets")
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
        >
          🎫 Tickets
        </Link>
      </li>
    </ul>
  );

  // Admin Sidebar
  const renderAdminSidebar = () => (
    <ul className="flex flex-col p-2 space-y-1 overflow-y-auto flex-grow">
      <li>
        <Link
          to="/"
          className={`block rounded px-2 py-2 text-sm ${
            isActive("/")
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
        >
          📊 Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/admin/dashboard?tab=leads"
          className={`block rounded px-2 py-2 text-sm ${
            location.pathname === "/admin/dashboard" &&
            location.search.includes("tab=leads")
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
        >
          👥 Leads
        </Link>
      </li>
      <li>
        <Link
          to="/admin/dashboard?tab=opportunities"
          className={`block rounded px-2 py-2 text-sm ${
            location.pathname === "/admin/dashboard" &&
            location.search.includes("tab=opportunities")
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
        >
          📈 Opportunities
        </Link>
      </li>
      <li>
        <Link
          to="/admin/dashboard?tab=customers"
          className={`block rounded px-2 py-2 text-sm ${
            location.pathname === "/admin/dashboard" &&
            location.search.includes("tab=customers")
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
        >
          🧑‍🤝‍🧑 Customers
        </Link>
      </li>
      <li>
        <Link
          to="/admin/dashboard?tab=employees"
          className={`block rounded px-2 py-2 text-sm ${
            location.pathname === "/admin/dashboard" &&
            location.search.includes("tab=employees")
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
        >
          🧑‍💼 Employees
        </Link>
      </li>
    </ul>
  );

  // Employee Sidebar
  const renderEmployeeSidebar = () => (
    <ul className="flex flex-col p-2 space-y-1 overflow-y-auto flex-grow">
      <li>
        <Link
          to="/"
          className={`block rounded px-2 py-2 text-sm ${
            isActive("/")
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
        >
          📊 Dashboard
        </Link>
      </li>
      <li>
        <button
          className={`w-full flex justify-between items-center px-2 py-2 rounded text-sm ${
            expandedDropdown === "leads"
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
          onClick={() => toggleDropdown("leads")}
        >
          <span>👥 Leads</span>
          <span>{expandedDropdown === "leads" ? "▲" : "▼"}</span>
        </button>
        {expandedDropdown === "leads" && (
          <ul className="ml-3 mt-1 space-y-1">
            <li>
              <Link
                to="/leads/manage"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/leads/manage")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                📋 Manage Leads
              </Link>
            </li>
            <li>
              <Link
                to="/leads/recycle-bin"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/leads/recycle-bin")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                🗑 Recycle Bin
              </Link>
            </li>
          </ul>
        )}
      </li>
      <li>
        <button
          className={`w-full flex justify-between items-center px-2 py-2 rounded text-sm ${
            expandedDropdown === "opportunity"
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
          onClick={() => toggleDropdown("opportunity")}
        >
          <span>📈 Opportunity</span>
          <span>{expandedDropdown === "opportunity" ? "▲" : "▼"}</span>
        </button>
        {expandedDropdown === "opportunity" && (
          <ul className="ml-3 mt-1 space-y-1">
            <li>
              <Link
                to="/opportunity/manage"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/opportunity/manage")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                📋 Manage Opportunities
              </Link>
            </li>
            <li>
              <Link
                to="/opportunity/recycle-bin"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/opportunity/recycle-bin")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                🗑 Recycle Bin
              </Link>
            </li>
          </ul>
        )}
      </li>
      <li>
        <button
          className={`w-full flex justify-between items-center px-2 py-2 rounded text-sm ${
            expandedDropdown === "customers"
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
          onClick={() => toggleDropdown("customers")}
        >
          <span>🧑‍🤝‍🧑 Customers</span>
          <span>{expandedDropdown === "customers" ? "▲" : "▼"}</span>
        </button>
        {expandedDropdown === "customers" && (
          <ul className="ml-3 mt-1 space-y-1">
            <li>
              <Link
                to="/customer/manage"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/customer/manage")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                📋 Manage Customers
              </Link>
            </li>
            <li>
              <Link
                to="/customer/recycle-bin"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/customer/recycle-bin")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                🗑 Recycle Bin
              </Link>
            </li>
          </ul>
        )}
      </li>
      <li>
        <button
          className={`w-full flex justify-between items-center px-2 py-2 rounded text-sm ${
            expandedDropdown === "catalogs"
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
          onClick={() => toggleDropdown("catalogs")}
        >
          <span>🏬 Catalog</span>
          <span>{expandedDropdown === "catalogs" ? "▲" : "▼"}</span>
        </button>
        {expandedDropdown === "catalogs" && (
          <ul className="ml-3 mt-1 space-y-1">
            <li>
              <Link
                to="/catalog/products"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/catalog/products")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
               🛒 Product
              </Link>
            </li>
            <li>
              <Link
                to="/catalog/category"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/catalog/category")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                🛍️ Category
              </Link>
            </li>
          </ul>
        )}
      </li>
      <li>
        <button
          className={`w-full flex justify-between items-center px-2 py-2 rounded text-sm ${
            expandedDropdown === "tickets"
              ? "bg-[#2d3a5d] text-white"
              : "text-gray-300 hover:bg-[#2d3a5d] hover:text-white"
          }`}
          onClick={() => toggleDropdown("tickets")}
        >
          <span>🎫 Tickets</span>
          <span>{expandedDropdown === "tickets" ? "▲" : "▼"}</span>
        </button>
        {expandedDropdown === "tickets" && (
          <ul className="ml-3 mt-1 space-y-1">
            <li>
              <Link
                to="/tickets/closed"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/tickets/closed")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                🎟️ Closed Tickets
              </Link>
            </li>
            <li>
              <Link
                to="/tickets/open"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/tickets/open")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                🎟️ Open Tickets
              </Link>
            </li>
            <li>
              <Link
                to="/tickets/in-progress-tickets"
                className={`block rounded px-2 py-1 text-sm ${
                  isActive("/tickets/in-progress-tickets")
                    ? "bg-[#374773] text-white"
                    : "text-gray-400 hover:bg-[#374773] hover:text-white"
                }`}
              >
                🎟️ In Progress Tickets
              </Link>
            </li>
          </ul>
        )}
      </li>
    </ul>
  );

  return (
    <div className="fixed top-14 left-0 w-52 h-screen bg-[#1a2236] text-white flex flex-col border-r border-[#2d3a5d] z-50">
      {isCustomer
        ? renderCustomerSidebar()
        : AuthService.isEmployeeLoggedIn()
        ? renderEmployeeSidebar()
        : renderAdminSidebar()}

      <div className="p-2 border-t border-[#2d3a5d] text-xs text-gray-400 bg-[#1a2236]">
        ℹ️ ClientNest CRM v1.0
      </div>
    </div>
  );
};

export default Sidebar;
