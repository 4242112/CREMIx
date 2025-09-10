import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ai-tickets';

class AITicketService {
  
  // Analyze ticket content for sentiment, urgency, and complexity
  static async analyzeTicket(ticketId) {
    try {
      const response = await axios.post(`${API_URL}/analyze/${ticketId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing ticket:', error);
      throw error;
    }
  }

  // Get AI-generated response suggestions for a ticket
  static async getResponseSuggestions(ticketId) {
    try {
      const response = await axios.get(`${API_URL}/suggestions/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting response suggestions:', error);
      throw error;
    }
  }

  // Generate a response draft with specified tone
  static async generateResponseDraft(ticketId, tone = 'professional') {
    try {
      const response = await axios.post(`${API_URL}/generate-response/${ticketId}`, {
        tone: tone
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.responseText;
    } catch (error) {
      console.error('Error generating response draft:', error);
      throw error;
    }
  }

  // Analyze ticket sentiment
  static async analyzeTicketSentiment(ticketContent) {
    try {
      const response = await axios.post(`${API_URL}/analyze-sentiment`, {
        content: ticketContent
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing ticket sentiment:', error);
      throw error;
    }
  }

  // Categorize ticket automatically
  static async categorizeTicket(ticketContent) {
    try {
      const response = await axios.post(`${API_URL}/categorize`, {
        content: ticketContent
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error categorizing ticket:', error);
      throw error;
    }
  }

  // Suggest priority level for ticket
  static async suggestPriority(ticketContent) {
    try {
      const response = await axios.post(`${API_URL}/suggest-priority`, {
        content: ticketContent
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error suggesting priority:', error);
      throw error;
    }
  }
}

export default AITicketService;
