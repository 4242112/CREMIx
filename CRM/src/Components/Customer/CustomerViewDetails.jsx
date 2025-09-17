import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditCustomer from './Buttons/Edit';
import ProfileButton from './CustomerNavigation/Profile/ProfileButton';
import NotesButton from './CustomerNavigation/Notes/Notes';
import CallsButton from './CustomerNavigation/Calls/CallsButton';
import QuotationPage from './CustomerNavigation/Quotation/QuotationPage';
import CustomerNavigation from './CustomerNavigation/CustomerNavigation';
import CustomerService from '../../services/CustomerService';

const CustomerViewDetails = ({ customer: propCustomer, EditComponent = EditCustomer }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [customer, setCustomer] = useState(propCustomer || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && !propCustomer) {
      setLoading(true);
      CustomerService.getCustomerById(Number(id))
        .then((data) => {
          setCustomer(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load Customer details');
          setLoading(false);
        });
    }
  }, [id, propCustomer]);

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleBack = () => navigate('/customer/manage');
  const handleEditClick = () => {
    setShowEditForm(true);
    setMessage(null);
    setError(null);
  };
  const handleCloseEditForm = () => setShowEditForm(false);

  const handleUpdateCustomer = async (data) => {
    setMessage(null);
    setError(null);
    try {
      if (data.id) {
        await CustomerService.updateCustomer(data.id, data);
        setMessage('Customer updated successfully!');
        setShowEditForm(false);
        setCustomer(data);
      }
    } catch (err) {
      console.error(err);
      setError('Error updating Customer. Please try again.');
    }
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Customer Information</h4>
              <div className="flex space-x-2">
                <button
                  onClick={handleBack}
                  className="px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
                >
                  ← Back to Customers
                </button>
                <button
                  onClick={handleEditClick}
                  className="px-3 py-1 text-sm border rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 p-2 mb-3 rounded">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-2 mb-3 rounded">
                {error}
              </div>
            )}

            <ProfileButton customer={customer} />
          </>
        );
      case 'notes':
        return <NotesButton customer={customer} />;
      case 'calls':
        return <CallsButton customer={customer} />;
      case 'quotation':
        return <QuotationPage customer={customer} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <div className="flex items-center gap-2">
          ⚠️
          <div>
            <h5 className="font-semibold">Error</h5>
            <p>{error}</p>
          </div>
        </div>
        <div className="mt-3">
          <button
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={handleBack}
          >
            Go Back to Customer
          </button>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <div className="mb-3">
              <div className="rounded-full bg-gray-100 flex items-center justify-center w-24 h-24 mx-auto">
                <span className="text-5xl text-blue-600">👤</span>
              </div>
            </div>
            <h4 className="font-semibold">{customer.name}</h4>
            <div className="mt-3 text-left text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">📞</span>
                <span>{customer.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">✉️</span>
                <span>{customer.email}</span>
              </div>
              {customer.website && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">🌐</span>
                  <span>{customer.website}</span>
                </div>
              )}
            </div>
          </div>

          <CustomerNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">{renderActiveContent()}</div>
      </div>

      {/* Edit Modal */}
      <EditComponent
        show={showEditForm}
        onClose={handleCloseEditForm}
        onSave={handleUpdateCustomer}
        customer={customer}
      />
    </div>
  );
};

export default CustomerViewDetails;
