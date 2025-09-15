import React, { useState, useEffect } from 'react';
import ModernDataTable from '../common/ModernDataTable';
import ModernForm from '../common/ModernForm';
import { Modal } from '../common/ui/Base.jsx';
import { Toast } from '../common/ui/Toast.jsx';
import { Spinner } from '../common/ui/Spinner.jsx';
import { Card } from '../common/ui/Base.jsx';
import LeadService, { LeadSource } from '../../services/LeadService';

const ModernLeadsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await LeadService.getAllLeads();
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to load leads');
      setToast({
        open: true,
        message: 'Failed to load leads. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove static sample data and use dynamic leads
  const leadsData = leads.map(lead => ({
    id: lead.id,
    name: lead.name || 'N/A',
    email: lead.email || 'N/A',
    phone: lead.phoneNumber || 'N/A',
    company: lead.company || 'N/A',
    status: lead.status || 'New',
    source: lead.source || LeadSource.UNKNOWN,
    createdAt: lead.createdAt || new Date().toISOString().split('T')[0]
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
      key: 'company',
      label: 'Company'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          'New': 'bg-blue-100 text-blue-800',
          'Contacted': 'bg-yellow-100 text-yellow-800',
          'Qualified': 'bg-green-100 text-green-800',
          'Proposal': 'bg-purple-100 text-purple-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'source',
      label: 'Source'
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const handleAddLead = async (formData) => {
    try {
      setLoading(true);
      
      // Map form data to API format
      const leadData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        company: formData.company,
        status: formData.status.toUpperCase(),
        source: formData.source.toUpperCase()
      };

      const newLead = await LeadService.createLead(leadData);
      
      if (newLead) {
        setShowAddForm(false);
        setToast({
          open: true,
          message: 'Lead created successfully!',
          type: 'success'
        });
        
        // Refresh the leads list
        await fetchLeads();
      } else {
        throw new Error('Failed to create lead');
      }
    } catch (err) {
      console.error('Error creating lead:', err);
      setToast({
        open: true,
        message: err.message || 'Failed to create lead. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      await LeadService.deleteLead(leadId);
      setToast({
        open: true,
        message: 'Lead deleted successfully!',
        type: 'success'
      });
      
      // Refresh the leads list
      await fetchLeads();
    } catch (err) {
      console.error('Error deleting lead:', err);
      setToast({
        open: true,
        message: 'Failed to delete lead. Please try again.',
        type: 'error'
      });
    }
    setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8 animate-slideUp">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Leads
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Manage and track your sales leads with modern tools</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="px-5 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Lead
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Leads</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{leads.length}</p>
                <p className="text-xs text-blue-600 mt-1">All active leads</p>
              </div>
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Qualified</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {leads.filter(lead => lead.status === 'Qualified').length}
                </p>
                <p className="text-xs text-green-600 mt-1">Ready for sales</p>
              </div>
              <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">New Leads</p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">
                  {leads.filter(lead => lead.status === 'New').length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Need attention</p>
              </div>
              <div className="p-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">This Month</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {leads.filter(lead => {
                    const leadDate = new Date(lead.createdAt || new Date());
                    const thisMonth = new Date();
                    return leadDate.getMonth() === thisMonth.getMonth() && 
                           leadDate.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </p>
                <p className="text-xs text-purple-600 mt-1">Recently added</p>
              </div>
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Error Loading Leads</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {loading && leads.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Spinner className="w-12 h-12 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Loading leads...</p>
              </div>
            </div>
          ) : (
            <ModernDataTable
              data={leadsData}
              columns={columns}
              title="All Leads"
              onEdit={(lead) => console.log('Edit lead:', lead)}
              onDelete={handleDeleteLead}
            />
          )}
        </div>

        {/* Add Lead Modal */}
        <Modal open={showAddForm} onClose={() => setShowAddForm(false)}>
          <ModernForm
            title="Add New Lead"
            onSubmit={handleAddLead}
            onCancel={() => setShowAddForm(false)}
          />
        </Modal>

        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          open={toast.open}
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
        />
      </div>
    </div>
  );
};

export default ModernLeadsPage;
