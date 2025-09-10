import React, { useEffect, useState } from "react";
import ProductService from "../../../../../services/ProductService";

const QuotationForm = ({ opportunity, quotation, onSubmit }) => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState(quotation?.title || "");
  const [description, setDescription] = useState(quotation?.description || "");
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  });

  const [items, setItems] = useState(quotation?.items || []);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    ProductService.getAllProducts().then(setProducts);
  }, []);

  useEffect(() => {
    const totalAmount = items.reduce(
      (sum, i) => sum + i.quantity * i.product.price * (1 - i.discount / 100),
      0
    );
    setTotal(totalAmount);
  }, [items]);

  const addItem = () => {
    if (!selectedProduct) return;
    const newItem = { product: selectedProduct, quantity, discount };
    setItems([...items, newItem]);
    setQuantity(1);
    setDiscount(0);
    setSelectedProduct(null);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuotation = {
      id: quotation?.id,
      title,
      description,
      validUntil: new Date(validUntil),
      amount: total,
      items,
      isApproved: false,
      opportunityId: opportunity.id,
      stage: quotation?.stage,
    };

    onSubmit(newQuotation);
  };

  return (
    <div className="max-w-5xl mx-auto my-6 px-4">
      <div className="bg-white shadow rounded-lg">
        <div className="border-b px-6 py-4">
          <h5 className="text-lg font-semibold">
            {quotation?.id ? "Edit" : "Create"} Quotation
          </h5>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title + Valid Until */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                rows="3"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Item Details */}
            <div>
              <h6 className="text-md font-semibold mb-3">Item Details</h6>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Product
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={selectedProduct?.id || ""}
                    onChange={(e) => {
                      const p = products.find(
                        (p) => p.id === parseInt(e.target.value)
                      );
                      setSelectedProduct(p || null);
                    }}
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border rounded-lg px-3 py-2"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full border rounded-lg px-3 py-2"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            {items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border mt-6 text-sm text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border">Product</th>
                      <th className="px-4 py-2 border">Qty</th>
                      <th className="px-4 py-2 border">Rate</th>
                      <th className="px-4 py-2 border">Discount</th>
                      <th className="px-4 py-2 border">Subtotal</th>
                      <th className="px-4 py-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="odd:bg-white even:bg-gray-50">
                        <td className="px-4 py-2 border">{item.product.name}</td>
                        <td className="px-4 py-2 border">{item.quantity}</td>
                        <td className="px-4 py-2 border">
                          ₹{item.product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 border">{item.discount}%</td>
                        <td className="px-4 py-2 border">
                          ₹
                          {(
                            item.quantity *
                            item.product.price *
                            (1 - item.discount / 100)
                          ).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 border">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 text-xs"
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Total + Submit */}
            <div className="flex justify-end items-center">
              <h5 className="text-lg font-semibold">
                Total: ₹{total.toFixed(2)}
              </h5>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Save Quotation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;
