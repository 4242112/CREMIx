// Temporary sample data for testing closed tickets
const sampleTickets = [
  {
    id: 'TCK-1726419876543',
    subject: 'Login Issues - Unable to Access Account',
    description: 'Customer experiencing authentication problems after password reset. Tried multiple browsers and cleared cache. Issue persisted for 3 days.',
    status: 'CLOSED',
    priority: 'HIGH',
    category: 'Login Issues',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    source: 'Chatbot',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    employeeName: 'Sarah Johnson',
    resolution: 'Password reset completed and 2FA enabled for enhanced security.'
  },
  {
    id: 'TCK-1726419876544',
    subject: 'Payment Problems - Transaction Failed',
    description: 'Credit card payment failed during checkout. Customer tried multiple cards and payment methods. Error code: CC_001',
    status: 'CLOSED', 
    priority: 'MEDIUM',
    category: 'Payment Problems',
    customerName: 'Emily Davis',
    customerEmail: 'emily.davis@example.com',
    source: 'Manual',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    employeeName: 'Mike Wilson',
    resolution: 'Payment gateway configuration updated. Customer successfully completed payment.'
  },
  {
    id: 'TCK-1726419876545',
    subject: 'Account Settings - Profile Update Request',
    description: 'Customer wants to update email address and notification preferences. Current email bouncing.',
    status: 'RESOLVED',
    priority: 'LOW', 
    category: 'Account Settings',
    customerName: 'Alex Rodriguez',
    customerEmail: 'alex.rodriguez@example.com',
    source: 'Chatbot',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    employeeName: 'Lisa Chen',
    resolution: 'Email address updated and notification preferences configured.'
  },
  {
    id: 'TCK-1726419876546',
    subject: 'Technical Support - App Crashes on Startup',
    description: 'Mobile app crashes immediately on startup after latest update. Affects Android version 12+.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    category: 'Technical Support', 
    customerName: 'Robert Kim',
    customerEmail: 'robert.kim@example.com',
    source: 'Manual',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    employeeName: 'David Park'
  },
  {
    id: 'TCK-1726419876547',
    subject: 'General Support - Feature Request',
    description: 'Customer requesting dark mode theme option for better accessibility during night usage.',
    status: 'NEW',
    priority: 'LOW',
    category: 'General Support',
    customerName: 'Maria Garcia',
    customerEmail: 'maria.garcia@example.com', 
    source: 'Chatbot',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'TCK-1726419876548',
    subject: 'Billing Inquiry - Refund Request',
    description: 'Customer requesting refund for duplicate charge. Transaction IDs: TXN001, TXN002',
    status: 'CLOSED',
    priority: 'MEDIUM',
    category: 'Payment Problems',
    customerName: 'James Wilson',
    customerEmail: 'james.wilson@example.com',
    source: 'Manual', 
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    employeeName: 'Jennifer Lee',
    resolution: 'Duplicate charge identified and refund processed. Customer notified via email.'
  }
];

// Store sample data in localStorage for demo purposes
export const initializeSampleTickets = () => {
  const existingTickets = localStorage.getItem('demoTickets');
  if (!existingTickets) {
    localStorage.setItem('demoTickets', JSON.stringify(sampleTickets));
    console.log('✅ Sample tickets initialized for demo');
  }
};

// Get tickets from localStorage (demo mode)
export const getDemoTickets = () => {
  const tickets = localStorage.getItem('demoTickets');
  return tickets ? JSON.parse(tickets) : sampleTickets;
};

export default sampleTickets;