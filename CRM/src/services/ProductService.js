import apiClient from './apiClient';
import InvoiceService from './InvoiceService';

const API_URL = '/products';

const ProductService = {
    getAllProducts: async () => {
        const response = await apiClient.get(API_URL);
        return response.data;
    },

    getProductById: async (id) => {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
    },

    createProduct: async (product) => {
        const response = await apiClient.post(API_URL, product);
        return response.data;
    },

    updateProduct: async (id, product) => {
        const response = await apiClient.put(`${API_URL}/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id) => {
        await apiClient.delete(`${API_URL}/${id}`);
    },

    searchProductsByName: async (name) => {
        const response = await apiClient.get(`${API_URL}/search?name=${name}`);
        return response.data;
    },

    getProductsByCategory: async (category) => {
        const response = await apiClient.get(`${API_URL}/category/${category}`);
        return response.data;
    },

    getProductsByStatus: async (status) => {
        const response = await apiClient.get(`${API_URL}/status/${status}`);
        return response.data;
    },

    getProductCategoryCounts: async () => {
        try {
            const products = await ProductService.getAllProducts();
            const categoryCounts = {};

            products.forEach(product => {
                if (product.category) {
                    categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
                }
            });

            return Object.entries(categoryCounts)
                .map(([category, value]) => ({ category, value }))
                .sort((a, b) => b.value - a.value);
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }
    },

    getProductPerformanceData: async () => {
        try {
            const [products, invoices] = await Promise.all([
                ProductService.getAllProducts(),
                InvoiceService.getAllInvoices()
            ]);

            const productPerformanceMap = new Map();

            products.forEach(product => {
                if (product.id) {
                    productPerformanceMap.set(product.id, {
                        id: product.id,
                        name: product.name,
                        salesVolume: 0,
                        profitMargin: 0,
                        revenue: 0,
                        category: product.category
                    });
                }
            });

            invoices.forEach(invoice => {
                invoice.items.forEach(item => {
                    if (item.product && item.product.id) {
                        const performance = productPerformanceMap.get(item.product.id);
                        if (performance) {
                            const itemRevenue = item.quantity * item.product.price * (1 - (item.discount || 0) / 100);
                            const estimatedCost = item.product.price * 0.6;
                            const profit = item.product.price - estimatedCost;
                            const profitMargin = (profit / item.product.price) * 100;

                            performance.salesVolume += item.quantity;
                            performance.revenue += itemRevenue;
                            performance.profitMargin = profitMargin;
                        }
                    }
                });
            });

            return Array.from(productPerformanceMap.values());
        } catch (error) {
            console.error('Error fetching product performance data:', error);
            return [];
        }
    }
};

export default ProductService;
