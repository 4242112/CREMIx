// FILE: src/Components/AdminDashboard/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LeadsTab from "./LeadsTab";
import OpportunitiesTab from "./OpportunitiesTab";
import CustomersTab from "./CustomersTab";
import EmployeesTab from "./EmployeesTab";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab") || "leads";

  const [activeTab, setActiveTab] = useState(tabParam);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const tab = queryParams.get("tab") || "leads";
    setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    const checkAuth = () => {
      const authString = localStorage.getItem("adminAuth");

      if (!authString) {
        setError("You are not logged in. Please login to continue.");
        setIsLoading(false);
        return;
      }

      try {
        const authData = JSON.parse(authString);

        if (!authData.isAuthenticated || authData.email !== "admin@gmail.com") {
          setError("Invalid admin credentials. Please login again.");
          localStorage.removeItem("adminAuth");
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
      } catch (err) {
        setError("Authentication error. Please login again.");
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "leads":
        return <LeadsTab onError={(msg) => setError(msg)} />;
      case "opportunities":
        return <OpportunitiesTab onError={(msg) => setError(msg)} />;
      case "customers":
        return <CustomersTab onError={(msg) => setError(msg)} />;
      case "employees":
        return (
          <EmployeesTab
            onError={(msg) => setError(msg)}
            onSuccess={(msg) => setSuccessMessage(msg)}
          />
        );
      case "catalog":
        return (
          <div className="p-4 mb-4 text-blue-700 bg-blue-100 rounded-lg">
            Catalog management will be implemented here.
          </div>
        );
      default:
        return (
          <div className="p-4 mb-4 text-yellow-700 bg-yellow-100 rounded-lg">
            Unknown section selected!
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-red-100 border border-red-300 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          Authentication Error
        </h2>
        <p className="text-red-600">{error}</p>
        <hr className="my-4 border-red-300" />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="content-body space-y-4">
        {successMessage && (
          <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg relative">
            <span>{successMessage}</span>
            <button
              className="absolute top-2 right-2 text-green-700 hover:text-green-900"
              onClick={() => setSuccessMessage(null)}
            >
              ✕
            </button>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
