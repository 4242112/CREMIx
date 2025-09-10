import React, { useState, useEffect } from "react";
import InvoiceService from "../../services/InvoiceService";
import Invoices from "../Customer/CustomerNavigation/Invoice/Invoices";

const CustomerInvoices = ({ customerId, customerEmail, customerData }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  useEffect(() => {
    if (customerEmail) {
      fetchInvoices();
    }
  }, [customerId, customerEmail]);

  const fetchInvoices = async () => {
    if (!customerEmail) {
      console.log("No customer email available, cannot fetch invoices");
      return;
    }

    console.log("Fetching invoices for email:", customerEmail);
    setLoadingInvoices(true);
    try {
      const data = await InvoiceService.getInvoicesByEmail(customerEmail);
      console.log("Invoices fetched successfully:", data);
      setError(null);

      if (data.length === 0 && customerId) {
        console.log("No invoices found by email, trying by customer ID");
        try {
          const dataById = await InvoiceService.getInvoicesByCustomerId(customerId);
          console.log("Invoices fetched by customer ID:", dataById);

          if (dataById.length === 0) {
            setSuccessMessage("No invoices found for your account");
            setTimeout(() => setSuccessMessage(null), 3000);
          }
        } catch (idError) {
          console.error("Error fetching invoices by customer ID:", idError);
        }
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to fetch invoices. Please try again later.");
    } finally {
      setLoadingInvoices(false);
    }
  };

  if (loadingInvoices) {
    return (
      <div className="text-center py-10">
        <div className="inline-block w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-700">Loading your invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block">{successMessage}</span>
          <button
            className="absolute top-1 right-2 text-green-700 font-bold"
            onClick={() => setSuccessMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block">{error}</span>
          <button
            className="absolute top-1 right-2 text-red-700 font-bold"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      <Invoices customer={customerData} />
    </div>
  );
};

export default CustomerInvoices;
