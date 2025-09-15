// OpenAI Service for intelligent chatbot responses
class OpenAIService {
  static API_KEY = import.meta.env?.VITE_OPENAI_API_KEY || 'your-openai-api-key-here';
  static API_URL = 'https://api.openai.com/v1/chat/completions';

  static async getIntelligentResponse(userMessage, conversationHistory = [], context = {}) {
    try {
      // If no API key is available, fall back to rule-based responses
      if (!this.API_KEY || this.API_KEY === 'your-openai-api-key-here') {
        console.warn('OpenAI API key not configured, using fallback responses');
        return this.getFallbackResponse(userMessage, context);
      }

      const systemPrompt = this.buildSystemPrompt(context);
      const messages = this.buildMessageHistory(systemPrompt, conversationHistory, userMessage);

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

      // Analyze if the response indicates resolution
      const isResolved = this.analyzeResolutionStatus(aiResponse, userMessage);

      return {
        message: aiResponse,
        isResolved: isResolved,
        confidence: this.calculateConfidence(aiResponse),
        suggestedActions: this.extractSuggestedActions(aiResponse)
      };

    } catch (error) {
      console.error('OpenAI Service Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  static buildSystemPrompt(context) {
    return `You are a helpful customer support chatbot for a CRM system. Your role is to:

1. Help customers resolve technical issues quickly and efficiently
2. Provide clear, step-by-step solutions
3. Be friendly, professional, and empathetic
4. Identify when an issue is successfully resolved
5. Escalate to human support when necessary

IMPORTANT GUIDELINES:
- Always provide specific, actionable solutions
- Ask clarifying questions when needed
- Confirm when an issue is resolved by saying "ISSUE_RESOLVED" at the end
- If you can't solve the issue after 2-3 attempts, suggest creating a support ticket
- Keep responses concise but helpful (under 200 words)

Current context:
- Customer issue category: ${context.category || 'General Support'}
- Previous attempts: ${context.attempts || 0}
- Issue type: ${context.issue || 'Not specified'}

Common issue categories and solutions:
1. LOGIN ISSUES: Password reset, account locks, browser cache clearing
2. PAYMENT PROBLEMS: Payment failures, billing questions, refund requests
3. ACCOUNT SETTINGS: Profile updates, security settings, account management
4. TECHNICAL SUPPORT: Website errors, performance issues, feature problems

Respond in a helpful, professional tone and provide specific solutions.`;
  }

  static buildMessageHistory(systemPrompt, conversationHistory, currentMessage) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (last 10 messages to stay within token limits)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.message
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: currentMessage
    });

    return messages;
  }

  static analyzeResolutionStatus(aiResponse, userMessage) {
    const resolutionIndicators = [
      'ISSUE_RESOLVED',
      'problem solved',
      'issue resolved',
      'working now',
      'fixed',
      'solved',
      'success'
    ];

    const userPositiveIndicators = [
      'thank you',
      'thanks',
      'it works',
      'working now',
      'fixed',
      'solved',
      'yes, it worked',
      'that helped',
      'problem solved'
    ];

    const aiResponse_lower = aiResponse.toLowerCase();
    const userMessage_lower = userMessage.toLowerCase();

    // Check if AI explicitly marked as resolved
    const aiResolved = resolutionIndicators.some(indicator => 
      aiResponse_lower.includes(indicator.toLowerCase())
    );

    // Check if user confirmed resolution
    const userConfirmed = userPositiveIndicators.some(indicator => 
      userMessage_lower.includes(indicator.toLowerCase())
    );

    return aiResolved || userConfirmed;
  }

  static calculateConfidence(response) {
    // Simple confidence calculation based on response quality
    const response_lower = response.toLowerCase();
    let confidence = 0.5; // Base confidence

    // Increase confidence for specific solutions
    if (response_lower.includes('step') || response_lower.includes('follow')) confidence += 0.2;
    if (response_lower.includes('try') || response_lower.includes('check')) confidence += 0.1;
    if (response_lower.includes('should') || response_lower.includes('will')) confidence += 0.1;
    
    // Decrease confidence for uncertain language
    if (response_lower.includes('might') || response_lower.includes('maybe')) confidence -= 0.1;
    if (response_lower.includes('not sure') || response_lower.includes('unclear')) confidence -= 0.2;

    return Math.min(Math.max(confidence, 0), 1); // Clamp between 0 and 1
  }

  static extractSuggestedActions(response) {
    const actions = [];
    const response_lower = response.toLowerCase();

    // Extract common action suggestions
    if (response_lower.includes('refresh') || response_lower.includes('reload')) {
      actions.push('refresh_page');
    }
    if (response_lower.includes('clear cache') || response_lower.includes('clear browser')) {
      actions.push('clear_cache');
    }
    if (response_lower.includes('reset password') || response_lower.includes('forgot password')) {
      actions.push('reset_password');
    }
    if (response_lower.includes('contact support') || response_lower.includes('create ticket')) {
      actions.push('create_ticket');
    }
    if (response_lower.includes('try again') || response_lower.includes('retry')) {
      actions.push('retry');
    }

    return actions;
  }

  static getFallbackResponse(userMessage) {
    // Fallback response system when OpenAI is not available
    const message_lower = userMessage.toLowerCase();
    
    // Check for positive responses (issue resolved)
    const positiveIndicators = [
      'yes', 'yeah', 'yep', 'worked', 'fixed', 'solved', 'resolved',
      'thank you', 'thanks', 'it works', 'working now', 'that helped'
    ];

    const isPositive = positiveIndicators.some(indicator => 
      message_lower.includes(indicator)
    );

    if (isPositive) {
      return {
        message: "🎉 Excellent! I'm glad I could help resolve your issue. Your issue has been marked as resolved. Is there anything else I can help you with today?",
        isResolved: true,
        confidence: 0.9,
        suggestedActions: ['mark_resolved']
      };
    }

    // Basic fallback responses
    if (message_lower.includes('login') || message_lower.includes('password')) {
      return {
        message: "I can help with login issues. Try these steps:\n1. Clear your browser cache\n2. Reset your password\n3. Try incognito mode\n\nDid this help resolve your login issue?",
        isResolved: false,
        confidence: 0.7,
        suggestedActions: ['clear_cache', 'reset_password']
      };
    }

    if (message_lower.includes('payment') || message_lower.includes('billing')) {
      return {
        message: "For payment issues, please check:\n1. Card details are correct\n2. Sufficient funds available\n3. Card not expired\n\nIf the issue persists, I can create a support ticket for you. Did this help?",
        isResolved: false,
        confidence: 0.6,
        suggestedActions: ['retry', 'create_ticket']
      };
    }

    // Default fallback
    return {
      message: "I understand you need help. Could you please provide more details about your issue so I can assist you better? You can also choose from the common issue categories below.",
      isResolved: false,
      confidence: 0.4,
      suggestedActions: ['clarify_issue']
    };
  }

  static async markIssueAsResolved(issueId, resolutionDetails) {
    // This would typically save to a database
    // For now, we'll store in localStorage as a demo
    try {
      const resolvedIssues = JSON.parse(localStorage.getItem('resolvedIssues') || '[]');
      
      const resolvedIssue = {
        id: issueId,
        resolvedAt: new Date().toISOString(),
        resolutionMethod: 'chatbot',
        details: resolutionDetails,
        customerSatisfied: true
      };

      resolvedIssues.push(resolvedIssue);
      localStorage.setItem('resolvedIssues', JSON.stringify(resolvedIssues));

      console.log('Issue marked as resolved:', resolvedIssue);
      return resolvedIssue;
    } catch (error) {
      console.error('Error marking issue as resolved:', error);
      return null;
    }
  }

  static async analyzeConversationForTicket(conversationHistory, currentContext = {}) {
    try {
      // If no API key is available, fall back to rule-based analysis
      if (!this.API_KEY || this.API_KEY === 'your-openai-api-key-here') {
        console.log('OpenAI API key not configured, using fallback ticket analysis');
        return this.getFallbackTicketAnalysis(conversationHistory, currentContext);
      }

      console.log('Using OpenAI for ticket analysis...');
      const analysisPrompt = this.buildTicketAnalysisPrompt(conversationHistory, currentContext);

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: analysisPrompt
            },
            {
              role: 'user',
              content: `Please analyze this conversation and extract ticket details:\n\n${this.formatConversationForAnalysis(conversationHistory)}`
            }
          ],
          max_tokens: 400,
          temperature: 0.3 // Lower temperature for more consistent analysis
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      let analysisResult = {};
      
      try {
        const content = data.choices[0]?.message?.content || '{}';
        analysisResult = JSON.parse(content);
      } catch (parseError) {
        console.warn('Failed to parse OpenAI JSON response, using fallback:', parseError);
        return this.getFallbackTicketAnalysis(conversationHistory, currentContext);
      }

      return {
        subject: analysisResult.subject || 'Customer Support Request',
        description: analysisResult.description || 'Customer needs assistance based on chat conversation.',
        priority: analysisResult.priority || 'MEDIUM',
        category: analysisResult.category || 'General Support',
        suggestedSolution: analysisResult.suggestedSolution || '',
        customerSentiment: analysisResult.customerSentiment || 'neutral',
        urgencyLevel: analysisResult.urgencyLevel || 'standard',
        tags: analysisResult.tags || [],
        confidence: analysisResult.confidence || 0.7
      };

    } catch (error) {
      console.error('Conversation analysis error:', error);
      return this.getFallbackTicketAnalysis(conversationHistory, currentContext);
    }
  }

  static buildTicketAnalysisPrompt(conversationHistory, context) {
    return `You are an expert customer support analyst. Your task is to analyze customer conversations and extract structured ticket information.

ANALYSIS REQUIREMENTS:
1. Create a clear, professional ticket subject (max 60 chars)
2. Write a comprehensive description of the issue
3. Determine appropriate priority level
4. Categorize the issue type
5. Assess customer sentiment and urgency

PRIORITY LEVELS:
- LOW: General inquiries, feature requests
- MEDIUM: Standard issues, account questions
- HIGH: Service problems, payment issues
- CRITICAL: Account locked, service completely down

CATEGORIES:
- Login Issues: Authentication, password, access problems
- Payment Problems: Billing, transactions, refunds
- Account Settings: Profile, preferences, configuration
- Technical Support: Bugs, errors, performance
- General Support: Questions, guidance, other

SENTIMENT ANALYSIS:
- positive: Customer is calm, satisfied
- neutral: Customer is asking for help normally
- frustrated: Customer is annoyed or impatient
- angry: Customer is very upset or demanding immediate action

OUTPUT FORMAT:
Respond with a JSON object containing:
{
  "subject": "Brief ticket title",
  "description": "Detailed issue description with context",
  "priority": "LOW|MEDIUM|HIGH|CRITICAL",
  "category": "Category name",
  "suggestedSolution": "Recommended next steps",
  "customerSentiment": "positive|neutral|frustrated|angry",
  "urgencyLevel": "low|standard|high|urgent",
  "tags": ["relevant", "keywords"],
  "confidence": 0.8
}

Current context: ${JSON.stringify(context)}

Analyze the conversation and provide ticket details:`;
  }

  static formatConversationForAnalysis(conversationHistory) {
    return conversationHistory
      .map(msg => `${msg.type === 'user' ? 'Customer' : 'Assistant'}: ${msg.message}`)
      .join('\n');
  }

  static getFallbackTicketAnalysis(conversationHistory, context) {
    console.log('Running fallback ticket analysis with:', { conversationHistory, context });
    
    // Fallback analysis when OpenAI is not available
    const userMessages = conversationHistory.filter(msg => msg.type === 'user');
    const firstUserMessage = userMessages[0]?.message || '';
    
    // Determine category based on context or keywords
    let category = context.category || 'General Support';
    let priority = 'MEDIUM';
    let urgencyLevel = 'standard';
    
    // Analyze keywords for priority
    const urgentKeywords = ['urgent', 'critical', 'emergency', 'immediately', 'asap', 'can\'t access', 'not working'];
    const highKeywords = ['problem', 'issue', 'error', 'failed', 'broken', 'trouble'];
    
    const allText = conversationHistory.map(msg => msg.message).join(' ').toLowerCase();
    
    if (urgentKeywords.some(keyword => allText.includes(keyword))) {
      priority = 'HIGH';
      urgencyLevel = 'high';
    } else if (highKeywords.some(keyword => allText.includes(keyword))) {
      priority = 'MEDIUM';
      urgencyLevel = 'standard';
    } else {
      priority = 'LOW';
      urgencyLevel = 'low';
    }
    
    // Determine sentiment based on keywords
    let sentiment = 'neutral';
    const frustratedKeywords = ['frustrated', 'annoying', 'slow', 'terrible', 'horrible'];
    const angryKeywords = ['angry', 'unacceptable', 'ridiculous', 'worst', 'hate'];
    
    if (angryKeywords.some(keyword => allText.includes(keyword))) {
      sentiment = 'angry';
      priority = 'HIGH';
    } else if (frustratedKeywords.some(keyword => allText.includes(keyword))) {
      sentiment = 'frustrated';
    }
    
    // Create subject
    const subject = context.issue 
      ? `${category}: ${context.issue}` 
      : firstUserMessage.length > 50 
        ? firstUserMessage.substring(0, 50) + '...'
        : firstUserMessage || 'Customer Support Request';
    
    // Create description
    const description = `Customer Issue: ${category}
    
Issue Details:
${userMessages.map((msg, index) => `${index + 1}. ${msg.message}`).join('\n')}

Conversation Summary:
The customer contacted support regarding ${category.toLowerCase()}. ${context.issue ? `Specifically about: ${context.issue}.` : ''} 
Previous troubleshooting attempts were made through the chatbot but the issue requires human attention.

Customer Sentiment: ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
Recommended Action: Assign to ${category.replace(' ', '').toLowerCase()} specialist for resolution.`;

    return {
      subject,
      description,
      priority,
      category,
      suggestedSolution: `Review customer's ${category.toLowerCase()} issue and provide personalized assistance.`,
      customerSentiment: sentiment,
      urgencyLevel,
      tags: [category.toLowerCase().replace(' ', ''), sentiment],
      confidence: 0.6
    };
  }

  static getResolvedIssues() {
    try {
      return JSON.parse(localStorage.getItem('resolvedIssues') || '[]');
    } catch (error) {
      console.error('Error getting resolved issues:', error);
      return [];
    }
  }
}

export default OpenAIService;