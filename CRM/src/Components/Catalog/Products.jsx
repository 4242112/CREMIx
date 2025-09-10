import React, { useState, useEffect } from "react";
import ProductService from "../../services/ProductService";
import CategoryService from "../../services/CategoryService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    status: "Available",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = await ProductService.createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        status: formData.status,
      });

      setProducts([...products, newProduct]);
      resetForm();
      setShowAddModal(false);
      showToast("Product added successfully");
    } catch (err) {
      console.error("Error adding product:", err);
      showToast("Failed to add product");
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      status: product.status,
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct || !currentProduct.id) return;

    try {
      const updatedProduct = await ProductService.updateProduct(
        currentProduct.id,
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          status: formData.status,
        }
      );

      setProducts(
        products.map((prod) =>
          prod.id === currentProduct.id ? updatedProduct : prod
        )
      );
      resetForm();
      setShowEditModal(false);
      showToast("Product updated successfully");
    } catch (err) {
      console.error("Error updating product:", err);
      showToast("Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await ProductService.deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
        showToast("Product deleted successfully");
      } catch (err) {
        console.error("Error deleting product:", err);
        showToast("Failed to delete product");
      }
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await ProductService.searchProductsByName(searchTerm);
        setProducts(results);
      } catch (err) {
        console.error("Error searching products:", err);
        showToast("Error searching products");
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
        console.error("Error filtering products:", err);
      }
    } else {
      fetchProducts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      status: "Available",
    });
    setCurrentProduct(null);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-[#1a2236] text-white px-4 py-3 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Products</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-[#1a2236] px-3 py-2 rounded-lg shadow hover:bg-gray-200 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex gap-2 w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            className="border px-3 py-2 rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Search
          </button>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full md:w-1/4"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-6">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.description}</td>
                    <td className="p-3">₹ {product.price.toFixed(2)}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="border px-3 py-2 rounded-lg"
                value={formData.name}
                onChange={handleInputChange}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                rows="3"
                placeholder="Description"
                className="border px-3 py-2 rounded-lg col-span-2"
                value={formData.description}
                onChange={handleInputChange}
              />
              <input
                type="number"
                step="0.01"
                name="price"
                placeholder="Price"
                className="border px-3 py-2 rounded-lg"
                value={formData.price}
                onChange={handleInputChange}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="border px-3 py-2 rounded-lg"
                value={formData.name}
                onChange={handleInputChange}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <textarea
                name="description"
                rows="3"
                placeholder="Description"
                className="border px-3 py-2 rounded-lg col-span-2"
                value={formData.description}
                onChange={handleInputChange}
              />
              <input
                type="number"
                step="0.01"
                name="price"
                placeholder="Price"
                className="border px-3 py-2 rounded-lg"
                value={formData.price}
                onChange={handleInputChange}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
