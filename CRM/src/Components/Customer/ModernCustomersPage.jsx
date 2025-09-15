import React, { useState, useEffect } from 'react';
import ModernDataTable from '../common/ModernDataTable';
import { Modal } from '../common/ui/Base.jsx';
import { Toast } from '../common/ui/Toast.jsx';
import { Spinner } from '../common/ui/Spinner.jsx';
import { Card } from '../common/ui/Base.jsx';
import CustomerService from '../../services/CustomerService';

const ModernCustomersPage = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CustomerService.getAllCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Failed to load customers');
      setToast({
        open: true,
        message: 'Failed to load customers. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await CustomerService.deleteCustomer(customerId);
      setToast({
        open: true,
        message: 'Customer deleted successfully!',
        type: 'success'
      });
      
      // Refresh the customers list
      await fetchCustomers();
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    } catch (err) {
      console.error('Error deleting customer:', err);
      setToast({
        open: true,
        message: 'Failed to delete customer. Please try again.',
        type: 'error'
      });
    }
    setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
  };

  const confirmDelete = (customerId) => {
    setCustomerToDelete(customerId);
    setShowDeleteModal(true);
  };

  // Transform customers data for the table
  const customersData = customers.map(customer => ({
    id: customer.id,
    name: customer.name || 'N/A',
    email: customer.email || 'N/A',
    phone: customer.phoneNumber || 'N/A',
    address: customer.address || 'N/A',
    city: customer.city || 'N/A',
    type: customer.type || 'Individual',
    hasPassword: customer.hasPassword ? 'Yes' : 'No',
    createdAt: customer.createdAt || new Date().toISOString().split('T')[0]
  }));

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-muted">{row.email}</div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone'
    },
    {
      key: 'address',
      label: 'Address',
      render: (value, row) => (
        <div>
          <div className="text-sm">{value}</div>
          {row.city && <div className="text-xs text-muted">{row.city}</div>}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => {
        const colors = {
          'Individual': 'bg-blue-100 text-blue-800',
          'Business': 'bg-green-100 text-green-800',
          'Corporate': 'bg-purple-100 text-purple-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'hasPassword',
      label: 'Portal Access',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-muted mt-1">Manage your customer database</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCustomers}
            disabled={loading}
            className="px-4 py-2 border border-border rounded-2xl hover:bg-background transition-colors disabled:opacity-50"
          >
            {loading ? <Spinner className="w-4 h-4" /> : 'Refresh'}
          </button>
          <button className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary-light transition-colors font-medium">
            Add New Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50">
              <span className="text-blue-600">👥</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Portal Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {customers.filter(c => c.hasPassword).length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-green-50">
              <span className="text-green-600">🔐</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Business Accounts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {customers.filter(c => c.type === 'Business' || c.type === 'Corporate').length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50">
              <span className="text-purple-600">🏢</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span>⚠️</span>
            <div>
              <p className="font-medium">Error Loading Customers</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && customers.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Spinner className="w-8 h-8" />
        </div>
      ) : (
        /* Data Table */
        <ModernDataTable
          data={customersData}
          columns={columns}
          title="All Customers"
          onEdit={(customer) => console.log('Edit customer:', customer)}
          onDelete={confirmDelete}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Customer</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete this customer? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-border rounded-2xl hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteCustomer(customerToDelete)}
              className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        open={toast.open}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default ModernCustomersPage;
