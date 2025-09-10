import axios from 'axios';

const API_URL = 'http://localhost:8080/api/categories';

/**
 * @typedef {Object} Category
 * @property {number} [id]
 * @property {string} name
 * @property {string} description
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

const CategoryService = {
    /** Get all categories */
    getAllCategories: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    /** Get category by ID
     * @param {number} id 
     */
    getCategoryById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    /** Create a new category
     * @param {Category} category 
     */
    createCategory: async (category) => {
        const response = await axios.post(API_URL, category);
        return response.data;
    },

    /** Update category by ID
     * @param {number} id 
     * @param {Category} category 
     */
    updateCategory: async (id, category) => {
        const response = await axios.put(`${API_URL}/${id}`, category);
        return response.data;
    },

    /** Delete category by ID
     * @param {number} id 
     */
    deleteCategory: async (id) => {
        await axios.delete(`${API_URL}/${id}`);
    },

    /** Search categories by name
     * @param {string} name 
     */
    searchCategories: async (name) => {
        const response = await axios.get(`${API_URL}/search?name=${encodeURIComponent(name)}`);
        return response.data;
    }
};

export default CategoryService;
