import React from "react";
import { Invoice } from "../../../../services/InvoiceService";
import { Customer } from "../../../../services/CustomerService";
import { XMarkIcon, PrinterIcon } from "@heroicons/react/24/solid";

const InvoiceView = ({ show, onHide, invoice, customer }) => {
  const handlePrint = () => {
    const printContents = document.getElementById("printableInvoice")?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-xl font-bold">Invoice #{invoice.invoiceNumber}</h3>
          <button
            onClick={onHide}
            className="text-gray-600 hover:text-gray-800"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div id="printableInvoice" className="p-6">
          {/* Invoice Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Invoice</h2>

            {/* Business Details */}
            <div className="mb-4">
              <div className="font-bold text-lg">ClientNest Solutions</div>
              <div>7th Floor Nayti Park</div>
              <div>Pune, Maharashtra 414002</div>
              <div>Phone: (800) 555-8800</div>
              <div>Email: Admin@clientnest.com</div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {/* Billing To */}
              <div className="bg-gray-100 p-4 rounded">
                <h6 className="font-bold text-gray-800 border-b border-gray-300 pb-2 mb-2">
                  Bill To
                </h6>
                <div>{invoice.customerName || customer?.name || ""}</div>
                <div>{customer?.address || ""}</div>
                <div>{customer?.email || ""}</div>
                <div>{customer?.phoneNumber || ""}</div>
              </div>

              {/* Invoice Details */}
              <div className="bg-gray-100 p-4 rounded">
                <h6 className="font-bold text-gray-800 border-b border-gray-300 pb-2 mb-2">
                  Invoice Details
                </h6>
                <div>
                  <strong>Invoice #:</strong> {invoice.invoiceNumber}
                </div>
                <div>
                  <strong>Invoice Date:</strong>{" "}
                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Due Date:</strong>{" "}
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2 text-left">Product/Services</th>
                  <th className="border p-2 w-24">Quantity</th>
                  <th className="border p-2 w-28">Rate</th>
                  <th className="border p-2 w-28">Discount</th>
                  <th className="border p-2 w-28 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => {
                  const price = item.product?.price || 0;
                  const quantity = item.quantity || 0;
                  const discount = item.discount || 0;
                  const amount = quantity * price * (1 - discount / 100);

                  return (
                    <tr key={index}>
                      <td className="border p-2">{item.product?.name || "Unknown Product"}</td>
                      <td className="border p-2">{quantity}</td>
                      <td className="border p-2">₹{price.toFixed(2)}</td>
                      <td className="border p-2">{discount}%</td>
                      <td className="border p-2 text-right">₹{amount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 flex justify-end">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between border-b py-1">
                <div>Subtotal</div>
                <div>₹{invoice.subtotal.toFixed(2)}</div>
              </div>
              <div className="flex justify-between border-b py-1">
                <div>Tax {invoice.taxRate}%</div>
                <div>₹{invoice.taxAmount.toFixed(2)}</div>
              </div>
              <div className="flex justify-between font-bold text-lg border-t-2 pt-2 mt-2">
                <div>Total</div>
                <div>₹{invoice.total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Footer / Payment Info */}
          <div className="mt-6 border-t pt-4">
            <h6 className="font-bold mb-2 text-gray-800">Payment Information</h6>
            <p>Please make payment by bank transfer to:</p>
            <p>
              Bank: National Bank
              <br />
              Account Name: ClientNest Solutions
              <br />
              Account Number: 1234567890
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button
            onClick={onHide}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <PrinterIcon className="w-5 h-5" />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Print styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printableInvoice, #printableInvoice * {
              visibility: visible;
            }
            #printableInvoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              box-shadow: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InvoiceView;
