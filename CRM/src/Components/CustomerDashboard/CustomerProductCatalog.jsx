import React, { useState, useEffect } from "react";
import ProductService from "../../services/ProductService";
import CategoryService from "../../services/CategoryService";
import QuotationService from "../../services/QuotationService";

const CustomerProductCatalog = ({ customerId, customerEmail }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestingQuote, setRequestingQuote] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ProductService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await ProductService.searchProductsByName(searchTerm);
        setProducts(results);
      } catch (err) {
        console.error("Error searching products:", err);
      }
    } else {
      fetchProducts();
    }
  };

  const handleCategoryFilter = async (category) => {
    setCategoryFilter(category);
    if (category) {
      try {
        const results = await ProductService.getProductsByCategory(category);
        setProducts(results);
      } catch (err) {
        console.error("Error filtering by category:", err);
      }
    } else {
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequestQuote = async (product) => {
    if (!customerId || !customerEmail) {
      setError("Customer information not available. Please login again.");
      return;
    }

    setRequestingQuote(product.id);
    try {
      // Create a draft quotation for the customer with the selected product
      const quotationData = {
        title: `Quote Request for ${product.name}`,
        description: `Customer quote request for ${product.name}`,
        amount: parseFloat(product.price) || 0,
        items: [{
          quantity: 1,
          discount: 0.0,
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price) || 0,
            category: product.category,
            status: product.status
          }
        }],
        stage: 'DRAFT'
      };

      await QuotationService.createQuotationForCustomer(customerId, quotationData);

      setSuccessMessage(`Quote request submitted for ${product.name}! A draft quotation has been created and saved to your quotations.`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error('Error requesting quote:', error);
      setError(`Failed to request quote for ${product.name}. Please try again.`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setRequestingQuote(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 text-gray-500 hover:text-blue-500"
            >
              🔍
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchTerm || categoryFilter ? "No products found matching your criteria" : "No products available"}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              {/* Product Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                {product.category && (
                  <div className="mb-3">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleRequestQuote(product)}
                  disabled={product.status !== "Available" || requestingQuote === product.id}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    product.status === "Available"
                      ? requestingQuote === product.id
                        ? "bg-blue-400 text-white cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {requestingQuote === product.id
                    ? "Requesting..."
                    : product.status === "Available"
                    ? "Request Quote"
                    : "Unavailable"
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerProductCatalog;