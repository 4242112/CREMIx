import React, { useState, useEffect } from "react";
import { Customer } from "../../../../services/CustomerService";
import InvoiceService from "../../../../services/InvoiceService";
import InvoiceView from "./InvoiceView";
import { ArrowPathIcon, ExclamationTriangleIcon, EyeIcon, DocumentTextIcon } from "@heroicons/react/24/solid";

const Invoices = ({ customer }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const fetchInvoices = async () => {
    if (!customer?.id) return;
    setLoading(true);
    try {
      const data = await InvoiceService.getInvoicesByCustomerId(customer.id);
      setInvoices(data);
      setError(null);
      console.log("Invoices fetched successfully:", data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setShowInvoiceView(true);
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="flex justify-center items-center p-5">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h5 className="text-lg font-semibold">Invoices</h5>
        <button
          onClick={fetchInvoices}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-600 rounded text-sm"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {error && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="text-center py-10">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto" />
            <p className="mt-4 text-lg font-medium text-gray-700">No invoices available</p>
            <p className="text-gray-500">Create a new invoice for this customer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Invoice #</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Due Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-2 text-blue-600 cursor-pointer hover:underline"
                        onClick={() => handleViewInvoice(invoice)}>
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-2">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">₹{invoice.total.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 px-2 py-1 border border-yellow-600 rounded text-sm"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice View Modal */}
      {currentInvoice && (
        <InvoiceView
          show={showInvoiceView}
          onHide={() => setShowInvoiceView(false)}
          invoice={currentInvoice}
          customer={customer}
        />
      )}
    </div>
  );
};

export default Invoices;
