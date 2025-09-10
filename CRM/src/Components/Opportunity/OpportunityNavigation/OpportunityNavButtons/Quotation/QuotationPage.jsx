import React, { useState, useEffect } from "react";
import QuotationForm from "./QuotationForm";
import QuotationService, { QuotationStage } from "../../../../../services/QuotationService";
import InvoiceService from "../../../../../services/InvoiceService";

const QuotationPage = ({ opportunity }) => {
  const [showForm, setShowForm] = useState(false);
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        if (opportunity.quotationId) {
          const data = await QuotationService.getQuotation(opportunity.id);
          data.opportunityId = opportunity.id;
          setQuotation(data);
        }
      } catch (err) {
        console.error("Failed to load quotation", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
  }, [opportunity.quotationId, opportunity.id]);

  const handleCreateOrUpdate = async (data) => {
    if (formSubmitting) return;
    setFormSubmitting(true);

    try {
      let savedQuotation;
      if (data.id) {
        savedQuotation = await QuotationService.updateQuotation(data.id, data);
        setMessage("Quotation updated successfully");
      } else {
        savedQuotation = await QuotationService.saveQuotation(opportunity.id, data);
        setMessage("Quotation created successfully");
      }

      setQuotation(savedQuotation);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save quotation", err);
      setError("Failed to save quotation. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSendQuotation = async () => {
    if (!quotation?.id) return;

    setMessage(null);
    setError(null);
    setSendLoading(true);

    try {
      const updatedQuotation = await QuotationService.sendQuotation(quotation.id);
      setQuotation(updatedQuotation);
      setMessage("Quotation sent successfully to the customer!");
    } catch (err) {
      console.error("Failed to send quotation", err);
      setError("Failed to send quotation. Please try again.");
    } finally {
      setSendLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!quotation?.id) return;

    setMessage(null);
    setError(null);
    setInvoiceLoading(true);
    setShowConfirmModal(false);

    try {
      const invoice = await InvoiceService.generateInvoiceFromQuotation(quotation.id);
      console.log("Invoice generated:", invoice);
      setMessage("Invoice generated successfully! Invoice #" + invoice.invoiceNumber);
    } catch (err) {
      console.error("Failed to generate invoice", err);
      setError("Failed to generate invoice. Please try again.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const getStageBadgeColor = (stage) => {
    switch (stage) {
      case QuotationStage.SENT:
        return "bg-blue-500 text-white";
      case QuotationStage.ACCEPTED:
        return "bg-green-500 text-white";
      case QuotationStage.REJECTED:
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (showForm || !quotation) {
    return <QuotationForm onSubmit={handleCreateOrUpdate} opportunity={opportunity} quotation={quotation} />;
  }

  return (
    <div className="max-w-5xl mx-auto my-6">
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 flex justify-between">
          {message}
          <button onClick={() => setMessage(null)}>✖</button>
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 flex justify-between">
          {error}
          <button onClick={() => setError(null)}>✖</button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        {/* Card Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <div>
            <h5 className="text-lg font-semibold inline mr-2">Quotation</h5>
            {quotation.stage && (
              <span className={`px-2 py-1 rounded text-sm ${getStageBadgeColor(quotation.stage)}`}>
                {quotation.stage}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {quotation.stage === QuotationStage.DRAFT && (
              <button
                onClick={handleSendQuotation}
                disabled={sendLoading}
                className="bg-green-600 text-white px-3 py-1 rounded flex items-center disabled:opacity-50"
              >
                {sendLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Sending...
                  </span>
                ) : (
                  <>Send to Customer</>
                )}
              </button>
            )}
            {quotation.stage === QuotationStage.ACCEPTED && (
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={invoiceLoading}
                className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center disabled:opacity-50"
              >
                {invoiceLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Generating...
                  </span>
                ) : (
                  <>Generate Invoice</>
                )}
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              disabled={formSubmitting}
              className="bg-gray-700 text-white px-3 py-1 rounded flex items-center disabled:opacity-50"
            >
              Edit Quotation
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <h6 className="font-semibold">{quotation.title}</h6>
          <p>{quotation.description}</p>
          <p>
            <strong>Valid Until:</strong> {new Date(quotation.validUntil).toLocaleDateString()}
          </p>
          <p>
            <strong>Amount:</strong> ₹{quotation.amount.toFixed(2)}
          </p>
          <hr className="my-3" />

          <div className="overflow-x-auto">
            <table className="table-auto border w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border">#</th>
                  <th className="px-3 py-2 border">Product</th>
                  <th className="px-3 py-2 border">Quantity</th>
                  <th className="px-3 py-2 border">Rate</th>
                  <th className="px-3 py-2 border">Discount %</th>
                  <th className="px-3 py-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items?.map((item, idx) => {
                  const productName = item.product?.name || "Unknown Product";
                  const productPrice = item.product?.price || 0;
                  const quantity = item.quantity || 1;
                  const discount = item.discount || 0;
                  const subtotal = quantity * productPrice * (1 - discount / 100);

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">{idx + 1}</td>
                      <td className="px-3 py-2 border">{productName}</td>
                      <td className="px-3 py-2 border">{quantity}</td>
                      <td className="px-3 py-2 border">₹{productPrice.toFixed(2)}</td>
                      <td className="px-3 py-2 border">{discount}%</td>
                      <td className="px-3 py-2 border">₹{subtotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-4 py-3 border-t text-sm">
          {quotation.stage === QuotationStage.DRAFT && (
            <div className="text-gray-500">This quotation is still in draft mode. Send it to make it visible to the customer.</div>
          )}
          {quotation.stage === QuotationStage.SENT && (
            <div className="text-blue-500">This quotation has been sent to the customer and is awaiting their response.</div>
          )}
          {quotation.stage === QuotationStage.ACCEPTED && (
            <div className="text-green-500">This quotation has been accepted. You can now generate an invoice.</div>
          )}
          {quotation.stage === QuotationStage.REJECTED && (
            <div className="text-red-500">This quotation has been rejected by the customer.</div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h3 className="font-semibold">Generate Invoice</h3>
              <button onClick={() => setShowConfirmModal(false)}>✖</button>
            </div>
            <div className="p-4">
              Are you sure you want to generate an invoice based on this quotation? This will create a billable invoice for the customer.
            </div>
            <div className="flex justify-end space-x-2 border-t px-4 py-2">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={handleGenerateInvoice}
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationPage;
