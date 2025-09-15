// ChatBot Service - Handles conversation logic and responses with OpenAI integration
import OpenAIService from './OpenAIService';

class ChatBotService {
  static knowledgeBase = {
    "Login Issues": {
      keywords: ["login", "signin", "password", "username", "access", "authenticate", "forgot"],
      solutions: [
        {
          question: "Are you having trouble with your password?",
          options: ["Yes, forgot password", "Yes, password not working", "No, other login issue"],
          responses: {
            "Yes, forgot password": {
              message: "🔐 No worries! Here's how to reset your password:\n\n1. Go to the login page\n2. Click 'Forgot Password'\n3. Enter your email address\n4. Check your email for reset link\n5. Follow the instructions in the email\n\nDid this help resolve your issue?",
              options: ["Yes, problem solved!", "No, still having issues"]
            },
            "Yes, password not working": {
              message: "🔍 Let's troubleshoot this:\n\n1. Make sure Caps Lock is OFF\n2. Check for extra spaces\n3. Try typing your password in a text editor first\n4. Clear your browser cache\n5. Try incognito/private mode\n\nAre you able to login now?",
              options: ["Yes, it worked!", "No, still can't login"]
            },
            "No, other login issue": {
              message: "🤔 I see. Let me help you with other common login issues:\n\n• Account locked: Wait 15 minutes and try again\n• Browser issues: Try a different browser\n• Email not verified: Check your email for verification link\n• Account suspended: This needs admin review\n\nWhich of these sounds like your issue?",
              options: ["Account locked", "Browser issues", "Email not verified", "Account suspended", "None of these"]
            }
          }
        }
      ]
    },
    
    "Payment Problems": {
      keywords: ["payment", "billing", "charge", "invoice", "credit card", "transaction", "refund"],
      solutions: [
        {
          question: "What type of payment issue are you experiencing?",
          options: ["Payment failed", "Wrong amount charged", "Refund request", "Billing question"],
          responses: {
            "Payment failed": {
              message: "💳 Payment failures can happen for several reasons:\n\n• Insufficient funds\n• Expired card\n• Incorrect card details\n• Bank security block\n• Network timeout\n\nPlease check your card details and try again. If it still fails, contact your bank.\n\nDid this help?",
              options: ["Yes, payment went through", "No, still failing"]
            },
            "Wrong amount charged": {
              message: "💰 I understand your concern about billing. Here's what to check:\n\n• Review your subscription plan\n• Check for any additional services\n• Look for taxes or fees\n• Verify the billing period\n\nFor billing disputes, I'll need to create a ticket for our billing team.\n\nShould I create a ticket for you?",
              options: ["Yes, create ticket", "No, I found the issue"]
            },
            "Refund request": {
              message: "💸 Refund requests need to be reviewed by our billing team. I'll create a ticket with the following information:\n\n• Transaction details\n• Reason for refund\n• Account information\n\nShall I proceed with creating a refund request ticket?",
              options: ["Yes, create refund ticket", "No, cancel request"]
            }
          }
        }
      ]
    },

    "Account Settings": {
      keywords: ["profile", "settings", "account", "information", "update", "change", "edit"],
      solutions: [
        {
          question: "What would you like to update in your account?",
          options: ["Personal information", "Email/Password", "Notification settings", "Delete account"],
          responses: {
            "Personal information": {
              message: "👤 To update your personal information:\n\n1. Go to Account Settings\n2. Click on 'Profile Information'\n3. Edit the fields you want to change\n4. Click 'Save Changes'\n\nNote: Some changes may require email verification.\n\nWere you able to update your information?",
              options: ["Yes, updated successfully", "No, having trouble"]
            },
            "Email/Password": {
              message: "🔐 To change your email or password:\n\n**For Email:**\n1. Go to Account Settings > Email\n2. Enter new email and confirm\n3. Verify via email link\n\n**For Password:**\n1. Go to Account Settings > Security\n2. Click 'Change Password'\n3. Enter current and new password\n\nDid this work for you?",
              options: ["Yes, changed successfully", "No, need help"]
            },
            "Delete account": {
              message: "⚠️ Account deletion is permanent and cannot be undone. This will:\n\n• Delete all your data\n• Cancel active subscriptions\n• Remove access to services\n\nThis requires manual processing. Should I create a ticket for account deletion?",
              options: ["Yes, create deletion ticket", "No, keep my account"]
            }
          }
        }
      ]
    },

    "Technical Support": {
      keywords: ["error", "bug", "crash", "slow", "not working", "technical", "issue"],
      solutions: [
        {
          question: "What technical issue are you experiencing?",
          options: ["Website not loading", "Error messages", "Performance issues", "Feature not working"],
          responses: {
            "Website not loading": {
              message: "🌐 Let's troubleshoot website loading issues:\n\n1. Check your internet connection\n2. Try refreshing the page (Ctrl+F5)\n3. Clear browser cache and cookies\n4. Disable browser extensions\n5. Try incognito/private mode\n6. Use a different browser\n\nIs the website loading now?",
              options: ["Yes, it's working", "No, still not loading"]
            },
            "Error messages": {
              message: "❌ Error messages can help us identify the issue. Common solutions:\n\n• Refresh the page\n• Check internet connection\n• Clear browser cache\n• Update your browser\n• Disable ad blockers\n\nIf you're still getting errors, I'll need the exact error message to help further.\n\nAre you still seeing errors?",
              options: ["No, errors gone", "Yes, still getting errors"]
            },
            "Performance issues": {
              message: "🐌 Slow performance can be improved by:\n\n• Closing unused browser tabs\n• Clearing browser cache\n• Checking internet speed\n• Disabling browser extensions\n• Restarting your browser\n• Using a wired connection\n\nIs the performance better now?",
              options: ["Yes, much faster", "No, still slow"]
            }
          }
        }
      ]
    }
  };

  static async processMessage(message, context, conversationHistory = []) {
    const response = {
      message: "",
      options: null,
      context: { ...context, attempts: context.attempts + 1 },
      isResolved: false,
      confidence: 0.5
    };

    // Try OpenAI first for intelligent responses
    try {
      const aiResponse = await OpenAIService.getIntelligentResponse(
        message, 
        conversationHistory, 
        context
      );

      // If OpenAI indicates the issue is resolved
      if (aiResponse.isResolved) {
        // Mark issue as resolved
        const issueId = `issue_${Date.now()}`;
        await OpenAIService.markIssueAsResolved(issueId, {
          category: context.category,
          originalMessage: message,
          resolutionMessage: aiResponse.message,
          conversationHistory: conversationHistory
        });

        response.message = aiResponse.message;
        response.isResolved = true;
        response.confidence = aiResponse.confidence;
        response.context = { 
          ...context, 
          resolved: true, 
          resolvedAt: new Date().toISOString(),
          resolutionMethod: 'ai_assistant'
        };
        response.options = ["Start New Issue", "End Chat"];
        return response;
      }

      // If AI suggests creating a ticket
      if (aiResponse.suggestedActions && aiResponse.suggestedActions.includes('create_ticket')) {
        response.context.escalationReady = true;
        response.message = aiResponse.message + "\n\nWould you like me to create a support ticket for you?";
        response.options = ['Yes, Create Ticket', 'No, Continue Trying'];
        return response;
      }

      // Regular AI response
      response.message = aiResponse.message;
      response.confidence = aiResponse.confidence;
      
      // Determine if we should provide options or wait for user response
      if (aiResponse.suggestedActions && aiResponse.suggestedActions.length > 0) {
        response.options = this.generateOptionsFromActions(aiResponse.suggestedActions);
      } else {
        response.options = ["Yes, that helped!", "No, still having issues", "Try something else"];
      }

      return response;

    } catch (error) {
      console.error('AI processing failed, falling back to rule-based system:', error);
      
      // Fallback to original rule-based system
      return this.processMessageFallback(message, context);
    }
  }

  static generateOptionsFromActions(actions) {
    const actionMap = {
      'refresh_page': 'Refresh Page',
      'clear_cache': 'Clear Browser Cache',
      'reset_password': 'Reset Password',
      'create_ticket': 'Create Support Ticket',
      'retry': 'Try Again',
      'mark_resolved': 'Issue Resolved!'
    };

    const options = actions.map(action => actionMap[action] || action).filter(Boolean);
    
    // Always add generic options
    options.push("That helped!", "Still not working", "Try different approach");
    
    return [...new Set(options)]; // Remove duplicates
  }

  static async processMessageFallback(message, context) {
    const response = {
      message: "",
      options: null,
      context: { ...context, attempts: context.attempts + 1 }
    };

    // If no category selected yet, analyze message for category
    if (!context.category) {
      const detectedCategory = this.detectCategory(message);
      if (detectedCategory) {
        response.context.category = detectedCategory;
        const categoryData = this.knowledgeBase[detectedCategory];
        const firstSolution = categoryData.solutions[0];
        
        response.message = `I can help you with ${detectedCategory.toLowerCase()}! ${firstSolution.question}`;
        response.options = firstSolution.options;
        return response;
      } else {
        response.message = "I understand you need help. Could you please select the category that best describes your issue?";
        response.options = Object.keys(this.knowledgeBase).concat(["Other Issue"]);
        return response;
      }
    }

    // If category is set but no specific issue, this is a follow-up message
    if (context.category && !context.issue) {
      // This is likely a response to a solution attempt
      if (this.isPositiveResponse(message)) {
        response.message = "🎉 Great! I'm glad I could help resolve your issue. Is there anything else I can help you with today?";
        response.options = ["Yes, another issue", "No, all good"];
        response.context = { category: null, issue: null, attempts: 0, escalationReady: false };
        return response;
      } else {
        response.context.escalationReady = true;
        response.message = "I understand this didn't resolve your issue. Let me try a different approach or connect you with human support.";
        return response;
      }
    }

    // Check if we should escalate after multiple attempts
    if (context.attempts >= 3) {
      response.context.escalationReady = true;
      response.message = "I've tried several solutions but it seems like this issue needs specialized attention. Let me create a support ticket for you.";
      return response;
    }

    // Default response for unclear messages
    response.message = "I want to make sure I understand your issue correctly. Could you provide more details or select from the options below?";
    response.options = Object.keys(this.knowledgeBase).concat(["Create a ticket"]);
    
    return response;
  }

  static async processOption(option, context, conversationHistory = []) {
    const response = {
      message: "",
      options: null,
      context: { ...context },
      isResolved: false
    };

    // Handle resolution confirmation
    if (option === "That helped!" || option === "Issue Resolved!" || option === "Yes, that helped!") {
      // Mark issue as resolved
      const issueId = `issue_${Date.now()}`;
      await OpenAIService.markIssueAsResolved(issueId, {
        category: context.category,
        issue: context.issue,
        resolutionMethod: 'user_confirmation',
        conversationHistory: conversationHistory
      });

      response.message = "🎉 Excellent! I'm happy I could help resolve your issue. Your issue has been marked as resolved. Is there anything else I can assist you with?";
      response.options = ["Yes, another issue", "No, all good"];
      response.isResolved = true;
      response.context = { 
        category: null, 
        issue: null, 
        attempts: 0, 
        escalationReady: false,
        resolved: true,
        resolvedAt: new Date().toISOString()
      };
      return response;
    }

    // Handle continued issues
    if (option === "Still not working" || option === "No, still having issues" || option.includes("still")) {
      // Try OpenAI for alternative solution
      try {
        const aiResponse = await OpenAIService.getIntelligentResponse(
          `The previous solution didn't work. Issue: ${context.category} - ${context.issue}. Please provide an alternative solution.`,
          conversationHistory,
          { ...context, needsAlternative: true }
        );

        response.message = aiResponse.message;
        response.confidence = aiResponse.confidence;
        response.options = ["That worked!", "Still having issues", "Create a ticket"];
        
        if (aiResponse.suggestedActions && aiResponse.suggestedActions.includes('create_ticket')) {
          response.context.escalationReady = true;
        }
        
        return response;
      } catch (error) {
        console.error('AI alternative solution failed:', error);
        response.context.escalationReady = true;
        response.message = "I understand the previous solution didn't work. Let me create a support ticket for personalized assistance.";
        return response;
      }
    }

    // Handle main category selection
    if (Object.keys(this.knowledgeBase).includes(option)) {
      response.context.category = option;
      const categoryData = this.knowledgeBase[option];
      const firstSolution = categoryData.solutions[0];
      
      response.message = firstSolution.question;
      response.options = firstSolution.options;
      return response;
    }

    // Handle sub-category responses
    if (context.category && this.knowledgeBase[context.category]) {
      const categoryData = this.knowledgeBase[context.category];
      const solution = categoryData.solutions[0];
      
      if (solution.responses[option]) {
        const solutionResponse = solution.responses[option];
        response.message = solutionResponse.message;
        response.options = solutionResponse.options;
        response.context.issue = option;
        return response;
      }
    }

    // Handle negative feedback or escalation requests
    if (option.includes("No,") || option === "Create a ticket" || option === "Create Support Ticket") {
      response.context.escalationReady = true;
      response.message = "I understand this issue requires further assistance. Let me help you create a support ticket for personalized help.";
      return response;
    }

    // Handle restart conversation
    if (option === "Yes, another issue" || option === "Start New Issue") {
      response.message = "Of course! What can I help you with now?";
      response.options = Object.keys(this.knowledgeBase).concat(["Other Issue"]);
      response.context = { category: null, issue: null, attempts: 0, escalationReady: false };
      return response;
    }

    if (option === "No, all good" || option === "End Chat") {
      response.message = "Perfect! Thank you for using our support chat. Have a great day! 👋";
      response.context = { category: null, issue: null, attempts: 0, escalationReady: false };
      return response;
    }

    // Default fallback
    response.message = "I want to make sure I provide the best help. Could you clarify what you need assistance with?";
    response.options = Object.keys(this.knowledgeBase).concat(["Create a ticket"]);
    
    return response;
  }

  static detectCategory(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      const keywords = data.keywords;
      const foundKeywords = keywords.filter(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      );
      
      if (foundKeywords.length > 0) {
        return category;
      }
    }
    
    return null;
  }

  static isPositiveResponse(message) {
    const positiveIndicators = [
      "yes", "yeah", "yep", "solved", "worked", "fixed", "resolved", 
      "good", "great", "perfect", "thanks", "thank you", "success"
    ];
    
    const lowerMessage = message.toLowerCase();
    return positiveIndicators.some(indicator => lowerMessage.includes(indicator));
  }

  static isNegativeResponse(message) {
    const negativeIndicators = [
      "no", "nope", "still", "not working", "didn't work", "failed", 
      "issue", "problem", "help", "stuck"
    ];
    
    const lowerMessage = message.toLowerCase();
    return negativeIndicators.some(indicator => lowerMessage.includes(indicator));
  }
}

export default ChatBotService;