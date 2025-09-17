/**
 * sampleTickets.js
 * 
 * DEMO DATA SYSTEM: Sample Ticket Management
 * 
 * PURPOSE:
 * - Provides realistic sample data for development and demo environments
 * - Enables full application testing without backend API dependency
 * - Demonstrates complete ticket lifecycle with various statuses and scenarios
 * - Supports localStorage persistence for session continuity
 * 
 * ARCHITECTURE:
 * - Static sample data with diverse ticket types and statuses
 * - localStorage integration for persistent demo state
 * - Fallback system when backend API is unavailable
 * - Integration with TicketService for seamless development experience
 * 
 * TICKET TYPES INCLUDED:
 * - Closed tickets (completed customer issues)
 * - Resolved tickets (pending customer confirmation) 
 * - In-progress tickets (actively being worked on)
 * - New tickets (awaiting assignment)
 * - Various priorities: LOW, MEDIUM, HIGH, URGENT
 * - Multiple sources: Chatbot, Manual, Email, Phone
 * - Different categories: Login, Payment, Technical, General Support
 * 
 * USAGE:
 * - TicketService.getAllTickets() falls back to this data
 * - Components use this for filtering and display testing
 * - New tickets created via chatbot are added to this collection
 * - Provides realistic data for UI/UX development and testing
 */

// SAMPLE TICKET COLLECTION - Comprehensive test data covering all scenarios
const sampleTickets = [
  // CLOSED TICKET EXAMPLE - Complete lifecycle with resolution
  {
    id: 'TCK-1726419876543',
    subject: 'Login Issues - Unable to Access Account',
    description: 'Customer experiencing authentication problems after password reset. Tried multiple browsers and cleared cache. Issue persisted for 3 days.',
    status: 'CLOSED',                    // Final status - fully resolved
    priority: 'HIGH',                    // Important customer issue
    category: 'Login Issues',            // Categorization for routing/analytics
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    source: 'Chatbot',                   // Created via chatbot interaction
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    closedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    employeeName: 'Sarah Johnson',       // Assigned employee who resolved it
    resolution: 'Password reset completed and 2FA enabled for enhanced security.'
  },
  // PAYMENT ISSUE EXAMPLE - Different category and source
  {
    id: 'TCK-1726419876544',
    subject: 'Payment Problems - Transaction Failed',
    description: 'Credit card payment failed during checkout. Customer tried multiple cards and payment methods. Error code: CC_001',
    status: 'CLOSED',                    // Successfully resolved payment issue
    priority: 'MEDIUM',                  // Standard business priority
    category: 'Payment Problems',        // Financial/billing category
    customerName: 'Emily Davis',
    customerEmail: 'emily.davis@example.com',
    source: 'Manual',                    // Created manually by employee
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
  if (tickets) {
    try {
      const parsedTickets = JSON.parse(tickets);
      console.log('📋 Retrieved tickets from localStorage:', parsedTickets.length, 'tickets');
      return parsedTickets;
    } catch (error) {
      console.error('Error parsing tickets from localStorage:', error);
      return sampleTickets;
    }
  }
  console.log('📋 No localStorage tickets found, using sample tickets');
  return sampleTickets;
};

export default sampleTickets;