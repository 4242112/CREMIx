import React, { useState, useEffect } from "react";
import CategoryService from "../../services/CategoryService";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddCategory = async () => {
    try {
      const newCategory = await CategoryService.createCategory({
        name: formData.name,
        description: formData.description,
      });

      setCategories([...categories, newCategory]);
      setFormData({ name: "", description: "" });
      setShowAddModal(false);
      showToast("Category added successfully");
    } catch (err) {
      console.error("Error adding category:", err);
      showToast("Failed to add category");
    }
  };

  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setShowEditModal(true);
  };

  const handleUpdateCategory = async () => {
    if (!currentCategory || !currentCategory.id) return;

    try {
      const updatedCategory = await CategoryService.updateCategory(
        currentCategory.id,
        {
          name: formData.name,
          description: formData.description,
        }
      );

      setCategories(
        categories.map((cat) =>
          cat.id === currentCategory.id ? updatedCategory : cat
        )
      );

      setShowEditModal(false);
      setCurrentCategory(null);
      setFormData({ name: "", description: "" });
      showToast("Category updated successfully");
    } catch (err) {
      console.error("Error updating category:", err);
      showToast("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await CategoryService.deleteCategory(id);
        setCategories(categories.filter((cat) => cat.id !== id));
        showToast("Category deleted successfully");
      } catch (err) {
        console.error("Error deleting category:", err);
        showToast("Failed to delete category");
      }
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await CategoryService.searchCategories(searchTerm);
        setCategories(results);
      } catch (err) {
        console.error("Error searching categories:", err);
        showToast("Error searching categories");
      }
    } else {
      fetchCategories();
    }
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
        <h3 className="text-lg font-semibold">Categories</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-[#1a2236] px-3 py-2 rounded-lg shadow hover:bg-gray-200 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Search */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Search categories..."
          className="border px-3 py-2 rounded-lg w-1/3"
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
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={category.id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{category.name}</td>
                    <td className="p-3">{category.description}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 py-4"
                  >
                    No categories found
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              className="w-full mb-3 border px-3 py-2 rounded-lg"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="w-full mb-3 border px-3 py-2 rounded-lg"
              value={formData.description}
              onChange={handleInputChange}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              className="w-full mb-3 border px-3 py-2 rounded-lg"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="w-full mb-3 border px-3 py-2 rounded-lg"
              value={formData.description}
              onChange={handleInputChange}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
