// LeadViewDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeadNavigation from './LeadNavigation/LeadNavigation';
import ProfileButton from './LeadNavigation/LeadNavButtons/Profile/ProfileButton';
import CallsButton from './LeadNavigation/LeadNavButtons/CallLog/CallsLog';
import NotesButton from './LeadNavigation/LeadNavButtons/Notes/Notes';
import EditLeads from './Buttons/Edit';
import LeadService from '../../services/LeadService';

const LeadViewDetails = ({ lead: propLead, EditComponent : EditLeads }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [lead, setLead] = useState(propLead || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && !propLead) {
      setLoading(true);
      LeadService.getLeadById(id)
        .then(data => {
          setLead(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching lead:', err);
          setError('Failed to load lead details');
          setLoading(false);
        });
    }
  }, [id, propLead]);

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleBack = () => navigate('/leads/manage');
  const handleEditClick = () => {
    setShowEditForm(true);
    setMessage(null);
    setError(null);
  };
  const handleCloseEditForm = () => setShowEditForm(false);

  const handleUpdateLead = async (data) => {
    setMessage(null);
    setError(null);
    try {
      const updatedLead = await LeadService.updateLead(data.id, data);
      setMessage("Lead updated successfully!");
      setShowEditForm(false);
      setLead(updatedLead);
    } catch (err) {
      console.error("Update error:", err);
      setError("Error updating lead. Please try again.");
    }
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h4 className="mb-0 text-gray-800 font-semibold">Lead Information</h4>
              <div className="flex gap-2">
                <button
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                  onClick={handleBack}
                >
                  ← Back to Leads
                </button>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={handleEditClick}
                >
                  ✎ Edit
                </button>
              </div>
            </div>
            {message && <div className="bg-green-100 text-green-800 p-2 mb-3 rounded">{message}</div>}
            {error && <div className="bg-red-100 text-red-800 p-2 mb-3 rounded">{error}</div>}
            <ProfileButton lead={lead} />
          </>
        );
      case 'calls':
        return <CallsButton lead={lead} />;
      case 'notes':
        return <NotesButton lead={lead} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="border-4 border-blue-600 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded">
        <div className="flex items-center gap-2">
          <span>⚠️</span>
          <div>
            <h5 className="font-semibold text-red-700">Error</h5>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
        <div className="mt-3">
          <button
            className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
            onClick={handleBack}
          >
            Go Back to Leads
          </button>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="md:w-1/3 flex flex-col items-center gap-4">
          <div className="bg-gray-100 border border-gray-200 rounded-2xl w-full max-w-xs p-6 text-center shadow-sm">
            <div className="mb-4 flex justify-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex justify-center items-center text-blue-600 text-3xl">
                👤
              </div>
            </div>
            <h4 className="mb-4 font-semibold text-gray-800">{lead.name}</h4>
            <div className="text-left space-y-3">
              <div className="flex items-center gap-3">
                <span>📞</span> <span className="text-gray-700">{lead.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>✉️</span> <span className="text-gray-700 break-words">{lead.email}</span>
              </div>
              {lead.website && (
                <div className="flex items-center gap-3">
                  <span>🌐</span> <span className="text-gray-700 break-words">{lead.website}</span>
                </div>
              )}
            </div>
          </div>
          <LeadNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Main content */}
        <div className="md:w-2/3">
          {renderActiveContent()}
        </div>
      </div>

      <EditComponent
        show={showEditForm}
        onClose={handleCloseEditForm}
        onSave={handleUpdateLead}
        lead={lead}
      />
    </div>
  );
};

export default LeadViewDetails;
