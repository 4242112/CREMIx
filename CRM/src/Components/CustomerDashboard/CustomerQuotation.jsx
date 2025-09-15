import React, { useState, useEffect } from "react";
import QuotationService, { Quotation, QuotationStage } from "../../services/QuotationService";

const CustomerQuotation = ({ customerId, customerEmail }) => {
  const [quotations, setQuotations] = useState([]);
  const [loadingQuotations, setLoadingQuotations] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  useEffect(() => {
    if (customerEmail) {
      fetchQuotations();
    }
  }, [customerEmail]);

  const fetchQuotations = async () => {
    if (!customerEmail) return;
    setLoadingQuotations(true);
    try {
      const data = await QuotationService.getQuotationsByEmail(customerEmail);
      setQuotations(data);
      setError(null);

      if (data.length === 0 && customerId) {
        const dataById = await QuotationService.getCustomerQuotations(customerId);
        setQuotations(dataById);
        if (dataById.length === 0) {
          setSuccessMessage("No quotations found for your account");
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch quotations. Please try again later.");
    } finally {
      setLoadingQuotations(false);
    }
  };

  const refreshQuotations = async () => {
    if (!customerEmail) return;
    setLoadingQuotations(true);
    try {
      const data = await QuotationService.getQuotationsByEmail(customerEmail);
      setQuotations(data);

      if (data.length === 0 && customerId) {
        const dataById = await QuotationService.getCustomerQuotations(customerId);
        setQuotations(dataById);
        if (dataById.length === 0) {
          setSuccessMessage("No quotations found for your account");
        } else {
          setSuccessMessage(`Found ${dataById.length} quotation(s)`);
        }
      } else if (data.length > 0) {
        setSuccessMessage(`Successfully refreshed ${data.length} quotation(s)`);
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to refresh quotations. Please try again later.");
    } finally {
      setLoadingQuotations(false);
    }
  };

  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case QuotationStage.SENT:
        return "bg-blue-100 text-blue-800";
      case QuotationStage.ACCEPTED:
        return "bg-green-100 text-green-800";
      case QuotationStage.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const handleQuotationAction = async (id, action) => {
    if (!id) return;
    try {
      setLoadingQuotations(true);
      if (action === "accept") await QuotationService.acceptQuotation(id);
      else if (action === "reject") await QuotationService.rejectQuotation(id);

      const updatedQuotations = await QuotationService.getQuotationsByEmail(customerEmail);
      setQuotations(updatedQuotations);
      setSuccessMessage(`Quotation ${action}ed successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} quotation. Please try again.`);
    } finally {
      setLoadingQuotations(false);
    }
  };

  const handleViewQuotation = (quotationId) => {
    if (!quotationId) return;
    const quotation = quotations.find((q) => q.id === quotationId);
    if (quotation) {
      setSelectedQuotation(quotation);
      setShowQuotationModal(true);
    } else {
      setSuccessMessage(`Could not find details for quotation #${quotationId}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white shadow rounded p-4">
        <h5 className="font-semibold">Your Quotations</h5>
        <button
          className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
          onClick={refreshQuotations}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
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
          {error}
          <button className="absolute top-1 right-2 text-red-700 font-bold" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Loading */}
      {loadingQuotations && (
        <div className="text-center py-10">
          <div className="inline-block w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-700">Loading quotations...</p>
        </div>
      )}

      {/* No quotations */}
      {!loadingQuotations && quotations.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No quotations found. Any quotations related to your account will be displayed here.
        </div>
      )}

      {/* Quotations Table */}
      {!loadingQuotations && quotations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Quotation ID</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Total Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{quotation.id}</td>
                  <td className="px-4 py-2 border">{quotation.title || 'N/A'}</td>
                  <td className="px-4 py-2 border">{formatDate(quotation.createdAt)}</td>
                  <td className="px-4 py-2 border">₹{quotation.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded text-sm ${getStageBadgeColor(quotation.stage)}`}>
                      {quotation.stage === QuotationStage.SENT ? "RECEIVED" : quotation.stage || "DRAFT"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border space-x-1">
                    <button
                      className="px-2 py-1 text-blue-600 border border-blue-600 rounded text-sm hover:bg-blue-50"
                      onClick={() => handleViewQuotation(quotation.id)}
                    >
                      View Details
                    </button>
                    {quotation.stage === QuotationStage.SENT && (
                      <>
                        <button
                          className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          onClick={() => quotation.id && handleQuotationAction(quotation.id, "accept")}
                        >
                          Accept
                        </button>
                        <button
                          className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          onClick={() => quotation.id && handleQuotationAction(quotation.id, "reject")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showQuotationModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold"
              onClick={() => setShowQuotationModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Quotation #{selectedQuotation.id}{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${getStageBadgeColor(selectedQuotation.stage)}`}
              >
                {selectedQuotation.stage === QuotationStage.SENT
                  ? "RECEIVED"
                  : selectedQuotation.stage}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h6 className="font-semibold">Quotation Details</h6>
                <p><strong>Title:</strong> {selectedQuotation.title}</p>
                <p><strong>Description:</strong> {selectedQuotation.description || "No description provided."}</p>
                <p><strong>Date Created:</strong> {formatDate(selectedQuotation.createdAt)}</p>
                <p><strong>Valid Until:</strong> {formatDate(selectedQuotation.validUntil)}</p>
              </div>
              <div className="text-left md:text-right">
                <h6 className="font-semibold">Payment Details</h6>
                <p><strong>Total Amount:</strong> ₹{selectedQuotation.amount.toFixed(2)}</p>
              </div>
            </div>

            <hr className="my-4" />

            <h6 className="font-semibold mb-2">Item Details</h6>
            {selectedQuotation.items && selectedQuotation.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1 border">#</th>
                      <th className="px-2 py-1 border">Product</th>
                      <th className="px-2 py-1 border">Quantity</th>
                      <th className="px-2 py-1 border">Rate</th>
                      <th className="px-2 py-1 border">Discount %</th>
                      <th className="px-2 py-1 border">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuotation.items.map((item, idx) => {
                      const productName = item.product?.name || "Unknown Product";
                      const productPrice = item.product?.price || 0;
                      const quantity = item.quantity || 1;
                      const discount = item.discount || 0;
                      const subtotal = quantity * productPrice * (1 - discount / 100);
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-2 py-1 border">{idx + 1}</td>
                          <td className="px-2 py-1 border">{productName}</td>
                          <td className="px-2 py-1 border">{quantity}</td>
                          <td className="px-2 py-1 border">₹{productPrice.toFixed(2)}</td>
                          <td className="px-2 py-1 border">{discount}%</td>
                          <td className="px-2 py-1 border">₹{subtotal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-blue-50 text-blue-700 p-2 rounded">No items found in this quotation.</div>
            )}

            {selectedQuotation.stage === QuotationStage.SENT && (
              <div className="mt-4 bg-blue-50 text-blue-700 p-2 rounded">
                This quotation has been sent to you and is awaiting your response.
              </div>
            )}
            {selectedQuotation.stage === QuotationStage.ACCEPTED && (
              <div className="mt-4 bg-green-50 text-green-700 p-2 rounded">
                You have accepted this quotation. An invoice will be generated soon.
              </div>
            )}
            {selectedQuotation.stage === QuotationStage.REJECTED && (
              <div className="mt-4 bg-red-50 text-red-700 p-2 rounded">
                You have rejected this quotation.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerQuotation;
