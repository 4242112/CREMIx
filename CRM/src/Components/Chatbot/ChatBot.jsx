import React, { useState, useRef, useEffect } from 'react';
import ChatBotService from '../../services/ChatBotService';
import OpenAIService from '../../services/OpenAIService';
// import TicketService from '../../services/TicketService'; // Disabled for demo - using simulated API

const ChatBot = ({ isOpen, onClose, onCreateTicket, currentUser }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "👋 Hi! I'm your virtual assistant. I'm here to help you resolve issues quickly. What can I help you with today?",
      timestamp: new Date(),
      options: [
        "Login Issues",
        "Payment Problems", 
        "Account Settings",
        "Technical Support",
        "Other Issue"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    category: null,
    issue: null,
    attempts: 0,
    escalationReady: false
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (message, type = 'user', options = null) => {
    const newMessage = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date(),
      options
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const simulateTyping = async (delay = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
  };

  const detectTicketCreationRequest = (message) => {
    const ticketKeywords = [
      'create ticket', 'create a ticket', 'make ticket', 'make a ticket',
      'submit ticket', 'file ticket', 'open ticket', 'raise ticket',
      'need ticket', 'want ticket', 'ticket please', 'escalate',
      'speak to human', 'talk to human', 'human help', 'representative'
    ];
    
    const normalizedMessage = message.toLowerCase().trim();
    return ticketKeywords.some(keyword => normalizedMessage.includes(keyword));
  };

  const createAutomaticTicket = async (userMessage) => {
    try {
      setIsCreatingTicket(true);
      
      // Add message showing ticket creation is in progress
      addMessage("🎫 I understand you'd like to create a ticket. Let me analyze our conversation and create one for you...", 'bot');
      
      await simulateTyping(2000);
      
      // Analyze conversation history
      console.log('Starting ticket analysis...', { messages, conversationContext });
      const ticketAnalysis = await OpenAIService.analyzeConversationForTicket(messages, {
        category: conversationContext.category,
        issue: conversationContext.issue,
        currentMessage: userMessage
      });
      
      console.log('Ticket analysis completed:', ticketAnalysis);
      
      // Create ticket using TicketService
      const ticketData = {
        subject: ticketAnalysis.subject,
        description: ticketAnalysis.description,
        priority: ticketAnalysis.priority,
        category: ticketAnalysis.category,
        customerName: currentUser?.name || 'Customer',
        customerEmail: currentUser?.email || 'customer@example.com',
        source: 'Chatbot',
        status: 'OPEN',
        conversationHistory: messages.map(msg => ({
          type: msg.type,
          message: msg.message,
          timestamp: msg.timestamp
        })),
        aiAnalysis: {
          sentiment: ticketAnalysis.customerSentiment,
          urgency: ticketAnalysis.urgencyLevel,
          suggestedSolution: ticketAnalysis.suggestedSolution,
          tags: ticketAnalysis.tags,
          confidence: ticketAnalysis.confidence
        }
      };
      
      // Simulate ticket creation (replace with actual API call)
      const ticketResult = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            ticketId: `TCK-${Date.now()}`,
            ticketNumber: Math.floor(Math.random() * 10000) + 1000
          });
        }, 1500);
      });
      
      if (ticketResult.success) {
        addMessage(
          `✅ Ticket created successfully!\n\n📋 **Ticket Details:**\n• **ID:** ${ticketResult.ticketId}\n• **Subject:** ${ticketAnalysis.subject}\n• **Priority:** ${ticketAnalysis.priority}\n• **Category:** ${ticketAnalysis.category}\n\n🎯 **AI Analysis:**\n• **Issue Type:** ${ticketAnalysis.category}\n• **Urgency:** ${ticketAnalysis.urgencyLevel}\n• **Sentiment:** ${ticketAnalysis.customerSentiment}\n\n📞 Our support team will review your ticket and get back to you soon. You can track the progress in your dashboard.`,
          'bot',
          ['Create Another Ticket', 'End Chat', 'Start New Issue']
        );
        
        // Update context to show ticket was created
        setConversationContext(prev => ({
          ...prev,
          ticketCreated: true,
          ticketId: ticketResult.ticketId
        }));
      } else {
        addMessage(
          "❌ Sorry, I encountered an issue creating your ticket. Please try again or use the manual ticket creation option.",
          'bot',
          ['Try Again', 'Manual Ticket', 'Contact Support']
        );
      }
      
    } catch (error) {
      console.error('Auto ticket creation error:', error);
      addMessage(
        `⚠️ I encountered an error while creating your ticket: ${error.message || 'Unknown error'}. Let me connect you with our manual ticket creation form.`,
        'bot',
        ['Manual Ticket', 'Try Again', 'Contact Support']
      );
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    
    // Add user message
    addMessage(userMessage, 'user');

    // Check if user wants to create a ticket
    if (detectTicketCreationRequest(userMessage)) {
      await createAutomaticTicket(userMessage);
      return;
    }

    // Simulate typing
    await simulateTyping();

    // Get bot response with conversation history
    const response = await ChatBotService.processMessage(
      userMessage, 
      conversationContext, 
      messages
    );
    
    // Update conversation context
    setConversationContext(response.context);

    // Add bot response
    addMessage(response.message, 'bot', response.options);

    // Handle issue resolution
    if (response.isResolved) {
      // Add celebration message and resolved status
      setTimeout(() => {
        addMessage(
          "✅ ISSUE RESOLVED! Your issue has been successfully resolved and marked in our system. Thank you for using our support chat!",
          'bot',
          ['Start New Issue', 'End Chat']
        );
      }, 1500);
    }
    // Check if escalation is needed
    else if (response.context.escalationReady) {
      setTimeout(() => {
        addMessage(
          "🎫 It seems like this issue needs personal attention. Would you like me to create a support ticket for you?",
          'bot',
          ['Yes, Create Ticket', 'No, Continue Chatting']
        );
      }, 1500);
    }
  };

  const handleOptionClick = async (option) => {
    // Add user selection as message
    addMessage(option, 'user');

    // Handle automatic ticket creation options
    if (option === 'Create Another Ticket') {
      addMessage("I'd be happy to help you create another ticket. Please describe the new issue you're experiencing.", 'bot');
      return;
    }

    if (option === 'Try Again') {
      await createAutomaticTicket("create ticket");
      return;
    }

    if (option === 'Manual Ticket') {
      handleCreateTicket();
      return;
    }

    if (option === 'Contact Support') {
      addMessage(
        "📞 **Contact Support Directly:**\n\n• **Phone:** 1-800-SUPPORT\n• **Email:** support@company.com\n• **Live Chat:** Available 24/7\n\nOur support team is ready to assist you!",
        'bot',
        ['Create Ticket', 'End Chat']
      );
      return;
    }

    // Simulate typing
    await simulateTyping();

    if (option === 'Yes, Create Ticket') {
      handleCreateTicket();
      return;
    }

    if (option === 'No, Continue Chatting') {
      addMessage(
        "No problem! I'm still here to help. What else can I assist you with?",
        'bot',
        [
          "Login Issues",
          "Payment Problems", 
          "Account Settings",
          "Technical Support",
          "Other Issue"
        ]
      );
      setConversationContext({
        category: null,
        issue: null,
        attempts: 0,
        escalationReady: false
      });
      return;
    }

    // Process option selection with conversation history
    const response = await ChatBotService.processOption(
      option, 
      conversationContext, 
      messages
    );
    setConversationContext(response.context);
    addMessage(response.message, 'bot', response.options);

    // Handle resolution
    if (response.isResolved) {
      setTimeout(() => {
        addMessage(
          "🎉✅ Excellent! Your issue has been successfully resolved and recorded in our system. Is there anything else I can help you with?",
          'bot',
          ['Yes, another issue', 'No, all good']
        );
      }, 1500);
    }
  };

  const handleCreateTicket = () => {
    const conversationSummary = messages
      .filter(msg => msg.type === 'user')
      .map(msg => msg.message)
      .join('\n');

    const ticketData = {
      category: conversationContext.category,
      issue: conversationContext.issue,
      conversationSummary,
      customerMessage: `Customer Issue: ${conversationContext.category}\n\nConversation Summary:\n${conversationSummary}`
    };

    if (onCreateTicket) {
      onCreateTicket(ticketData);
    }

    addMessage(
      "✅ Perfect! I've prepared a support ticket for you. Please fill out the form to submit your request.",
      'bot'
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              🤖
            </div>
            <div>
              <h3 className="font-semibold">Virtual Assistant</h3>
              <p className="text-sm text-blue-100">Online • Ready to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : message.message.includes('ISSUE RESOLVED') || message.message.includes('✅')
                    ? 'bg-green-100 text-green-800 shadow-md rounded-bl-none border border-green-300'
                    : 'bg-white text-gray-800 shadow-md rounded-bl-none border'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  
                  {/* Options */}
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left px-3 py-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-75 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {(isTyping || isCreatingTicket) && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md rounded-lg rounded-bl-none border px-4 py-2">
                  {isCreatingTicket ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-blue-600">Creating ticket...</span>
                    </div>
                  ) : (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isTyping || isCreatingTicket}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || isCreatingTicket}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send</span>
            <span>{currentUser?.name || 'Guest'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;