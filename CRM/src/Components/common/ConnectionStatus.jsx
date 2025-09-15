import React, { useState, useEffect } from 'react';
import { checkAPIHealth } from '../../services/apiClient';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const healthy = await checkAPIHealth();
        setApiStatus(healthy ? 'connected' : 'disconnected');
      } catch {
        setApiStatus('disconnected');
      }
    };

    // Check immediately
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && apiStatus === 'connected') {
    return null; // Don't show anything when everything is working
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`px-4 py-2 rounded-2xl shadow-card text-sm font-medium ${
        !isOnline 
          ? 'bg-red-600 text-white' 
          : apiStatus === 'disconnected'
          ? 'bg-yellow-600 text-white'
          : 'bg-blue-600 text-white'
      }`}>
        {!isOnline 
          ? '🔴 No Internet Connection' 
          : apiStatus === 'disconnected'
          ? '🟡 Backend Server Offline'
          : '🔵 Checking Connection...'
        }
      </div>
    </div>
  );
};

export default ConnectionStatus;
