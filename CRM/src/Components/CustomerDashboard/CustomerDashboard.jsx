import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomerType } from "../../services/CustomerService";
import CustomerQuotation from "./CustomerQuotation";
import CustomerTickets from "./CustomerTickets";
import CustomerInvoices from "./CustomerInvoices";
import CustomerProductCatalog from "./CustomerProductCatalog";
import ChatBot from "../Chatbot/ChatBot";
import ChatBotWidget from "../Chatbot/ChatBotWidget";
import ChatBotTicketModal from "../Chatbot/ChatBotTicketModal";

const CustomerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab") || "quotations";

  const [activeTab, setActiveTab] = useState(tabParam);
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [chatBotTicketData, setChatBotTicketData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab") || "quotations";
    setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    if (customerId && customerName && customerEmail) {
      setCustomerData({
        id: customerId,
        name: customerName,
        email: customerEmail,
        phoneNumber: "",
        type: CustomerType.NEW,
        hasPassword: true,
      });
    }
  }, [customerId, customerName, customerEmail]);

  useEffect(() => {
    const checkAuth = () => {
      const authString = localStorage.getItem("customerAuth");

      if (!authString) {
        setError("You are not logged in. Please login to continue.");
        setIsLoading(false);
        return;
      }

      try {
        const authData = JSON.parse(authString);

        if (!authData.isAuthenticated) {
          setError("Session expired. Please login again.");
          setIsLoading(false);
          return;
        }

        setCustomerId(authData.customerId);
        setCustomerName(authData.customerName);
        setCustomerEmail(authData.email);

        setIsLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        setError("Authentication error. Please login again.");
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleOpenChat = () => {
    setChatBotOpen(true);
  };

  const handleCloseChat = () => {
    setChatBotOpen(false);
  };

  const handleCreateTicket = (ticketData) => {
    setChatBotTicketData(ticketData);
    setTicketModalOpen(true);
  };

  const handleTicketModalClose = () => {
    setTicketModalOpen(false);
    setChatBotTicketData({});
  };

  const handleTicketSuccess = (message) => {
    setSuccessMessage(message);
    setTicketModalOpen(false);
    setChatBotOpen(false);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const renderTabContent = () => {
    if (!customerId) return null;

    switch (activeTab) {
      case "quotations":
      case "quotation":
        return <CustomerQuotation customerId={customerId} customerEmail={customerEmail} />;
      case "tickets":
        return <CustomerTickets customerId={customerId} customerEmail={customerEmail} />;
      case "invoices":
      case "invoice":
        return (
          <CustomerInvoices
            customerId={customerId}
            customerEmail={customerEmail}
            customerData={customerData}
          />
        );
      case "products":
        return <CustomerProductCatalog customerId={customerId} customerEmail={customerEmail} />;
      default:
        return (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded">
            Unknown tab selected: "{activeTab}"
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 max-w-2xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded relative">
          <strong className="font-bold">Authentication Error</strong>
          <p className="mt-2">{error}</p>
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage('')}
          >
            <span className="sr-only">Dismiss</span>
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-800 text-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold">Customer Portal - {customerName}</h2>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-4">
        {renderTabContent()}
      </div>

      {/* Chatbot Widget */}
      <ChatBotWidget onOpenChat={handleOpenChat} />

      {/* Chatbot Modal */}
      <ChatBot
        isOpen={chatBotOpen}
        onClose={handleCloseChat}
        onCreateTicket={handleCreateTicket}
        currentUser={{
          id: customerId,
          userId: customerId,
          name: customerName,
          email: customerEmail
        }}
      />

      {/* Ticket Creation Modal */}
      <ChatBotTicketModal
        isOpen={ticketModalOpen}
        onClose={handleTicketModalClose}
        chatbotData={chatBotTicketData}
        currentUser={{
          id: customerId,
          userId: customerId,
          name: customerName,
          email: customerEmail
        }}
        onSuccess={handleTicketSuccess}
      />
    </div>
  );
};

export default CustomerDashboard;
