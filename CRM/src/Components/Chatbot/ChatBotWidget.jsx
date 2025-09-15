import React, { useState } from 'react';

const ChatBotWidget = ({ onOpenChat, unreadCount = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onOpenChat}
          onMouseEnter={() => {
            setIsHovered(true);
            setShowTooltip(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setShowTooltip(false);
          }}
          className={`relative bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform transition-all duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          } hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300`}
        >
          {/* Chat Icon */}
          <div className="relative">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            
            {/* Notification Badge */}
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>

          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></div>
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 transform translate-x-0">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Need help? Chat with our assistant!
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>

      {/* Welcome Message (shows briefly when page loads) */}
      <ChatWelcomeMessage />
    </>
  );
};

const ChatWelcomeMessage = () => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    // Show welcome message after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-30 max-w-sm">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-slide-in-bottom">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              🤖
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">
              👋 Hi! I'm here to help you with any questions or issues. Click the chat button to get started!
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="absolute bottom-0 right-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white transform translate-y-full"></div>
      </div>
    </div>
  );
};

export default ChatBotWidget;