import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OpportunityService from "../../services/OpportunityService";

import EditOpportunity from "./Buttons/Edit";
import ProfileButton from "./OpportunityNavigation/OpportunityNavButtons/Profile/ProfileButton";
import NotesButton from "./OpportunityNavigation/Notes/Notes";
import OpportunityNavigation from "./OpportunityNavigation/OpportunityNavigation";
import CallsButton from "./OpportunityNavigation/OpportunityNavButtons/CallLog/CallsLog";
import QuotationPage from "./OpportunityNavigation/OpportunityNavButtons/Quotation/QuotationPage";

const OpportunityViewDetails = ({
  opportunity: propOpportunity,
  EditComponent = EditOpportunity,
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [opportunity, setOpportunity] = useState(propOpportunity || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [showEditForm, setShowEditForm] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && !propOpportunity) {
      setLoading(true);
      OpportunityService.getOpportunityById(Number(id))
        .then((data) => {
          setOpportunity(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching Opportunity:", err);
          setError("Failed to load Opportunity details");
          setLoading(false);
        });
    }
  }, [id, propOpportunity]);

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleBack = () => navigate("/opportunity/manage");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚠️</span>
          <div>
            <h5 className="font-semibold">Error</h5>
            <p className="mb-0">{error}</p>
          </div>
        </div>
        <div className="mt-3">
          <button
            onClick={handleBack}
            className="px-4 py-2 border rounded hover:bg-blue-50 text-blue-600"
          >
            Go Back to Opportunity
          </button>
        </div>
      </div>
    );
  }

  if (!opportunity) return null;

  const handleEditClick = () => {
    setShowEditForm(true);
    setMessage(null);
    setError(null);
  };

  const handleCloseEditForm = () => setShowEditForm(false);

  const handleUpdateOpportunity = async (data) => {
    setMessage(null);
    setError(null);
    try {
      const updatedOpportunity = await OpportunityService.updateOpportunity(
        data.id,
        data
      );
      setMessage("Opportunity updated successfully!");
      setShowEditForm(false);
      setOpportunity(updatedOpportunity);
    } catch (err) {
      console.error("Update error:", err);
      setError("Error updating Opportunity. Please try again.");
    }
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Opportunity Information</h4>
              <div className="flex space-x-2">
                <button
                  onClick={handleBack}
                  className="px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
                >
                  ← Back to Opportunities
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
            <ProfileButton opportunity={opportunity} />
          </>
        );
      case "notes":
        return <NotesButton opportunity={opportunity} />;
      case "calls":
        return <CallsButton opportunity={opportunity} />;
      case "quotation":
        return <QuotationPage opportunity={opportunity} />;
      default:
        return null;
    }
  };

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
            <h4 className="font-semibold">{opportunity.lead.name}</h4>
            <div className="mt-3 text-left text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">📞</span>
                <span>{opportunity.lead.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">✉️</span>
                <span>{opportunity.lead.email}</span>
              </div>
              {opportunity.lead.website && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">🌐</span>
                  <span>{opportunity.lead.website}</span>
                </div>
              )}
            </div>
          </div>

          <OpportunityNavigation
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
        onSave={handleUpdateOpportunity}
        opportunity={opportunity}
      />
    </div>
  );
};

export default OpportunityViewDetails;
